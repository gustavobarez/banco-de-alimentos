# Implementação do Banco de Dados - Banco de Alimentos

## Requisitos Implementados

Esta implementação contém todos os requisitos solicitados para a disciplina de Banco de Dados:

### 1. Modelo Físico & Scripts DDL ✅

**Arquivo:** `/backend/drizzle/migrations/001_init.sql`

Contém:

- CREATE TABLE para donors, institutions e donations
- Primary Keys
- Foreign Keys com referências
- Constraints UNIQUE
- Índices para otimização

### 2. Objetos de Banco Essenciais ao MVP ✅

#### Views (`/backend/drizzle/migrations/002_views_procedures_triggers.sql`)

**a) v_estoque_por_validade**

- Mostra alimentos por data de validade
- Indica status de validade (Válido/Vencido/Indefinida)
- Calcula dias restantes até vencimento

**b) v_doacoes_por_periodo**

- Agrupa doações por período mensal
- Calcula total de doações e quantidade
- Conta doadores e instituições únicas

**c) v_alimentos_mais_doados**

- Alimentos mais doados (últimos 30 dias)
- Quantidade total e média por tipo

**d) v_distribuicao_por_instituicao**

- Distribuição de alimentos por instituição
- Total de doações e quantidade recebida

#### Stored Procedures/Functions

**a) registrar_doacao()**

- Registra novas doações com validações
- Valida existência de doador e instituição
- Mantém consistência transacional
- Retorna sucesso/erro com mensagem

**b) retirar_doacao()**

- Atualiza status de doações
- Valida transições de estado
- Mantém auditoria de mudanças

#### Triggers

**a) validate_donation()**

- Valida quantidade > 0
- Valida data de validade (não pode ser no passado)
- Valida tamanho mínimo do tipo de alimento

**b) audit_donation_changes()**

- Registra todas as mudanças de doações
- Cria histórico completo de status
- Tabela donation_audit para auditoria

### 3. Scripts DML de Teste ✅

**Arquivo:** `/backend/drizzle/migrations/003_test_data.sql`

Dados inseridos:

- 5 doadores com informações completas
- 4 instituições com CNPJ válido
- 20+ doações com datas variadas (últimos 90 dias)
- Índices para performance
- Dados coerentes e realistas

### 4. Consultas SQL de Negócio ✅

**Arquivo:** `/backend/drizzle/consultas-negocio.sql`

10 consultas de negócio implementadas:

1. **Alimentos mais doados no mês**
   - Ranking de alimentos doados
   - Quantidade total e média

2. **Saldo por lote**
   - Estoque com data de validade
   - Status de validade

3. **Distribuição por instituição**
   - Doações recebidas por instituição
   - Período trimestral

4. **Doadores mais ativos (Top 10)**
   - Ranking de doadores
   - Instituições atendidas

5. **Alimentos próximos ao vencimento**
   - Itens vencendo em 7 dias
   - Instituição destino

6. **Resumo mensal (últimos 12 meses)**
   - Doações por mês
   - Doadores e instituições únicas

7. **Relatório de estoque atual**
   - Quantidade válida e vencida
   - Quantidade por alimento

8. **Eficiência de distribuição**
   - Taxa de conclusão por instituição
   - Doações pendentes vs concluídas

9. **Histórico de movimentação**
   - Por doador
   - Com lista de alimentos doados

10. **Oportunidades de melhoria**
    - Alimentos com baixa demanda
    - Últimos 30 dias

## Implementação Backend (NestJS)

### Novos Endpoints de Estatísticas

**Módulo:** `StatisticsModule`

#### Endpoints disponíveis:

- `GET /statistics/top-foods-month` - Alimentos mais doados
- `GET /statistics/inventory-by-lot` - Estoque por lote
- `GET /statistics/distribution-by-institution` - Distribuição por instituição
- `GET /statistics/top-donors` - Doadores mais ativos
- `GET /statistics/expiring-items` - Alimentos próximos ao vencimento
- `GET /statistics/monthly-summary` - Resumo mensal
- `GET /statistics/inventory-report` - Relatório de estoque
- `GET /statistics/distribution-efficiency` - Eficiência de distribuição

### Como usar

#### 1. Executar as migrações

```bash
# Executar todas as migrações
npm run db:migrate

# Ou manualmente com psql
psql -h localhost -U usuario -d banco_de_alimentos -f drizzle/migrations/002_views_procedures_triggers.sql
psql -h localhost -U usuario -d banco_de_alimentos -f drizzle/migrations/003_test_data.sql
```

#### 2. Iniciar a API

```bash
npm run start:dev
```

#### 3. Acessar os endpoints

```bash
# Exemplo: Alimentos mais doados
curl http://localhost:3000/statistics/top-foods-month

# Exemplo: Doadores mais ativos
curl http://localhost:3000/statistics/top-donors

# Exemplo: Alimentos próximos ao vencimento
curl http://localhost:3000/statistics/expiring-items
```

#### 4. Documentação Swagger

Acesse `http://localhost:3000/api` para ver a documentação interativa de todos os endpoints.

## Estrutura de Arquivos

```
backend/
├── drizzle/
│   ├── migrations/
│   │   ├── 001_init.sql (Modelo físico)
│   │   ├── 002_views_procedures_triggers.sql (Views, procedures, triggers)
│   │   └── 003_test_data.sql (Dados de teste)
│   └── consultas-negocio.sql (Consultas SQL de negócio)
├── src/
│   ├── statistics/
│   │   ├── statistics.controller.ts (Endpoints)
│   │   ├── statistics.service.ts (Lógica)
│   │   └── statistics.module.ts (Módulo)
│   └── app.module.ts (Incluindo StatisticsModule)
```

## Testes

### Verificar Views

```sql
SELECT * FROM v_estoque_por_validade;
SELECT * FROM v_doacoes_por_periodo;
SELECT * FROM v_alimentos_mais_doados;
SELECT * FROM v_distribuicao_por_instituicao;
```

### Testar Functions

```sql
-- Registrar nova doação
SELECT * FROM registrar_doacao(1, 1, 'Arroz', 50, 'kg', '2025-12-31');

-- Atualizar status
SELECT * FROM retirar_doacao(1, 'completed');
```

### Executar Consultas de Negócio

```bash
# Executar via psql
psql -h localhost -U usuario -d banco_de_alimentos -f drizzle/consultas-negocio.sql
```

## Validações Implementadas

- ✅ Quantidade de doação deve ser > 0
- ✅ Data de validade não pode ser no passado
- ✅ Tipo de alimento mínimo 2 caracteres
- ✅ Doador e instituição devem existir
- ✅ Auditoria de todas as mudanças
- ✅ Índices para otimização de queries

## Conformidade

- ✅ DDL: Criação de tabelas com constraints
- ✅ Views: 4 views para análise de dados
- ✅ Stored Procedures: 2 procedures com validações
- ✅ Triggers: 2 triggers para validação e auditoria
- ✅ DML: Scripts de teste com dados coerentes
- ✅ SQL de Negócio: 10 consultas práticas

Todos os requisitos da 2ª ENTREGA foram implementados com sucesso!
