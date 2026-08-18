# 🩺 MedFlow

**MedFlow** é um sistema full-stack de gestão clínica desenvolvido com **Java + Spring Boot** no backend e **React** no frontend.

O projeto foi construído com foco em **arquitetura de software, segurança de APIs, integração entre serviços, persistência de dados, cache, mensageria, performance e boas práticas de engenharia de software**.

> Projeto desenvolvido para fins de demonstração técnica e portfólio.

---

## 🎯 Objetivo do Projeto

O MedFlow foi desenvolvido para consolidar e demonstrar conhecimentos práticos em desenvolvimento de aplicações web modernas, incluindo:

* Arquitetura em camadas e separação de responsabilidades
* Spring Boot e desenvolvimento de APIs REST
* Autenticação e autorização com JWT e Spring Security
* Persistência de dados com Spring Data JPA e PostgreSQL
* Migrações versionadas com Flyway
* Cache distribuído com Redis
* Mensageria assíncrona com RabbitMQ
* Desenvolvimento de interfaces com React
* Gerenciamento de estado global com Zustand
* Docker e Docker Compose
* Boas práticas de segurança, performance e organização de código

---

# 🧩 Stack Tecnológica

## Backend

| Tecnologia          | Versão | Finalidade                    |
| ------------------- | -----: | ----------------------------- |
| **Java**            |     17 | Linguagem principal           |
| **Spring Boot**     |  3.1.5 | Framework principal           |
| **Spring Security** |    6.x | Autenticação e autorização    |
| **JWT**             | 0.11.5 | Autenticação stateless        |
| **Spring Data JPA** |    3.x | Persistência e ORM            |
| **PostgreSQL**      |     15 | Banco de dados relacional     |
| **Flyway**          |    9.x | Migrações do banco            |
| **Redis**           |    7.x | Cache distribuído             |
| **RabbitMQ**        |    3.x | Mensageria assíncrona         |
| **Maven**           |   3.9+ | Gerenciamento de dependências |

## Frontend

| Tecnologia       | Versão | Finalidade               |
| ---------------- | -----: | ------------------------ |
| **React**        |     19 | Interface de usuário     |
| **Vite**         |    5.x | Build e desenvolvimento  |
| **React Router** |    6.x | Roteamento SPA           |
| **Zustand**      |    4.x | Gerenciamento de estado  |
| **Axios**        |    1.x | Cliente HTTP             |
| **Recharts**     |    2.x | Gráficos e visualizações |
| **Tailwind CSS** |    3.x | Estilização              |

## Infraestrutura

| Tecnologia         | Finalidade         |
| ------------------ | ------------------ |
| **Docker**         | Containerização    |
| **Docker Compose** | Orquestração local |
| **PostgreSQL**     | Persistência       |
| **Redis**          | Cache              |
| **RabbitMQ**       | Mensageria         |

---

# 🏗️ Arquitetura

O backend utiliza uma arquitetura em camadas, mantendo responsabilidades bem definidas entre os componentes da aplicação.

```text
                    ┌───────────────┐
                    │    Client     │
                    │ React / Axios │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Controller   │
                    │ REST / DTOs   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Service    │
                    │ Business Rules│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Repository   │
                    │ Spring Data   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  PostgreSQL   │
                    └───────────────┘

       ┌─────────────┐       ┌─────────────┐
       │    Redis    │       │  RabbitMQ   │
       │    Cache    │       │   Events    │
       └─────────────┘       └─────────────┘
```

### Camadas

**Controller**

* Recebe requisições HTTP
* Valida dados de entrada
* Trabalha com DTOs
* Retorna respostas HTTP padronizadas

**Service**

* Implementa regras de negócio
* Gerencia transações
* Orquestra operações entre componentes
* Coordena integrações externas

**Repository**

* Responsável pela persistência
* Utiliza Spring Data JPA
* Possui queries customizadas quando necessário

**Security**

* Autenticação JWT
* Autorização baseada em roles
* Configuração stateless
* Proteção dos endpoints

---

# 🧠 Padrões e Práticas Aplicados

### DTO Pattern

Utilização de DTOs para separar o modelo de apresentação das entidades de domínio.

```text
Request
   ↓
DTO
   ↓
Service
   ↓
Entity
   ↓
Repository
```

### Repository Pattern

Abstração da camada de persistência utilizando Spring Data JPA.

### Strategy Pattern

Estrutura preparada para diferentes estratégias relacionadas ao processo de agendamento.

### Observer / Event-Driven

Utilização do RabbitMQ para comunicação assíncrona baseada em eventos.

Exemplo:

```text
Consulta agendada
       │
       ▼
Evento publicado
       │
       ▼
RabbitMQ
       │
       ▼
Consumidor
       │
       ▼
Notificação
```

---

# 🔐 Segurança

A aplicação possui uma estrutura de segurança baseada em **Spring Security + JWT**.

### Autenticação

* JWT Access Token
* Refresh Token
* Autenticação stateless
* Expiração de tokens
* BCrypt para armazenamento seguro de senhas

### Autorização

Controle de acesso utilizando roles e permissões.

```java
@PreAuthorize("hasRole('ADMIN')")
```

### Validação

Todos os DTOs de entrada podem utilizar Bean Validation:

```java
@Valid
```

Exemplo:

```java
@NotBlank
private String name;
```

### CORS

Configuração de origens permitidas para comunicação segura entre frontend e backend.

### Rate Limiting

> Caso implementado, utilizar Bucket4j ou solução equivalente para limitar requisições por usuário/IP.

---

# 🗄️ Modelagem de Dados

O sistema utiliza **PostgreSQL** como banco de dados principal.

### Relacionamentos

A modelagem utiliza relacionamentos JPA como:

* `@OneToOne`
* `@OneToMany`
* `@ManyToOne`

Com preferência por:

```java
FetchType.LAZY
```

para evitar carregamento desnecessário de dados.

### Índices

Índices são utilizados em campos frequentemente consultados, como:

* CPF
* CRM
* Datas
* Identificadores
* Campos utilizados em filtros

### Auditoria

As entidades podem possuir campos para controle temporal:

```text
createdAt
updatedAt
```

Com atualização automática utilizando:

```java
@PrePersist
@PreUpdate
```

### Soft Delete

Exclusão lógica utilizando um campo de controle:

```text
active = true / false
```

Isso permite preservar registros sem removê-los fisicamente do banco.

---

# ⚡ Performance

O projeto possui estratégias para reduzir consultas desnecessárias e melhorar a eficiência da aplicação.

### Redis

Utilizado para armazenar informações consultadas frequentemente, como:

* Especialidades
* Convênios
* Dados de referência
* Informações temporárias

### Paginação

Listagens utilizam o mecanismo de paginação do Spring Data:

```java
Pageable
```

Exemplo:

```text
GET /api/patients?page=0&size=20
```

### Lazy Loading

Relacionamentos JPA utilizam carregamento sob demanda quando apropriado.

### DTOs

Respostas específicas evitam o envio de informações desnecessárias para o frontend.

### Connection Pool

O acesso ao PostgreSQL utiliza **HikariCP** para gerenciamento do pool de conexões.

---

# 🐇 Mensageria

O RabbitMQ é utilizado para processamento assíncrono e comunicação baseada em eventos.

Exemplo de fluxo:

```text
Agendamento
     │
     ▼
Publicação do evento
     │
     ▼
RabbitMQ
     │
     ├──────────────► Notificação
     │
     ├──────────────► Processamento assíncrono
     │
     └──────────────► Outros consumidores
```

Essa abordagem reduz o acoplamento entre componentes e permite que tarefas não críticas sejam processadas de forma assíncrona.

---

# 🐳 Docker

O ambiente de desenvolvimento pode ser executado utilizando **Docker Compose**.

Serviços previstos:

```yaml
services:
  postgres:
    # PostgreSQL - porta 5432

  redis:
    # Redis - porta 6379

  rabbitmq:
    # AMQP - porta 5672
    # Management UI - porta 15672

  backend:
    # Spring Boot - porta 8080

  frontend:
    # Vite - porta 5173
```

---

# ⚙️ Variáveis de Ambiente

As configurações sensíveis devem ser fornecidas através de variáveis de ambiente.

| Variável        | Descrição                                  |
| --------------- | ------------------------------------------ |
| `DB_HOST`       | Endereço do PostgreSQL                     |
| `DB_USER`       | Usuário do banco                           |
| `DB_PASS`       | Senha do banco                             |
| `REDIS_HOST`    | Endereço do Redis                          |
| `RABBITMQ_HOST` | Endereço do RabbitMQ                       |
| `JWT_SECRET`    | Chave utilizada para assinatura dos tokens |

> Nunca versionar senhas, tokens ou chaves secretas no repositório.

---

# 🚀 Como Executar

## 1. Clonar o projeto

```bash
git clone https://github.com/adanwilliamdev/MedFlow
cd medflow
```

## 2. Subir a infraestrutura

```bash
docker-compose up -d postgres redis rabbitmq
```

## 3. Executar as migrações

```bash
mvn flyway:migrate
```

## 4. Iniciar o backend

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

O backend estará disponível em:

```text
http://localhost:8080
```

## 5. Instalar dependências do frontend

```bash
npm install
```

## 6. Iniciar o frontend

```bash
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:5173
```

---

# 🌐 Endpoints e Interfaces

| Serviço                 | Endereço                                |
| ----------------------- | --------------------------------------- |
| **API**                 | `http://localhost:8080/api`             |
| **Frontend**            | `http://localhost:5173`                 |
| **Swagger**             | `http://localhost:8080/swagger-ui.html` |
| **RabbitMQ Management** | `http://localhost:15672`                |

> O Swagger/OpenAPI estará disponível caso esteja configurado no projeto.

---

# 🧪 Testes

Backend:

```bash
mvn test
```

Frontend:

```bash
npm run test
```

O projeto pode utilizar:

* JUnit
* Mockito
* Spring Boot Test
* Testes de integração
* Testes de componentes React

> Mantenha nesta seção apenas as ferramentas realmente implementadas no projeto. README inventando teste que não existe é uma pequena obra de ficção científica.

---

# 📊 O Que o Projeto Demonstra

O MedFlow demonstra conhecimentos práticos em:

### Backend

* Java 17
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Hibernate
* APIs REST
* Bean Validation
* Tratamento global de exceções
* Transações
* DTOs
* Arquitetura em camadas

### Banco de Dados

* PostgreSQL
* Modelagem relacional
* JPA/Hibernate
* Índices
* Paginação
* Migrações com Flyway
* Soft Delete
* Auditoria

### Integrações

* Redis
* RabbitMQ
* Comunicação assíncrona
* Cache distribuído
* Eventos de domínio

### Frontend

* React
* Vite
* React Router
* Zustand
* Axios
* Recharts
* Tailwind CSS
* Componentização
* Interfaces responsivas

### DevOps

* Docker
* Docker Compose
* Variáveis de ambiente
* Profiles do Spring
* Migrações automatizadas

---

# 📁 Estrutura Sugerida

```text
medflow/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/medflow/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── entity/
│   │   │   │       ├── dto/
│   │   │   │       ├── security/
│   │   │   │       ├── exception/
│   │   │   │       └── config/
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── db/
│   │   │       │   └── migration/
│   │   │       └── application.yml
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 📌 Status do Projeto

🚧 **Em desenvolvimento**

O projeto está sendo desenvolvido com foco em evolução contínua da arquitetura, segurança, testes, experiência do usuário e práticas modernas de engenharia de software.

---

# 📄 Licença

Projeto desenvolvido para **fins de demonstração técnica e portfólio**.

Todos os direitos reservados ao autor.

---

## 👨‍💻 Autor

**Adan William Oliveira Santos**

Desenvolvedor com experiência em infraestrutura, redes e operações de TI, atualmente direcionando sua carreira para **Desenvolvimento de Software / Backend**, com foco em **Java, Spring Boot, APIs REST, bancos de dados e arquitetura de sistemas**.
