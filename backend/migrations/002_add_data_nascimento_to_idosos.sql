-- Adicionar coluna data_nascimento à tabela idosos
ALTER TABLE idosos 
ADD COLUMN IF NOT EXISTS data_nascimento DATE;

-- Comentário descritivo
COMMENT ON COLUMN idosos.data_nascimento IS 'Data de nascimento do idoso';

