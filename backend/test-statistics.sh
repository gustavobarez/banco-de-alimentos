#!/bin/bash

# Script de teste dos endpoints de estatísticas
# Execute este script para testar todos os endpoints

API_URL="http://localhost:3000"

echo "═══════════════════════════════════════════════════════════"
echo "🧪 TESTES DOS ENDPOINTS DE ESTATÍSTICAS"
echo "═══════════════════════════════════════════════════════════"

echo ""
echo "1️⃣  Alimentos mais doados no mês"
echo "─────────────────────────────────────────────────────────"
curl -X GET "$API_URL/statistics/top-foods-month" \
  -H "Content-Type: application/json" | jq .

echo ""
echo ""
echo "2️⃣  Saldo por lote (com data de validade)"
echo "─────────────────────────────────────────────────────────"
curl -X GET "$API_URL/statistics/inventory-by-lot" \
  -H "Content-Type: application/json" | jq .

echo ""
echo ""
echo "3️⃣  Distribuição por instituição"
echo "─────────────────────────────────────────────────────────"
curl -X GET "$API_URL/statistics/distribution-by-institution" \
  -H "Content-Type: application/json" | jq .

echo ""
echo ""
echo "4️⃣  Doadores mais ativos (Top 10)"
echo "─────────────────────────────────────────────────────────"
curl -X GET "$API_URL/statistics/top-donors" \
  -H "Content-Type: application/json" | jq .

echo ""
echo ""
echo "5️⃣  Alimentos próximos ao vencimento (7 dias)"
echo "─────────────────────────────────────────────────────────"
curl -X GET "$API_URL/statistics/expiring-items" \
  -H "Content-Type: application/json" | jq .

echo ""
echo ""
echo "6️⃣  Resumo mensal (últimos 12 meses)"
echo "─────────────────────────────────────────────────────────"
curl -X GET "$API_URL/statistics/monthly-summary" \
  -H "Content-Type: application/json" | jq .

echo ""
echo ""
echo "7️⃣  Relatório de estoque atual"
echo "─────────────────────────────────────────────────────────"
curl -X GET "$API_URL/statistics/inventory-report" \
  -H "Content-Type: application/json" | jq .

echo ""
echo ""
echo "8️⃣  Eficiência de distribuição por instituição"
echo "─────────────────────────────────────────────────────────"
curl -X GET "$API_URL/statistics/distribution-efficiency" \
  -H "Content-Type: application/json" | jq .

echo ""
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Testes concluídos!"
echo "═══════════════════════════════════════════════════════════"
