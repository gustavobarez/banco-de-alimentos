-- Consultas SQL de Negócio para Banco de Alimentos

-- 1. Alimentos mais doados no mês
SELECT 
  d.food_type,
  COUNT(*) as total_doacoes,
  SUM(d.quantity) as quantidade_total,
  d.unit,
  ROUND(AVG(d.quantity)::numeric, 2) as quantidade_media
FROM donations d
WHERE DATE_TRUNC('month', d.created_at) = DATE_TRUNC('month', NOW())
GROUP BY d.food_type, d.unit
ORDER BY quantidade_total DESC;

-- 2. Saldo por lote (alimento com data de validade)
SELECT 
  d.id as lote_id,
  d.food_type,
  d.quantity,
  d.unit,
  d.expiration_date,
  CASE 
    WHEN d.expiration_date IS NULL THEN 'Indefinida'
    WHEN d.expiration_date > NOW()::date THEN 'Válido'
    ELSE 'Vencido'
  END as status_validade,
  (d.expiration_date - NOW()::date) as dias_restantes,
  d.status as status_doacao,
  d.created_at
FROM donations d
WHERE d.status = 'pending'
ORDER BY d.expiration_date ASC NULLS LAST;

-- 3. Distribuição por instituição no trimestre
SELECT 
  i.name as instituicao,
  i.cnpj,
  COUNT(d.id) as total_doacoes_recebidas,
  SUM(d.quantity) as quantidade_total_recebida,
  ROUND(AVG(d.quantity)::numeric, 2) as media_por_doacao,
  MAX(d.created_at) as ultima_doacao
FROM institutions i
LEFT JOIN donations d ON i.id = d.institution_id
  AND DATE_TRUNC('quarter', d.created_at) = DATE_TRUNC('quarter', NOW())
GROUP BY i.id, i.name, i.cnpj
ORDER BY quantidade_total_recebida DESC NULLS LAST;

-- 4. Doadores mais ativos (top 10)
SELECT 
  d.name as doador,
  COUNT(don.id) as total_doacoes,
  SUM(don.quantity) as quantidade_total_doada,
  COUNT(DISTINCT don.institution_id) as instituicoes_atendidas,
  MAX(don.created_at) as ultima_doacao
FROM donors d
LEFT JOIN donations don ON d.id = don.donor_id
GROUP BY d.id, d.name
ORDER BY total_doacoes DESC
LIMIT 10;

-- 5. Alimentos próximos ao vencimento (próximos 7 dias)
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

-- 6. Resumo mensal de doações (últimos 12 meses)
SELECT 
  TO_CHAR(DATE_TRUNC('month', d.created_at), 'YYYY-MM') as mes,
  COUNT(*) as total_doacoes,
  SUM(d.quantity) as quantidade_total,
  COUNT(DISTINCT d.donor_id) as doadores_unicos,
  COUNT(DISTINCT d.institution_id) as instituicoes_beneficiadas,
  ROUND(AVG(d.quantity)::numeric, 2) as media_por_doacao
FROM donations d
WHERE d.created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', d.created_at)
ORDER BY mes DESC;

-- 7. Relatório de estoque atual
SELECT 
  d.food_type,
  SUM(d.quantity) as quantidade_total,
  d.unit,
  COUNT(d.id) as numero_lotes,
  MIN(d.expiration_date) as proxima_validade,
  MAX(d.expiration_date) as ultima_validade,
  SUM(CASE WHEN d.expiration_date > NOW()::date THEN d.quantity ELSE 0 END) as quantidade_valida,
  SUM(CASE WHEN d.expiration_date <= NOW()::date THEN d.quantity ELSE 0 END) as quantidade_vencida
FROM donations d
WHERE d.status = 'pending'
GROUP BY d.food_type, d.unit
ORDER BY quantidade_total DESC;

-- 8. Eficiência de distribuição por instituição
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

-- 9. Histórico de movimentação por doador
SELECT 
  d.name as doador,
  d.email,
  d.phone,
  COUNT(don.id) as total_movimentacoes,
  MAX(don.created_at) as ultima_movimentacao,
  STRING_AGG(DISTINCT don.food_type, ', ' ORDER BY don.food_type) as alimentos_doados
FROM donors d
LEFT JOIN donations don ON d.id = don.donor_id
GROUP BY d.id, d.name, d.email, d.phone
ORDER BY MAX(don.created_at) DESC NULLS LAST;

-- 10. Oportunidades de melhoria (alimentos com baixa demanda)
SELECT 
  d.food_type,
  d.unit,
  COUNT(d.id) as total_registros,
  SUM(d.quantity) as quantidade_total,
  ROUND(AVG(d.quantity)::numeric, 2) as media_por_doacao,
  MAX(d.created_at) as ultima_doacao
FROM donations d
WHERE d.created_at >= NOW() - INTERVAL '30 days'
GROUP BY d.food_type, d.unit
HAVING COUNT(d.id) <= 2
ORDER BY COUNT(d.id) DESC;
