-- Migração: Adicionar status 'inadimplente' na tabela idosos
-- Data: Janeiro 2025
-- Descrição: Adiciona o status 'inadimplente' ao campo status da tabela idosos

-- Remover o constraint antigo
ALTER TABLE idosos DROP CONSTRAINT IF EXISTS idosos_status_check;

-- Adicionar o novo constraint com os três status
ALTER TABLE idosos 
ADD CONSTRAINT idosos_status_check CHECK (status IN ('fixo', 'espera', 'inadimplente'));

-- Atualizar comentário na coluna
COMMENT ON COLUMN idosos.status IS 'Status do idoso: fixo (recebe benefício), espera (não recebe benefício) ou inadimplente (em atraso com pagamentos)';

