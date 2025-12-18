-- Migração: Criar tabelas para membros da equipe e patrocinadores
-- Data: Janeiro 2025
-- Descrição: Cria estrutura para gerenciar equipe e patrocinadores no banco de dados

-- Tabela de Membros da Equipe
CREATE TABLE IF NOT EXISTS membros_equipe (
  id SERIAL PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  foto_url TEXT,
  ordem_exibicao INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Patrocinadores
CREATE TABLE IF NOT EXISTS patrocinadores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  logo_url TEXT,
  titulo VARCHAR(100),
  link_website TEXT,
  ordem_exibicao INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_membros_equipe_ativo ON membros_equipe(ativo) WHERE ativo = TRUE;
CREATE INDEX IF NOT EXISTS idx_membros_equipe_ordem ON membros_equipe(ordem_exibicao);
CREATE INDEX IF NOT EXISTS idx_patrocinadores_ativo ON patrocinadores(ativo) WHERE ativo = TRUE;
CREATE INDEX IF NOT EXISTS idx_patrocinadores_ordem ON patrocinadores(ordem_exibicao);

-- Comentários para documentação
COMMENT ON TABLE membros_equipe IS 'Membros da equipe e voluntários da fundação';
COMMENT ON TABLE patrocinadores IS 'Patrocinadores e parceiros da fundação';
COMMENT ON COLUMN membros_equipe.ordem_exibicao IS 'Ordem de exibição na página pública';
COMMENT ON COLUMN patrocinadores.ordem_exibicao IS 'Ordem de exibição no carrossel';

