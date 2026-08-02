# 🩺 MedFlow

Sistema completo para gestão de clínicas médicas desenvolvido com **Spring Boot** e **React**, oferecendo gerenciamento de pacientes, médicos, consultas, prontuários e financeiro através de uma interface moderna, responsiva e intuitiva.

---

## ✨ Principais Funcionalidades

- 🔐 Autenticação com JWT
- 📊 Dashboard com indicadores e gráficos
- 👥 Gestão de pacientes
- 👨‍⚕️ Gestão de médicos
- 📅 Agenda de consultas (lista e calendário)
- 📋 Prontuário eletrônico
- 💰 Controle financeiro
- 🔎 Busca, ordenação e paginação em todas as listagens
- 📱 Interface responsiva

---

# 🛠️ Tecnologias

## Backend

- Java 17
- Spring Boot 3.1.5
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Flyway
- Redis
- RabbitMQ

## Frontend

- React 19
- Vite
- React Router
- Zustand
- Axios
- Recharts

---

# 📂 Estrutura do Projeto

```text
MedFlow
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   └── security
│
├── frontend-web
│   ├── pages
│   ├── components
│   ├── api
│   ├── context
│   ├── store
│   └── utils
│
└── database
    └── migrations
```

---

# 🚀 Executando o Projeto

## 1. Infraestrutura

```bash
docker-compose -f backend/src/main/docker/docker-compose.yml up -d
```

## 2. Backend

```bash
cd backend
mvn spring-boot:run
```

Backend disponível em:

```
http://localhost:8080
```

## 3. Frontend

```bash
cd frontend-web
npm install
npm run dev
```

Frontend disponível em:

```
http://localhost:5173
```

---

# 🔑 Credenciais

| Usuário | Senha |
|---------|--------|
| admin | admin123 |

---

# 📡 API

Todas as rotas utilizam o prefixo:

```
/api
```

Exemplo:

```
GET /api/pacientes
```

Rotas protegidas exigem:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📊 Módulos

- Dashboard
- Pacientes
- Médicos
- Agenda
- Prontuários
- Financeiro

---

# 📸 Funcionalidades

- Dashboard com métricas em tempo real
- Agenda em lista e calendário
- CRUD completo de pacientes e médicos
- Prontuário organizado por histórico
- Controle financeiro com gráficos
- Interface totalmente responsiva

---

# 🏗️ Arquitetura

### Backend

- REST API
- Arquitetura em camadas
- Autenticação JWT
- Persistência com JPA/Hibernate
- Migrações com Flyway

### Frontend

- Componentização em React
- Gerenciamento de estado com Zustand
- Comunicação via Axios
- Componentes reutilizáveis
- Design responsivo

---

# 📄 Licença

Projeto desenvolvido para fins de estudo e demonstração de habilidades em desenvolvimento Full Stack.
