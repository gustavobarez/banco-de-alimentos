-- Views
-- 1. View: Estoque por Validade
CREATE OR REPLACE VIEW v_estoque_por_validade AS
SELECT 
  d.id,
  d.food_type,
  d.quantity,
  d.unit,
  d.expiration_date,
  d.status,
  d.created_at,
  CASE 
    WHEN d.expiration_date IS NULL THEN 'Sem data de validade'
    WHEN d.expiration_date > NOW()::date THEN 'Válido'
    ELSE 'Vencido'
  END as validity_status,
  (d.expiration_date - NOW()::date) as days_to_expiry
FROM donations d
WHERE d.status = 'pending'
ORDER BY d.expiration_date ASC NULLS LAST;

-- 2. View: Doações por Período
CREATE OR REPLACE VIEW v_doacoes_por_periodo AS
SELECT 
  DATE_TRUNC('month', d.created_at)::date as month,
  COUNT(*) as total_donations,
  SUM(d.quantity) as total_quantity,
  COUNT(DISTINCT d.donor_id) as unique_donors,
  COUNT(DISTINCT d.institution_id) as unique_institutions
FROM donations d
GROUP BY DATE_TRUNC('month', d.created_at)
ORDER BY month DESC;

-- 3. View: Alimentos mais Doados
CREATE OR REPLACE VIEW v_alimentos_mais_doados AS
SELECT 
  d.food_type,
  COUNT(*) as donation_count,
  SUM(d.quantity) as total_quantity,
  d.unit,
  AVG(d.quantity) as avg_quantity
FROM donations d
WHERE d.created_at >= NOW() - INTERVAL '30 days'
GROUP BY d.food_type, d.unit
ORDER BY total_quantity DESC;

-- 4. View: Distribuição por Instituição
CREATE OR REPLACE VIEW v_distribuicao_por_instituicao AS
SELECT 
  i.id,
  i.name,
  i.cnpj,
  COUNT(d.id) as total_donations,
  SUM(d.quantity) as total_quantity,
  d.unit,
  MAX(d.created_at) as last_donation_date
FROM institutions i
LEFT JOIN donations d ON i.id = d.institution_id
GROUP BY i.id, i.name, i.cnpj, d.unit
ORDER BY total_quantity DESC NULLS LAST;

-- Stored Procedures/Functions
-- 1. Function: Registrar Doação com Consistência Transacional
CREATE OR REPLACE FUNCTION registrar_doacao(
  p_donor_id INTEGER,
  p_institution_id INTEGER,
  p_food_type VARCHAR,
  p_quantity DECIMAL,
  p_unit VARCHAR,
  p_expiration_date DATE DEFAULT NULL
)
RETURNS TABLE (
  donation_id INTEGER,
  success BOOLEAN,
  message VARCHAR
) AS $$
DECLARE
  v_donation_id INTEGER;
  v_donor_exists BOOLEAN;
  v_institution_exists BOOLEAN;
BEGIN
  -- Validar se doador existe
  SELECT EXISTS(SELECT 1 FROM donors WHERE id = p_donor_id) INTO v_donor_exists;
  IF NOT v_donor_exists THEN
    RETURN QUERY SELECT NULL::INTEGER, FALSE, 'Doador não encontrado'::VARCHAR;
    RETURN;
  END IF;

  -- Validar se instituição existe
  SELECT EXISTS(SELECT 1 FROM institutions WHERE id = p_institution_id) INTO v_institution_exists;
  IF NOT v_institution_exists THEN
    RETURN QUERY SELECT NULL::INTEGER, FALSE, 'Instituição não encontrada'::VARCHAR;
    RETURN;
  END IF;

  -- Validar quantidade
  IF p_quantity <= 0 THEN
    RETURN QUERY SELECT NULL::INTEGER, FALSE, 'Quantidade deve ser maior que zero'::VARCHAR;
    RETURN;
  END IF;

  -- Inserir doação
  BEGIN
    INSERT INTO donations (donor_id, institution_id, food_type, quantity, unit, expiration_date, status)
    VALUES (p_donor_id, p_institution_id, p_food_type, p_quantity, p_unit, p_expiration_date, 'pending')
    RETURNING id INTO v_donation_id;

    RETURN QUERY SELECT v_donation_id, TRUE, 'Doação registrada com sucesso'::VARCHAR;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT NULL::INTEGER, FALSE, SQLERRM::VARCHAR;
  END;
END;
$$ LANGUAGE plpgsql;

-- 2. Function: Retirar Doação com Consistência Transacional
CREATE OR REPLACE FUNCTION retirar_doacao(
  p_donation_id INTEGER,
  p_new_status VARCHAR DEFAULT 'completed'
)
RETURNS TABLE (
  donation_id INTEGER,
  success BOOLEAN,
  message VARCHAR
) AS $$
DECLARE
  v_current_status VARCHAR;
BEGIN
  -- Verificar se doação existe
  SELECT status INTO v_current_status FROM donations WHERE id = p_donation_id;
  
  IF v_current_status IS NULL THEN
    RETURN QUERY SELECT NULL::INTEGER, FALSE, 'Doação não encontrada'::VARCHAR;
    RETURN;
  END IF;

  -- Validar transição de status
  IF v_current_status = 'completed' THEN
    RETURN QUERY SELECT NULL::INTEGER, FALSE, 'Doação já foi concluída'::VARCHAR;
    RETURN;
  END IF;

  -- Atualizar status
  BEGIN
    UPDATE donations 
    SET status = p_new_status 
    WHERE id = p_donation_id;

    RETURN QUERY SELECT p_donation_id, TRUE, 'Status da doação atualizado com sucesso'::VARCHAR;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT NULL::INTEGER, FALSE, SQLERRM::VARCHAR;
  END;
END;
$$ LANGUAGE plpgsql;

-- Triggers
-- 1. Trigger: Validar doação ao inserir
CREATE OR REPLACE FUNCTION validate_donation()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar quantidade
  IF NEW.quantity <= 0 THEN
    RAISE EXCEPTION 'Quantidade deve ser maior que zero';
  END IF;

  -- Validar datas
  IF NEW.expiration_date IS NOT NULL AND NEW.expiration_date < NOW()::date THEN
    RAISE EXCEPTION 'Data de validade não pode ser no passado';
  END IF;

  -- Validar tamanho do food_type
  IF LENGTH(NEW.food_type) < 2 THEN
    RAISE EXCEPTION 'Tipo de alimento deve ter pelo menos 2 caracteres';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_donation
BEFORE INSERT OR UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION validate_donation();

-- 2. Trigger: Manutenção automática de auditoria
CREATE TABLE IF NOT EXISTS donation_audit (
  id SERIAL PRIMARY KEY,
  donation_id INTEGER NOT NULL,
  old_status VARCHAR,
  new_status VARCHAR,
  changed_at TIMESTAMP DEFAULT NOW(),
  change_type VARCHAR
);

CREATE OR REPLACE FUNCTION audit_donation_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO donation_audit (donation_id, old_status, new_status, change_type)
    VALUES (NEW.id, NULL, NEW.status, 'INSERT');
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      INSERT INTO donation_audit (donation_id, old_status, new_status, change_type)
      VALUES (NEW.id, OLD.status, NEW.status, 'UPDATE');
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO donation_audit (donation_id, old_status, new_status, change_type)
    VALUES (OLD.id, OLD.status, NULL, 'DELETE');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_donations
AFTER INSERT OR UPDATE OR DELETE ON donations
FOR EACH ROW
EXECUTE FUNCTION audit_donation_changes();
