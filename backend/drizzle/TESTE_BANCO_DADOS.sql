-- ═══════════════════════════════════════════════════════════
-- GUIA DE TESTES - BANCO DE DADOS
-- Banco de Alimentos - 2ª Entrega
-- ═══════════════════════════════════════════════════════════

-- 🔐 Conectar ao banco
-- psql -h localhost -U usuario -d banco_de_alimentos

-- ═══════════════════════════════════════════════════════════
-- PARTE 1: VERIFICAR DADOS INSERIDOS
-- ═══════════════════════════════════════════════════════════

-- Contar doadores
SELECT COUNT(*) as total_doadores FROM donors;
-- Esperado: 5

-- Contar instituições
SELECT COUNT(*) as total_instituicoes FROM institutions;
-- Esperado: 4

-- Contar doações
SELECT COUNT(*) as total_doacoes FROM donations;
-- Esperado: 20+

-- Listar alguns doadores
SELECT id, name, email, phone FROM donors LIMIT 5;

-- Listar algumas instituições
SELECT id, name, cnpj, responsible_person FROM institutions LIMIT 5;

-- Listar algumas doações com informações
SELECT 
  d.id,
  d.food_type,
  d.quantity,
  d.unit,
  d.expiration_date,
  d.status,
  d.created_at
FROM donations d
LIMIT 10;

-- ═══════════════════════════════════════════════════════════
-- PARTE 2: TESTAR VIEWS
-- ═══════════════════════════════════════════════════════════

-- 1️⃣ VIEW: Estoque por validade
SELECT * FROM v_estoque_por_validade LIMIT 10;
-- Deve mostrar alimentos com status de validade

-- 2️⃣ VIEW: Doações por período
SELECT * FROM v_doacoes_por_periodo;
-- Deve mostrar dados agrupados por mês

-- 3️⃣ VIEW: Alimentos mais doados
SELECT * FROM v_alimentos_mais_doados;
-- Deve mostrar ranking dos últimos 30 dias

-- 4️⃣ VIEW: Distribuição por instituição
SELECT * FROM v_distribuicao_por_instituicao;
-- Deve mostrar doações por instituição

-- ═══════════════════════════════════════════════════════════
-- PARTE 3: TESTAR STORED PROCEDURES
-- ═══════════════════════════════════════════════════════════

-- 1️⃣ REGISTRAR NOVA DOAÇÃO (Sucesso)
SELECT * FROM registrar_doacao(
  1,                              -- donor_id
  1,                              -- institution_id
  'Arroz Integral',              -- food_type
  75,                            -- quantity
  'kg',                          -- unit
  '2025-12-31'                   -- expiration_date
);
-- Esperado: donation_id > 0, success = true

-- 2️⃣ REGISTRAR DOAÇÃO (Erro - Doador não existe)
SELECT * FROM registrar_doacao(
  999,                            -- donor_id não existe
  1,
  'Arroz',
  50,
  'kg',
  '2025-12-31'
);
-- Esperado: success = false, "Doador não encontrado"

-- 3️⃣ REGISTRAR DOAÇÃO (Erro - Quantidade negativa)
SELECT * FROM registrar_doacao(
  1,
  1,
  'Arroz',
  -10,                           -- quantidade negativa
  'kg',
  '2025-12-31'
);
-- Esperado: success = false, "Quantidade deve ser maior que zero"

-- 4️⃣ RETIRAR/ATUALIZAR DOAÇÃO
-- Primeiro, pegar o ID de uma doação
SELECT id FROM donations WHERE status = 'pending' LIMIT 1;
-- Depois executar:
SELECT * FROM retirar_doacao(1, 'completed');
-- Esperado: success = true

-- ═══════════════════════════════════════════════════════════
-- PARTE 4: TESTAR TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- 1️⃣ VALIDAÇÃO - Tentar inserir com quantidade 0
BEGIN;
INSERT INTO donations (donor_id, institution_id, food_type, quantity, unit, status)
VALUES (1, 1, 'Teste', 0, 'kg', 'pending');
-- Esperado: ERRO - "Quantidade deve ser maior que zero"
ROLLBACK;

-- 2️⃣ VALIDAÇÃO - Tentar inserir com data no passado
BEGIN;
INSERT INTO donations (donor_id, institution_id, food_type, quantity, unit, expiration_date, status)
VALUES (1, 1, 'Teste', 10, 'kg', '2020-01-01', 'pending');
-- Esperado: ERRO - "Data de validade não pode ser no passado"
ROLLBACK;

-- 3️⃣ AUDITORIA - Verificar histórico de mudanças
SELECT * FROM donation_audit;
-- Deve mostrar todas as alterações registradas

-- Ver histórico de uma doação específica
SELECT * FROM donation_audit WHERE donation_id = 1;

-- ═══════════════════════════════════════════════════════════
-- PARTE 5: CONSULTAS DE NEGÓCIO
-- ═══════════════════════════════════════════════════════════

-- 1️⃣ Alimentos mais doados no mês
SELECT 
  food_type,
  COUNT(*) as total_doacoes,
  SUM(CAST(quantity AS FLOAT)) as quantidade_total,
  unit,
  ROUND(AVG(CAST(quantity AS FLOAT))::numeric, 2) as quantidade_media
FROM donations
WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
GROUP BY food_type, unit
ORDER BY quantidade_total DESC;

-- 2️⃣ Saldo por lote (estoque com validade)
SELECT 
  id as lote_id,
  food_type,
  quantity,
  unit,
  expiration_date,
  CASE 
    WHEN expiration_date IS NULL THEN 'Indefinida'
    WHEN expiration_date > NOW()::date THEN 'Válido'
    ELSE 'Vencido'
  END as status_validade,
  (expiration_date - NOW()::date) as dias_restantes,
  status as status_doacao,
  created_at
FROM donations
WHERE status = 'pending'
ORDER BY expiration_date ASC NULLS LAST;

-- 3️⃣ Distribuição por instituição no trimestre
SELECT 
  i.name as instituicao,
  i.cnpj,
  COUNT(d.id) as total_doacoes_recebidas,
  SUM(CAST(d.quantity AS FLOAT)) as quantidade_total_recebida,
  ROUND(AVG(CAST(d.quantity AS FLOAT))::numeric, 2) as media_por_doacao,
  MAX(d.created_at) as ultima_doacao
FROM institutions i
LEFT JOIN donations d ON i.id = d.institution_id
  AND DATE_TRUNC('quarter', d.created_at) = DATE_TRUNC('quarter', NOW())
GROUP BY i.id, i.name, i.cnpj
ORDER BY quantidade_total_recebida DESC NULLS LAST;

-- 4️⃣ Doadores mais ativos (Top 10)
SELECT 
  d.name as doador,
  COUNT(don.id) as total_doacoes,
  SUM(CAST(don.quantity AS FLOAT)) as quantidade_total_doada,
  COUNT(DISTINCT don.institution_id) as instituicoes_atendidas,
  MAX(don.created_at) as ultima_doacao
FROM donors d
LEFT JOIN donations don ON d.id = don.donor_id
GROUP BY d.id, d.name
ORDER BY total_doacoes DESC
LIMIT 10;

-- 5️⃣ Alimentos próximos ao vencimento (próximos 7 dias)
SELECT 
  d.id,
  d.food_type,
  d.quantity,
  d.unit,
  d.expiration_date,
  (d.expiration_date - NOW()::date) as dias_restantes,
  i.name as instituicao_destino
FROM donations d
LEFT JOIN institutions i ON d.institution_id = i.id
WHERE d.expiration_date IS NOT NULL
  AND d.expiration_date > NOW()::date
  AND d.expiration_date <= NOW()::date + INTERVAL '7 days'
  AND d.status = 'pending'
ORDER BY d.expiration_date ASC;

-- 6️⃣ Resumo mensal de doações (últimos 12 meses)
SELECT 
  TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as mes,
  COUNT(*) as total_doacoes,
  SUM(CAST(quantity AS FLOAT)) as quantidade_total,
  COUNT(DISTINCT donor_id) as doadores_unicos,
  COUNT(DISTINCT institution_id) as instituicoes_beneficiadas,
  ROUND(AVG(CAST(quantity AS FLOAT))::numeric, 2) as media_por_doacao
FROM donations
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes DESC;

-- 7️⃣ Relatório de estoque atual
SELECT 
  food_type,
  SUM(CAST(quantity AS FLOAT)) as quantidade_total,
  unit,
  COUNT(id) as numero_lotes,
  MIN(expiration_date) as proxima_validade,
  MAX(expiration_date) as ultima_validade,
  SUM(CASE WHEN expiration_date > NOW()::date THEN CAST(quantity AS FLOAT) ELSE 0 END) as quantidade_valida,
  SUM(CASE WHEN expiration_date <= NOW()::date THEN CAST(quantity AS FLOAT) ELSE 0 END) as quantidade_vencida
FROM donations
WHERE status = 'pending'
GROUP BY food_type, unit
ORDER BY quantidade_total DESC;

-- 8️⃣ Eficiência de distribuição por instituição
SELECT 
  i.name as instituicao,
  ROUND(100.0 * COUNT(CASE WHEN d.status = 'completed' THEN 1 END) / 
        NULLIF(COUNT(d.id), 0), 2) as taxa_conclusao_percent,
  COUNT(d.id) as total_doacoes_recebidas,
  COUNT(CASE WHEN d.status = 'completed' THEN 1 END) as doacoes_concluidas,
  COUNT(CASE WHEN d.status = 'pending' THEN 1 END) as doacoes_pendentes
FROM institutions i
LEFT JOIN donations d ON i.id = d.institution_id
GROUP BY i.id, i.name
ORDER BY taxa_conclusao_percent DESC NULLS LAST;

-- ═══════════════════════════════════════════════════════════
-- PARTE 6: VERIFICAR ÍNDICES
-- ═══════════════════════════════════════════════════════════

-- Listar índices criados
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- Verificar performance de uma query antes/depois
EXPLAIN ANALYZE
SELECT * FROM donations WHERE status = 'pending' AND expiration_date > NOW()::date;

-- ═══════════════════════════════════════════════════════════
-- PARTE 7: INFORMAÇÕES DO BANCO
-- ═══════════════════════════════════════════════════════════

-- Tamanho do banco
SELECT pg_size_pretty(pg_database_size(current_database())) as tamanho_banco;

-- Tamanho de cada tabela
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as tamanho
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Listar todas as views criadas
SELECT schemaname, viewname 
FROM pg_views 
WHERE schemaname = 'public';

-- Listar todas as functions criadas
SELECT 
  routine_schema,
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ═══════════════════════════════════════════════════════════
-- PARTE 8: TESTES DE LIMPEZA
-- ═══════════════════════════════════════════════════════════

-- Limpar auditoria (opcional)
-- DELETE FROM donation_audit;

-- Listar últimas auditoria
SELECT * FROM donation_audit ORDER BY changed_at DESC LIMIT 10;

-- Estatísticas da auditoria
SELECT 
  change_type,
  COUNT(*) as total_changes
FROM donation_audit
GROUP BY change_type
ORDER BY total_changes DESC;

-- ═══════════════════════════════════════════════════════════
-- ✅ FIM DOS TESTES
-- ═══════════════════════════════════════════════════════════
