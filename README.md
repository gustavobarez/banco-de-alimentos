# Banco de Alimentos

Sistema de gerenciamento de doações de alimentos, conectando doadores e instituições beneficentes.

## 🚀 Funcionalidades

- Cadastro e gerenciamento de doadores
- Cadastro e gerenciamento de instituições beneficentes
- Registro e acompanhamento de doações
- Controle de status das doações
- Documentação completa da API com Swagger

## 🛠 Tecnologias Utilizadas

- **Backend:**

  - NestJS
  - TypeScript
  - PostgreSQL
  - Drizzle ORM
  - Swagger/OpenAPI

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

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI. Após iniciar o servidor, acesse:
http://localhost:3000/api

### Principais Endpoints

#### Doadores

- `GET /donors` - Lista todos os doadores
- `POST /donors` - Cadastra um novo doador

#### Instituições

- `GET /institutions` - Lista todas as instituições
- `POST /institutions` - Cadastra uma nova instituição

#### Doações

- `GET /donations` - Lista todas as doações
- `GET /donations/donor/:id` - Lista doações por doador
- `GET /donations/institution/:id` - Lista doações por instituição
- `POST /donations` - Registra uma nova doação
- `PATCH /donations/:id` - Atualiza o status de uma doação
- `DELETE /donations/:id` - Remove uma doação

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
