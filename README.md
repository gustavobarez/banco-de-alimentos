# Banco de Alimentos

Sistema de gerenciamento de doações de alimentos, conectando doadores e instituições beneficentes.

## 🚀 Funcionalidades

- Cadastro e gerenciamento de doadores
- Cadastro e gerenciamento de instituições beneficentes
- Registro e acompanhamento de doações
- Controle de status das doações
- **Estatísticas e relatórios avançados** ✨ NEW
- **Views, Stored Procedures e Triggers** ✨ NEW
- Documentação completa da API com Swagger

## 🛠 Tecnologias Utilizadas

- **Backend:**

  - NestJS
  - TypeScript
  - PostgreSQL
  - Drizzle ORM
  - Swagger/OpenAPI
  - SQL Avançado (Views, Procedures, Triggers)

- **Frontend:**
  - React
  - TypeScript
  - Vite

## 📦 Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL
- pnpm (recomendado) ou npm

## 🔧 Configuração do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/gustavobarez/banco-de-alimentos.git
cd banco-de-alimentos
```

2. Instale as dependências do backend:

```bash
cd backend
pnpm install
```

3. Instale as dependências do frontend:

```bash
cd frontend
pnpm install
```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta backend com as seguintes variáveis:

```env
DATABASE_URL=postgres://user:password@localhost:5432/banco_alimentos
PORT=3000
```

5. Execute as migrações do banco de dados:

```bash
cd backend
pnpm run db:migrate
```

## 🚀 Executando o Projeto

1. Inicie o backend:

```bash
cd backend
pnpm run start:dev
```

2. Inicie o frontend:

```bash
cd frontend
pnpm run dev
```

3. Acesse a documentação da API:

   - http://localhost:3000/api

4. Acesse o frontend:
   - http://localhost:5173

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI. Após iniciar o servidor, acesse:
http://localhost:3000/api

### Principais Endpoints

#### Doadores

- `GET /donors` - Lista todos os doadores
- `POST /donors` - Cadastra um novo doador
- `PUT /donors/:id` - Atualiza um doador

#### Instituições

- `GET /institutions` - Lista todas as instituições
- `POST /institutions` - Cadastra uma nova instituição

#### Doações

- `GET /donations` - Lista todas as doações
- `POST /donations` - Registra uma nova doação

#### 📊 Estatísticas (NEW!)

- `GET /statistics/top-foods-month` - Alimentos mais doados no mês
- `GET /statistics/inventory-by-lot` - Estoque por lote com data de validade
- `GET /statistics/distribution-by-institution` - Distribuição por instituição
- `GET /statistics/top-donors` - Doadores mais ativos
- `GET /statistics/expiring-items` - Alimentos próximos ao vencimento
- `GET /statistics/monthly-summary` - Resumo mensal (últimos 12 meses)
- `GET /statistics/inventory-report` - Relatório de estoque
- `GET /statistics/distribution-efficiency` - Eficiência de distribuição

## 📊 Banco de Dados - 2ª Entrega

Este projeto inclui implementação completa dos requisitos de Banco de Dados:

### ✅ Requisitos Implementados

1. **Modelo Físico & Scripts DDL**

   - Tabelas com constraints, índices e foreign keys
   - Arquivo: `backend/drizzle/migrations/001_init.sql`

2. **Views** (4 implementadas)

   - v_estoque_por_validade
   - v_doacoes_por_periodo
   - v_alimentos_mais_doados
   - v_distribuicao_por_instituicao

3. **Stored Procedures/Functions** (2 implementadas)

   - registrar_doacao()
   - retirar_doacao()

4. **Triggers** (2 implementados)

   - validate_donation()
   - audit_donation_changes()

5. **Scripts DML de Teste**

   - 5 doadores, 4 instituições, 20+ doações

6. **Consultas SQL de Negócio** (10 implementadas)
   - Alimentos mais doados, saldo por lote, distribuição por instituição
   - Doadores mais ativos, itens próximos ao vencimento
   - E mais 5 consultas de análise...

### 📁 Arquivos de Banco de Dados

```
backend/
├── drizzle/
│   ├── migrations/
│   │   ├── 001_init.sql                              (Tabelas)
│   │   ├── 002_views_procedures_triggers.sql         (DDL Avançado)
│   │   └── 003_test_data.sql                         (Dados Teste)
│   ├── consultas-negocio.sql                         (10 Queries)
│   └── TESTE_BANCO_DADOS.sql                         (Guia de Testes)
├── src/statistics/
│   ├── statistics.controller.ts                      (8 Endpoints)
│   ├── statistics.service.ts                         (Lógica SQL)
│   └── statistics.module.ts                          (Módulo NestJS)
└── DATABASE_REQUIREMENTS.md                          (Documentação)
```

### 🎯 Como Usar

```bash
# Executar migrações
cd backend
pnpm run db:migrate

# Iniciar backend
pnpm run start:dev

# Acessar endpoints
curl http://localhost:3000/statistics/top-foods-month

# Ver documentação Swagger
http://localhost:3000/api
```

### 📖 Documentação Detalhada

- [Resumo Executivo](./RESUMO_EXECUTIVO.md)
- [Implementação de Banco de Dados](./IMPLEMENTACAO_BANCO_DADOS.md)
- [Requisitos de Banco de Dados](./backend/DATABASE_REQUIREMENTS.md)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Gustavo Barez - Desenvolvimento inicial
