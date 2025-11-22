-- Migração: Adicionar campo status na tabela idosos
-- Data: Dezembro 2024
-- Descrição: Adiciona campo status para classificar idosos como 'fixo' ou 'espera'

-- Adicionar coluna status na tabela idosos
ALTER TABLE idosos 
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'fixo' CHECK (status IN ('fixo', 'espera'));

-- Atualizar idosos existentes para 'fixo' (padrão)
UPDATE idosos SET status = 'fixo' WHERE status IS NULL;

-- Criar índice para melhor performance em filtros
CREATE INDEX IF NOT EXISTS idx_idosos_status ON idosos(status);

-- Comentário na coluna para documentação
COMMENT ON COLUMN idosos.status IS 'Status do idoso: fixo (recebe benefício) ou espera (não recebe benefício)';

