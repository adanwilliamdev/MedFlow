-- ============================================
-- MedFlow - Schema Inicial
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabelas de Usuarios e Seguranca
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL UNIQUE,
    descricao VARCHAR(100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nome_completo VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    celular VARCHAR(20),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    ultimo_login TIMESTAMP,
    reset_password_token VARCHAR(255),
    reset_password_expiry TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario_roles (
    usuario_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (usuario_id, role_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Tabelas de Cadastros
CREATE TABLE pacientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    sexo VARCHAR(10),
    convenio VARCHAR(100),
    numero_convenio VARCHAR(50),
    plano_convenio VARCHAR(100),
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(8),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(100),
    contato_emergencia VARCHAR(100),
    telefone_emergencia VARCHAR(20),
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    crm VARCHAR(20) NOT NULL UNIQUE,
    uf_crm VARCHAR(2) NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    sub_especialidade VARCHAR(100),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(100),
    percentual_comissao DECIMAL(5,2) DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelas de Agenda e Consultas
CREATE TABLE consultas (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    medico_id BIGINT NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'AGENDADA',
    tipo_consulta VARCHAR(50),
    observacoes TEXT,
    valor DECIMAL(10,2),
    forma_pagamento VARCHAR(50),
    pago BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE CASCADE
);

-- Tabelas de Prontuario Eletronico
CREATE TABLE prontuarios (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    medico_id BIGINT,
    consulta_id BIGINT,
    queixa_principal TEXT,
    historico TEXT,
    exame_fisico TEXT,
    diagnostico TEXT,
    prescricao TEXT,
    exames_solicitados TEXT,
    observacoes TEXT,
    data_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE SET NULL,
    FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE SET NULL
);

-- Dados Iniciais
INSERT INTO roles (nome, descricao) VALUES 
('ROLE_ADMIN', 'Administrador do sistema'),
('ROLE_MEDICO', 'Medico'),
('ROLE_RECEPCIONISTA', 'Recepcionista'),
('ROLE_FINANCEIRO', 'Financeiro');

-- Usuario admin padrao (senha: admin123)
INSERT INTO usuarios (username, email, password, nome_completo, ativo) VALUES 
('admin', 'admin@medflow.com', '$2b$10$HA3zbq7qWYBHxXrK4kyfZuFsknkdal7Wa2NpBFmg5jEMFMexlTCnG', 'Administrador do Sistema', true);

INSERT INTO usuario_roles (usuario_id, role_id)
SELECT u.id, r.id FROM usuarios u, roles r
WHERE u.username = 'admin' AND r.nome = 'ROLE_ADMIN';
