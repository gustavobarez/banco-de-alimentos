# 🚀 Guia de Implementação - Passo a Passo

## Fase 1: Setup Inicial

### 1.1 Certificar que o banco está criado

```bash
# Conectar ao PostgreSQL
psql -h localhost -U postgres

# Criar banco de dados
CREATE DATABASE banco_de_alimentos;

# Conectar ao banco
\c banco_de_alimentos

# Confirmar conexão
\dt
```

### 1.2 Configurar variáveis de ambiente

```bash
cd backend

# Criar arquivo .env
echo "DATABASE_URL=postgres://usuario:senha@localhost:5432/banco_de_alimentos" > .env
echo "PORT=3000" >> .env
```

### 1.3 Instalar dependências

```bash
cd backend
pnpm install
# ou
npm install
```

## Fase 2: Executar Migrações

### 2.1 Aplicar primeira migração (Tabelas)

```bash
cd backend

# Opção 1: Usando script do projeto
pnpm run db:migrate

# Opção 2: Manualmente com psql
psql -h localhost -U usuario -d banco_de_alimentos -f drizzle/migrations/001_init.sql
```

### 2.2 Aplicar segunda migração (Views, Procedures, Triggers)

```bash
# Via psql
psql -h localhost -U usuario -d banco_de_alimentos -f drizzle/migrations/002_views_procedures_triggers.sql

# Ou copiar e colar o conteúdo no psql
psql -h localhost -U usuario -d banco_de_alimentos
\i drizzle/migrations/002_views_procedures_triggers.sql
```

### 2.3 Aplicar terceira migração (Dados de Teste)

```bash
psql -h localhost -U usuario -d banco_de_alimentos -f drizzle/migrations/003_test_data.sql
```

### 2.4 Verificar migrações bem-sucedidas

```bash
psql -h localhost -U usuario -d banco_de_alimentos

# Listar tabelas
\dt

# Listar views
\dv

# Listar functions
\df

# Contar dados
SELECT COUNT(*) FROM donors;
SELECT COUNT(*) FROM institutions;
SELECT COUNT(*) FROM donations;
```

## Fase 3: Iniciar Backend

### 3.1 Iniciar servidor em modo desenvolvimento

```bash
cd backend
pnpm run start:dev
```

### 3.2 Verificar se está rodando

```bash
# Em outro terminal
curl http://localhost:3000/api
# Deve retornar documentação Swagger
```

### 3.3 Acessar Swagger

```
http://localhost:3000/api
```

## Fase 4: Testar Endpoints

### 4.1 Testar endpoint simples

```bash
# Listar doadores
curl http://localhost:3000/donors

# Listar instituições
curl http://localhost:3000/institutions

# Listar doações
curl http://localhost:3000/donations
```

### 4.2 Testar novos endpoints de estatísticas

```bash
# Alimentos mais doados
curl http://localhost:3000/statistics/top-foods-month

# Doadores mais ativos
curl http://localhost:3000/statistics/top-donors

# Estoque por lote
curl http://localhost:3000/statistics/inventory-by-lot

# Alimentos vencendo
curl http://localhost:3000/statistics/expiring-items

# Distribuição por instituição
curl http://localhost:3000/statistics/distribution-by-institution

# Resumo mensal
curl http://localhost:3000/statistics/monthly-summary

# Relatório de estoque
curl http://localhost:3000/statistics/inventory-report

# Eficiência de distribuição
curl http://localhost:3000/statistics/distribution-efficiency
```

### 4.3 Usar script de teste (com jq instalado)

```bash
cd backend
chmod +x test-statistics.sh
./test-statistics.sh
```

## Fase 5: Testar Banco de Dados Diretamente

### 5.1 Conectar ao banco

```bash
psql -h localhost -U usuario -d banco_de_alimentos
```

### 5.2 Testar Views

```sql
-- Ver estoque por validade
SELECT * FROM v_estoque_por_validade LIMIT 5;

-- Ver doações por período
SELECT * FROM v_doacoes_por_periodo;

-- Ver alimentos mais doados
SELECT * FROM v_alimentos_mais_doados;

-- Ver distribuição por instituição
SELECT * FROM v_distribuicao_por_instituicao;
```

### 5.3 Testar Stored Procedures

```sql
-- Registrar nova doação (sucesso)
SELECT * FROM registrar_doacao(
  1,                      -- donor_id
  1,                      -- institution_id
  'Arroz Integral',      -- food_type
  100,                   -- quantity
  'kg',                  -- unit
  '2025-12-31'           -- expiration_date
);

-- Registrar doação com erro (doador não existe)
SELECT * FROM registrar_doacao(
  999,
  1,
  'Arroz',
  50,
  'kg',
  '2025-12-31'
);

-- Atualizar status de doação
SELECT * FROM retirar_doacao(1, 'completed');
```

### 5.4 Testar Triggers

```sql
-- Tentar inserir com quantidade 0 (deve falhar)
BEGIN;
INSERT INTO donations (donor_id, institution_id, food_type, quantity, unit, status)
VALUES (1, 1, 'Teste', 0, 'kg', 'pending');
ROLLBACK;

-- Ver auditoria
SELECT * FROM donation_audit LIMIT 10;
```

### 5.5 Executar Consultas de Negócio

```bash
# Executar arquivo completo de consultas
psql -h localhost -U usuario -d banco_de_alimentos < drizzle/consultas-negocio.sql

# Ou executar linha por linha no psql
\i drizzle/consultas-negocio.sql
```

## Fase 6: Iniciar Frontend (Opcional)

### 6.1 Instalar dependências

```bash
cd frontend
pnpm install
```

### 6.2 Iniciar servidor frontend

```bash
cd frontend
pnpm run dev
```

### 6.3 Acessar frontend

```
http://localhost:5173
```

## Fase 7: Troubleshooting

### Problema: Erro de conexão com banco

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Se não estiver, iniciar
sudo systemctl start postgresql

# Ou verificar porta
netstat -an | grep 5432
```

### Problema: Erro de migração

```bash
# Verificar syntax SQL
psql -h localhost -U usuario -d banco_de_alimentos

# Tentar migração passo a passo
\i drizzle/migrations/001_init.sql
\i drizzle/migrations/002_views_procedures_triggers.sql
\i drizzle/migrations/003_test_data.sql
```

### Problema: Port 3000 já em uso

```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 pnpm run start:dev
```

### Problema: Dados de teste não aparecem

```bash
# Verificar se dados foram inseridos
SELECT COUNT(*) FROM donors;
SELECT COUNT(*) FROM institutions;
SELECT COUNT(*) FROM donations;

# Se estiver vazio, reimportar dados
\i drizzle/migrations/003_test_data.sql
```

## Fase 8: Validação Final

### 8.1 Checklist

- [ ] PostgreSQL rodando
- [ ] Banco criado
- [ ] Migrações executadas
- [ ] Backend iniciado
- [ ] Swagger acessível (http://localhost:3000/api)
- [ ] Endpoints respondendo
- [ ] Dados visíveis no banco
- [ ] Views funcionando
- [ ] Procedures testadas
- [ ] Triggers ativas
- [ ] Frontend iniciado (opcional)

### 8.2 Testar fluxo completo

```bash
# 1. Backend rodando?
curl http://localhost:3000/statistics/top-foods-month

# 2. Dados inseridos?
curl http://localhost:3000/donors

# 3. Swagger acessível?
curl http://localhost:3000/api | head -20

# 4. Banco respondendo?
psql -h localhost -U usuario -d banco_de_alimentos -c "SELECT COUNT(*) FROM donations;"
```

## Fase 9: Próximos Passos

### Desenvolvimento

1. Criar novos endpoints conforme necessário
2. Adicionar mais views para análises
3. Implementar mais procedures para negócio
4. Adicionar autenticação

### Produção

1. Usar pool de conexões
2. Adicionar indices adicionais conforme necessário
3. Configurar backups
4. Monitorar performance
5. Adicionar logging

### Frontend

1. Conectar endpoints de estatísticas
2. Criar dashboards visuais
3. Adicionar gráficos
4. Implementar filtros avançados

## Documentação Adicional

- [README.md](../README.md) - Visão geral do projeto
- [RESUMO_EXECUTIVO.md](../RESUMO_EXECUTIVO.md) - Resumo da implementação
- [IMPLEMENTACAO_BANCO_DADOS.md](../IMPLEMENTACAO_BANCO_DADOS.md) - Detalhes técnicos
- [DATABASE_REQUIREMENTS.md](./DATABASE_REQUIREMENTS.md) - Requisitos cumpridos
- [TESTE_BANCO_DADOS.sql](./drizzle/TESTE_BANCO_DADOS.sql) - Exemplos de testes SQL

## Suporte

Se encontrar problemas:

1. Verificar logs do backend: `npm run start:dev`
2. Verificar banco de dados: `psql -h localhost -U usuario -d banco_de_alimentos`
3. Consultar documentação: Ver links acima
4. Verificar arquivos de migração

---

**Status:** ✅ Pronto para usar!
