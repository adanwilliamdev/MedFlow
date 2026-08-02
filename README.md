# MedFlow — Sistema de Gestão para Clínicas

Sistema completo para gestão de clínicas médicas, com backend REST em Spring Boot
e frontend web em React, com uma interface moderna, fluida e responsiva.

## Tecnologias

### Backend
- Spring Boot 3.1.5
- Spring Security com JWT
- PostgreSQL + Flyway (migrations)
- Redis
- RabbitMQ

### Frontend
- React 19 + Vite
- React Router
- Zustand (estado global de UI: sidebar, notificações)
- Recharts (gráficos do painel e financeiro)
- Axios

## Funcionalidades

- Autenticação JWT
- Painel com indicadores (pacientes, médicos, consultas, faturamento) e gráfico de consultas
- Cadastro de pacientes (CRUD) com busca, ordenação e paginação
- Cadastro de médicos (CRUD) com busca, ordenação e paginação
- Agenda de consultas em visão de **lista** ou **calendário mensal**, com status coloridos
- Prontuário eletrônico por paciente, organizado em abas (Anamnese, Exames, Prescrições) com busca e anexos
- Financeiro com gráficos de faturamento, filtros de pagamento e extrato detalhado

## Como executar

### Opção 1: script automático (Windows)
1. Execute `.\run.ps1`
2. Aguarde os serviços (Docker, backend, frontend) iniciarem
3. O navegador abrirá automaticamente em http://localhost:5173

### Opção 2: manual
```powershell
# 1. Suba os serviços de infraestrutura
docker-compose -f backend\src\main\docker\docker-compose.yml up -d

# 2. Backend (porta 8080)
cd backend
mvn spring-boot:run

# 3. Frontend (porta 5173), em outro terminal
cd frontend-web
npm install
npm run dev
```

## Credenciais padrão

- Usuário: `admin`
- Senha: `admin123`

## Serviços de infraestrutura

- PostgreSQL: localhost:5433 (porta 5433 no host para evitar conflito com instalações nativas do Postgres na porta padrão 5432; dentro do container continua em 5432)
- Redis: localhost:6379
- RabbitMQ: localhost:5672 (painel de gestão em localhost:15672)

## Estrutura do projeto

```
MedFlow/
├── backend/              Spring Boot REST API (porta 8080, prefixo /api)
│   └── src/main/java/com/medflow/
│       ├── controller/   Endpoints REST
│       ├── service/      Regras de negócio
│       ├── repository/   Acesso a dados (JPA)
│       ├── entity/       Entidades JPA
│       ├── dto/          Objetos de entrada/saída da API
│       └── security/     Autenticação JWT
├── frontend-web/         Aplicação web em React (porta 5173)
│   └── src/
│       ├── pages/        Telas (Login, Dashboard, Pacientes, Medicos, Agenda, Prontuarios, Financeiro)
│       ├── components/   Layout, Modal, DataTable, SearchBox, StatCard, Toast, ConfirmDialog, Skeleton, Icon...
│       ├── store/        Estado global (Zustand): sidebar e notificações
│       ├── api/          Cliente HTTP e chamadas à API
│       ├── context/      Estado de autenticação
│       └── utils/        Formatação de datas, moeda e status
└── database/migrations/  Scripts SQL (também copiados para backend/src/main/resources/db/migration)
```

## API principal

Todas as rotas usam o prefixo `/api` (ex: `http://localhost:8080/api/pacientes`).

| Método | Rota | Descrição |
|---|---|---|
| POST | /auth/login | Autenticação (retorna token JWT) |
| GET/POST | /pacientes | Listar / criar pacientes |
| PUT/DELETE | /pacientes/{id} | Atualizar / inativar paciente |
| GET/POST | /medicos | Listar / criar médicos |
| PUT/DELETE | /medicos/{id} | Atualizar / inativar médico |
| GET/POST | /consultas | Listar / criar consultas |
| PUT/DELETE | /consultas/{id} | Atualizar / cancelar consulta |
| GET/POST | /prontuarios | Listar (por paciente) / criar registro |
| GET | /dashboard/resumo | Indicadores do dashboard |

Todas as rotas (exceto `/auth/**`) exigem o header `Authorization: Bearer <token>`.

---

## 🎨 Design system do frontend

O frontend foi redesenhado com um design system próprio, documentado em
`frontend-web/src/index.css` através de variáveis CSS (design tokens).

### Cores
- **Primária**: teal clínico (`--color-primary: #0F6E64`), usada em ações principais, links ativos e destaques.
- **Neutros**: tons de cinza-azulado para texto e bordas (`--color-text`, `--color-text-soft`, `--color-border`).
- **Status**: verde (sucesso/pago/realizada), âmbar (pendente/em andamento), vermelho (cancelada/excluir), azul (agendada/informação).

### Tipografia
- **Inter** para toda a interface (corpo, formulários, tabelas, botões).
- **Source Serif 4** para títulos e números de destaque (painel, valores), trazendo um tom editorial e confiável, adequado a um sistema de saúde.
- Escala hierárquica: títulos de página 20–28px, corpo 14px, rótulos/eyebrows 11–12px.

### Espaçamento
- Escala consistente em múltiplos de 4px (`--sp-1` a `--sp-12`: 4, 8, 12, 16, 20, 24, 32, 40, 48px), aplicada em paddings, margens e gaps de grids em toda a aplicação.

### Componentes reutilizáveis (`src/components/`)
| Componente | Uso |
|---|---|
| `Icon.jsx` | Biblioteca própria de ícones SVG (substitui rótulos de texto puro na sidebar e ações) |
| `Layout.jsx` | Sidebar + topbar: navegação com ícones, seções, item ativo destacado, tooltips quando colapsada, usuário/cargo e botão "Sair" no rodapé |
| `DataTable.jsx` | Tabela genérica com ordenação por coluna, paginação e transformação em cards em telas pequenas |
| `SearchBox.jsx` | Busca com ícone e botão de limpar, sempre visível |
| `StatCard.jsx` | Cartões de métrica do painel |
| `Modal.jsx` / `ConfirmDialog.jsx` | Modal genérico e diálogo de confirmação para ações destrutivas (substitui `confirm()`/`alert()` nativos) |
| `ToastStack.jsx` | Notificações (toasts) de sucesso/erro ao salvar, editar ou excluir |
| `Skeleton.jsx` | Estados de carregamento (esqueleto) para tabelas, cards e estatísticas |

### Estado compartilhado
- `src/store/uiStore.js` usa **Zustand** para estado de UI compartilhado entre componentes: colapso da sidebar (persistido em `localStorage`), menu mobile e fila de notificações (toasts).

### Responsividade e acessibilidade
- Layout com CSS Grid/Flexbox, sidebar colapsável e menu mobile com overlay.
- Tabelas viram cards empilhados abaixo de 720px de largura.
- Labels associados a todos os campos de formulário (`htmlFor`/`id`) e `aria-label` em botões apenas com ícone.
- Contraste de texto verificado sobre fundos claros (WCAG AA para texto padrão).

### Destaques por tela
- **Painel**: cartões de métricas, gráfico de barras de consultas (Recharts) e filtros rápidos (Hoje/Semana/Mês).
- **Pacientes/Médicos**: busca sempre visível, colunas ordenáveis, ações em ícones (editar/inativar) e paginação.
- **Agenda**: alternância entre lista e calendário mensal estilo Google, com badges de status coloridos e atalho para nova consulta a partir de um dia do calendário.
- **Prontuário**: abas Anamnese/Exames/Prescrições, busca por data ou sintoma, anexos de exames (simulados no navegador, sem persistência em backend) e novo registro via modal.
- **Financeiro**: gráfico de barras (faturamento por período) e gráfico de pizza (pago/pendente/cancelado), filtros rápidos e extrato paginado.

> **Nota:** os anexos de exames no Prontuário são simulados apenas no frontend (guardados em memória durante a sessão), já que a API atual não possui endpoint de upload de arquivos. Para persistir arquivos de fato, será necessário adicionar um endpoint de upload no backend (ex.: `POST /api/prontuarios/{id}/anexos`) e armazenamento em disco/object storage.
