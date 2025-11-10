# 🔗 Como o Drizzle ORM USA Tudo Que Foi Implementado

## 📋 Índice

1. [O que é o Schema](#o-que-é-o-schema)
2. [Como Drizzle Mapeia o Banco](#como-drizzle-mapeia-o-banco)
3. [Raw Queries vs ORM](#raw-queries-vs-orm)
4. [Fluxo Completo: Request → ORM → SQL → DB](#fluxo-completo)
5. [Views Acessadas pelo ORM](#views-acessadas-pelo-orm)
6. [Procedures Acessadas pelo ORM](#procedures-acessadas-pelo-orm)
7. [Triggers (Automáticas)](#triggers-automáticas)
8. [Exemplo Prático Passo-a-Passo](#exemplo-prático-passo-a-passo)

---

## 🎯 O que é o Schema

O **schema.ts** é como um "contrato" entre o TypeScript e o PostgreSQL:

### Schema TypeScript (ORM)

```typescript
// backend/src/db/schema.ts
export const donors = pgTable("donors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: varchar("address", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Mapeamento Automático (Drizzle)

```
TypeScript          PostgreSQL
─────────────────────────────
donors          →   donors (tabela)
id              →   id (serial)
name            →   name (varchar)
email           →   email (varchar)
createdAt       →   created_at (timestamp)
```

**O ORM "lê" esse schema e sabe exatamente como falar com o banco!** ✅

---

## 🗺️ Como Drizzle Mapeia o Banco

### 1️⃣ **Estrutura do Banco** (PostgreSQL)

```sql
┌─────────────────────────────────────┐
│ TABELAS (Definidas em schema.ts)   │
├─────────────────────────────────────┤
│ - donors                            │
│ - institutions                      │
│ - donations                         │
│ - donation_audit (não tem schema!)  │
├─────────────────────────────────────┤
│ VIEWS (Em 002_views_procedures.sql) │
├─────────────────────────────────────┤
│ - v_estoque_por_validade            │
│ - v_doacoes_por_periodo             │
│ - v_alimentos_mais_doados           │
│ - v_distribuicao_por_instituicao    │
├─────────────────────────────────────┤
│ PROCEDURES (Em 002_*.sql)           │
├─────────────────────────────────────┤
│ - registrar_doacao()                │
│ - retirar_doacao()                  │
├─────────────────────────────────────┤
│ TRIGGERS (Em 002_*.sql)             │
├─────────────────────────────────────┤
│ - validate_donation (antes INSERT)  │
│ - audit_donation_changes (depois)   │
└─────────────────────────────────────┘
```

### 2️⃣ **Arquivos de Schema**

```
backend/src/db/
├── schema.ts          ← Define tabelas (donors, institutions, donations)
└── database.module.ts ← Configuração do Drizzle
```

### 3️⃣ **Arquivos de Migrations**

```
backend/drizzle/migrations/
├── 001_init.sql                     ← Tabelas + constraints + índices
├── 002_views_procedures_triggers.sql ← Views + Procedures + Triggers
└── 003_test_data.sql                ← Dados de teste
```

---

## 🔄 Raw Queries vs ORM

### Quando Usa ORM "Normal"

```typescript
// backend/src/donors/donors.service.ts
async create(createDonorDto: CreateDonorDto) {
  // Drizzle constrói o SQL baseado em schema.ts
  return await db.insert(donors).values(createDonorDto);
}
```

**O ORM faz automaticamente:**

- Valida tipos (string, number, etc)
- Respeita `notNull()`, `defaultNow()`
- Verifica constraints
- Retorna `donors` tipado em TypeScript

### Quando Usa Raw Queries

```typescript
// backend/src/statistics/statistics.service.ts
async getTopFoodsByMonth() {
  // Isso NÃO usa schema.ts!
  // Isso executa SQL PURO no banco
  const result = await db.execute(sql`
    SELECT food_type, COUNT(*) as total_doacoes
    FROM donations
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
    GROUP BY food_type
    ORDER BY total_doacoes DESC
  `);
  return result;
}
```

**O ORM faz:**

- Apenas executa a query SQL
- Retorna dados brutos (não tipados)
- Útil para Views, Procedures, agregações

---

## 🚀 Fluxo Completo: Request → ORM → SQL → DB

### Exemplo: Criar uma Doação

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND envia POST /donations                          │
├─────────────────────────────────────────────────────────────┤
│ Body: {                                                     │
│   "donorId": 1,                                             │
│   "institutionId": 2,                                       │
│   "foodType": "Arroz",                                      │
│   "quantity": "50",                                         │
│   "unit": "kg",                                             │
│   "expirationDate": "2025-12-31"                            │
│ }                                                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. NESTJS CONTROLLER (donations.controller.ts)            │
├─────────────────────────────────────────────────────────────┤
│ @Post()                                                     │
│ create(@Body() createDonationDto: CreateDonationDto) {     │
│   return this.donationsService.create(createDonationDto);  │
│ }                                                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. NESTJS SERVICE (donations.service.ts)                  │
├─────────────────────────────────────────────────────────────┤
│ async create(createDonationDto: CreateDonationDto) {       │
│   return await db.insert(donations)                         │
│     .values(createDonationDto);                             │
│ }                                                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. DRIZZLE ORM (schema.ts + runtime)                       │
├─────────────────────────────────────────────────────────────┤
│ Lê o schema:                                                │
│ export const donations = pgTable('donations', {            │
│   id: serial('id').primaryKey(),                           │
│   donorId: integer('donor_id').notNull()...                │
│ });                                                         │
│                                                             │
│ Constrói SQL:                                               │
│ INSERT INTO donations (                                     │
│   donor_id, institution_id, food_type, quantity,           │
│   unit, expiration_date, status                            │
│ ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')              │
│                                                             │
│ Bind parameters:                                            │
│ $1=1, $2=2, $3='Arroz', $4='50', $5='kg', $6='2025-12-31' │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. POSTGRESQL EXECUTA (trigger automático)                │
├─────────────────────────────────────────────────────────────┤
│ INSERT INTO donations (...)  ← Vai acionar TRIGGER        │
│                                                             │
│ ⚡ TRIGGER: validate_donation                              │
│    ├─ Valida: quantity > 0? ✅                             │
│    ├─ Valida: expiration_date > NOW()? ✅                  │
│    └─ Se falhar: RAISE EXCEPTION ❌                        │
│                                                             │
│ ✅ INSERT bem-sucedido!                                    │
│                                                             │
│ ⚡ TRIGGER: audit_donation_changes                         │
│    └─ Insere registro em donation_audit (auditoria)        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. DRIZZLE ORM retorna resultado tipado                    │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   id: 1,                                                    │
│   donorId: 1,                                               │
│   institutionId: 2,                                         │
│   foodType: 'Arroz',                                        │
│   quantity: Decimal('50'),                                  │
│   unit: 'kg',                                               │
│   expirationDate: Date('2025-12-31'),                       │
│   status: 'pending',                                        │
│   createdAt: Date.now()                                     │
│ }                                                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. FRONTEND recebe a resposta                              │
├─────────────────────────────────────────────────────────────┤
│ HTTP 201 Created                                            │
│ Content-Type: application/json                              │
│ {                                                           │
│   "id": 1,                                                  │
│   "donorId": 1,                                             │
│   "institutionId": 2,                                       │
│   ...                                                       │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 👀 Views Acessadas pelo ORM

### Como Acessar Views (Raw Query)

```typescript
// Exemplo: statistics.service.ts - getTopFoodsByMonth()
async getTopFoodsByMonth() {
  // ✅ O ORM executa SQL bruto (não usa schema.ts)
  const result = await db.execute(sql`
    SELECT
      food_type,
      COUNT(*) as total_doacoes,
      SUM(CAST(quantity AS FLOAT)) as quantidade_total
    FROM donations  ← Poderia ser: FROM v_alimentos_mais_doados
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
    GROUP BY food_type
    ORDER BY quantidade_total DESC
  `);
  return result;
}
```

### Views Disponíveis para Consultar

```sql
-- 1. Ver alimentos próximos ao vencimento
SELECT * FROM v_estoque_por_validade;

-- 2. Ver doações por período
SELECT * FROM v_doacoes_por_periodo;

-- 3. Ver alimentos mais doados
SELECT * FROM v_alimentos_mais_doados;

-- 4. Ver distribuição por instituição
SELECT * FROM v_distribuicao_por_instituicao;
```

### Como Usar View direto no TypeScript

```typescript
async getInventoryByExpiration() {
  // Consultando a VIEW diretamente
  const result = await db.execute(sql`
    SELECT * FROM v_estoque_por_validade
    WHERE dias_restantes < 7  -- Próximos 7 dias
  `);
  return result;
}
```

---

## 🛠️ Procedures Acessadas pelo ORM

### Procedure: registrar_doacao()

**Definição SQL:**

```sql
CREATE OR REPLACE FUNCTION registrar_doacao(
  p_donor_id INTEGER,
  p_institution_id INTEGER,
  p_food_type VARCHAR,
  p_quantity DECIMAL,
  p_unit VARCHAR,
  p_expiration_date DATE
)
RETURNS TABLE(id INTEGER, status VARCHAR) AS $$
```

**Como chamar via ORM:**

```typescript
async registrarDoacao(donorId: number, institutionId: number,
                      foodType: string, quantity: string,
                      unit: string, expirationDate: string) {
  // Chamada à PROCEDURE via SQL
  const result = await db.execute(sql`
    SELECT * FROM registrar_doacao(
      ${donorId},
      ${institutionId},
      ${foodType},
      ${quantity}::decimal,
      ${unit},
      ${expirationDate}::date
    )
  `);
  return result;
}
```

### Procedure: retirar_doacao()

```typescript
async retirarDoacao(donationId: number, novoStatus: string) {
  const result = await db.execute(sql`
    SELECT * FROM retirar_doacao(
      ${donationId},
      ${novoStatus}
    )
  `);
  return result;
}
```

---

## 🔔 Triggers (Automáticas)

### Como Triggers São Acionados

```
┌──────────────────────────────────────────┐
│ INSERT/UPDATE em donations              │
├──────────────────────────────────────────┤
│ ⚡ Trigger: validate_donation             │
│   - Valida quantidade > 0                │
│   - Valida data > hoje                   │
│   - Se erro: RAISE EXCEPTION ❌          │
├──────────────────────────────────────────┤
│ ✅ Insert/Update confirmado              │
├──────────────────────────────────────────┤
│ ⚡ Trigger: audit_donation_changes        │
│   - Registra em donation_audit           │
│   - Salva OLD e NEW valores              │
│   - Salva timestamp e operação           │
└──────────────────────────────────────────┘
```

### Triggers São "Invisíveis" para o ORM

```typescript
// O ORM não vê triggers, mas eles executam automaticamente!

async create(createDonationDto: CreateDonationDto) {
  try {
    return await db.insert(donations).values(createDonationDto);
    // ⚡ TRIGGER validate_donation executa ANTES
    // ✅ INSERT completa
    // ⚡ TRIGGER audit_donation_changes executa DEPOIS
  } catch (error) {
    // Se validação do trigger falhar, erro aparece aqui
    throw error;
  }
}
```

### Consultar Auditoria (Após Trigger)

```typescript
async getAuditLog() {
  // donation_audit foi preenchida pelos triggers
  const result = await db.execute(sql`
    SELECT * FROM donation_audit
    ORDER BY change_timestamp DESC
    LIMIT 20
  `);
  return result;
}
```

---

## 📊 Exemplo Prático Passo-a-Passo

### Cenário: Listar "Alimentos Mais Doados"

#### 1️⃣ **Requisição HTTP**

```bash
GET http://localhost:3000/statistics/top-foods-month
```

#### 2️⃣ **Controller Recebe**

```typescript
// backend/src/statistics/statistics.controller.ts
@Get('top-foods-month')
@ApiOperation({ summary: 'Alimentos mais doados no mês' })
async getTopFoodsByMonth() {
  return this.statisticsService.getTopFoodsByMonth();
}
```

#### 3️⃣ **Service Executa**

```typescript
// backend/src/statistics/statistics.service.ts
async getTopFoodsByMonth() {
  const result = await db.execute(sql`
    SELECT
      food_type,
      COUNT(*) as total_doacoes,
      SUM(CAST(quantity AS FLOAT)) as quantidade_total,
      unit
    FROM donations
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
    GROUP BY food_type, unit
    ORDER BY quantidade_total DESC
  `);
  return result;
}
```

#### 4️⃣ **O que o Drizzle Faz**

```
┌─────────────────────────────────────────┐
│ db.execute(sql`...`)                   │
├─────────────────────────────────────────┤
│ 1. Reconhece "donations" (schema.ts)   │
│ 2. Vê que é raw query (sql`...`)       │
│ 3. Não valida (não é schema definido)  │
│ 4. Apenas passa para PostgreSQL        │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ PostgreSQL executa:                     │
├─────────────────────────────────────────┤
│ SELECT food_type, COUNT(*) ...          │
│ FROM donations                          │
│ GROUP BY food_type, unit                │
│ ORDER BY quantidade_total DESC          │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Resultado (dados brutos):               │
├─────────────────────────────────────────┤
│ [                                       │
│   {                                     │
│     "food_type": "Arroz",              │
│     "total_doacoes": 5,                 │
│     "quantidade_total": 250,            │
│     "unit": "kg"                        │
│   },                                    │
│   { "food_type": "Feijão", ... },      │
│   ...                                   │
│ ]                                       │
└─────────────────────────────────────────┘
```

#### 5️⃣ **Resposta JSON**

```json
HTTP 200 OK
Content-Type: application/json

[
  {
    "food_type": "Arroz",
    "total_doacoes": 5,
    "quantidade_total": 250,
    "unit": "kg"
  },
  {
    "food_type": "Feijão",
    "total_doacoes": 3,
    "quantidade_total": 150,
    "unit": "kg"
  }
]
```

---

## 🎯 Resumo: O que ORM Usa?

| Componente       | Como é Usado                                       | Arquivo      | Automático? |
| ---------------- | -------------------------------------------------- | ------------ | ----------- |
| **Tabelas**      | `db.insert()`, `db.select()`                       | `schema.ts`  | ✅ SIM      |
| **Foreign Keys** | Validação automática                               | `schema.ts`  | ✅ SIM      |
| **Constraints**  | Validação automática                               | `migrations` | ✅ SIM      |
| **Índices**      | Otimiza queries                                    | `migrations` | ✅ SIM (BD) |
| **Views**        | `db.execute(sql\`SELECT \* FROM view\`)`           | `migrations` | ❌ Manual   |
| **Procedures**   | `db.execute(sql\`SELECT \* FROM procedure(...)\`)` | `migrations` | ❌ Manual   |
| **Triggers**     | Executa automaticamente em INSERT/UPDATE           | `migrations` | ✅ SIM      |
| **Test Data**    | Inserido uma vez (seed)                            | `migrations` | ✅ SIM      |

---

## 🔌 Mapa Mental Completo

```
┌─────────────────────────────────────────────────────────┐
│ APLICAÇÃO NESTJS + DRIZZLE ORM                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Controller (HTTP)                                      │
│      ↓                                                   │
│  Service (Lógica)                                       │
│      ↓                                                   │
│  ┌─────────────────────────────────────┐               │
│  │ DRIZZLE ORM                          │               │
│  ├─────────────────────────────────────┤               │
│  │ • schema.ts (Definição)              │               │
│  │ • Traduz TS → SQL                    │               │
│  │ • Tipagem automática                 │               │
│  └────────────┬────────────────────────┘               │
│               ↓                                          │
│  ┌─────────────────────────────────────┐               │
│  │ DATABASE.MODULE.TS                   │               │
│  ├─────────────────────────────────────┤               │
│  │ • Inicializa conexão PG              │               │
│  │ • Instancia Drizzle                  │               │
│  │ • Disponibiliza `db` global          │               │
│  └────────────┬────────────────────────┘               │
│               ↓                                          │
│  ┌─────────────────────────────────────┐               │
│  │ POSTGRESQL (BANCO)                   │               │
│  ├─────────────────────────────────────┤               │
│  │ ✅ Tabelas (donors, institutions...) │               │
│  │ ✅ Views (v_estoque_por_validade...) │               │
│  │ ✅ Procedures (registrar_doacao...) │               │
│  │ ✅ Triggers (validate, audit)        │               │
│  │ ✅ Índices (otimização)              │               │
│  │ ✅ Constraints (FK, UK, etc)         │               │
│  │ ✅ Test Data (90 dias de doações)    │               │
│  └─────────────────────────────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 Como Navegar o Código

```
Para entender o fluxo completo:

1. Leia schema.ts (o "contrato")
   ↓
2. Leia database.module.ts (inicialização)
   ↓
3. Leia qualquer *.service.ts (como usa)
   ↓
4. Leia migrations/* (o que existe no BD)
   ↓
5. Entenda: ORM tira SQL gerado de schema.ts
           Raw queries (sql``) passam direto para BD
           Views/Procedures/Triggers executam automaticamente
```

---

## ✅ TL;DR (Resposta Rápida)

**"Como o ORM usa tudo isso?"**

1. **Schema.ts** → Define tabelas em TypeScript
2. **Migrations** → Criam tabelas + views + procedures + triggers no BD
3. **Service** → Usa ORM para INSERT/SELECT simples OU raw SQL para queries complexas
4. **Controller** → Expõe tudo como API HTTP
5. **Triggers** → Executam automaticamente quando ORM insere dados
6. **Views** → Acessadas via raw SQL queries

**Simples assim!** 🎉

---

**Criado:** 10 de Novembro de 2025  
**Status:** ✅ Completo
