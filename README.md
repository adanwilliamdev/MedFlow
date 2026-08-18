# 🩺 MedFlow

> Sistema de gestão clínica full-stack desenvolvido com **Java + Spring Boot + React**.

O **MedFlow** é um projeto desenvolvido para demonstrar práticas modernas de desenvolvimento de software, incluindo APIs REST, autenticação, persistência de dados, arquitetura em camadas e desenvolvimento de interfaces web.

---

## ✨ Funcionalidades

- 🔐 Autenticação e autorização com **JWT + Spring Security**
- 👨‍⚕️ Gestão de médicos
- 🧑‍🤝‍🧑 Gestão de pacientes
- 📅 Agendamento e gerenciamento de consultas
- 📋 Prontuários médicos
- 📊 Dashboard
- 🔒 Controle de acesso por roles
- ✅ Validação de dados
- 🗄️ Persistência com PostgreSQL
- 🔄 Migrações com Flyway
- 🐳 Ambiente de desenvolvimento com Docker
- ⚡ Paginação e otimizações de acesso ao banco
- 📱 Interface responsiva

---

## 🛠️ Stack

### Backend

| Tecnologia | Versão |
|---|---:|
| Java | 17 |
| Spring Boot | 3.1.5 |
| Spring Security | 6.x |
| Spring Data JPA | 3.x |
| JWT | 0.11.5 |
| PostgreSQL | 15 |
| Flyway | 9.x |
| Maven | 3.9+ |

### Frontend

| Tecnologia | Versão |
|---|---:|
| React | 19 |
| Vite | 5.x |
| React Router | 6.x |
| Zustand | 4.x |
| Axios | 1.x |
| Tailwind CSS | 3.x |

### Infraestrutura

- Docker
- Docker Compose
- PostgreSQL

---

## 🏗️ Arquitetura

O backend segue uma arquitetura em camadas, separando responsabilidades entre apresentação, regras de negócio e persistência.

```text
React / Axios
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
PostgreSQL
```

Principais conceitos utilizados:

- **REST API**
- **DTOs**
- **Service Layer**
- **Repository Pattern**
- **Spring Data JPA**
- **JWT Authentication**
- **Bean Validation**
- **Tratamento global de exceções**

---

## 📁 Estrutura

```text
MedFlow/
├── backend/
│   └── src/
│       └── main/
│           ├── java/com/medflow/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   ├── entity/
│           │   ├── exception/
│           │   ├── repository/
│           │   ├── security/
│           │   └── service/
│           └── resources/
│               ├── db/migration/
│               └── application.yml
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── store/
│       └── utils/
│
├── .gitignore
└── README.md
```

---

## 🚀 Como executar

### Pré-requisitos

- Java 17+
- Node.js 20+
- Maven 3.9+
- Docker Desktop

### 1. Clone o repositório

```bash
git clone https://github.com/adanwilliamdev/MedFlow.git
cd MedFlow
```

### 2. Inicie o PostgreSQL

```bash
cd backend/src/main/docker
docker compose up -d
cd ../../../
```

### 3. Execute o backend

```bash
cd backend
./mvnw spring-boot:run
```

No Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

### 4. Execute o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔐 Configuração

Configure as variáveis de ambiente necessárias para o banco de dados e autenticação:

```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
JWT_SECRET=sua_chave_secreta
```

> ⚠️ Nunca versione senhas, tokens ou chaves secretas no Git.

---

## 📊 Principais conhecimentos demonstrados

**Backend**

`Java` · `Spring Boot` · `Spring Security` · `JWT` · `JPA/Hibernate` · `REST API` · `Bean Validation`

**Banco de dados**

`PostgreSQL` · `Modelagem Relacional` · `Flyway` · `Paginação`

**Frontend**

`React` · `Vite` · `React Router` · `Zustand` · `Axios` · `Tailwind CSS`

**DevOps**

`Docker` · `Docker Compose` · `Environment Variables`

---

## 📌 Status

🚧 **Em desenvolvimento**

O projeto continua em evolução, com foco em melhorias de arquitetura, segurança, testes e experiência do usuário.

---

## 👨‍💻 Autor

**Adan William Santos**

Desenvolvedor com experiência em infraestrutura, redes e operações de TI, direcionando a carreira para **Desenvolvimento de Software / Backend**, com foco em:

`Java` · `Spring Boot` · `APIs REST` · `PostgreSQL` · `Arquitetura de Sistemas`

---

> 💡 Projeto desenvolvido para fins de estudo, demonstração técnica e portfólio.
