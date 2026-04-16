-- Migração: Remover status 'espera' da tabela idosos
-- Data: Abril 2026
-- Descrição: Converte registros antigos com status 'espera' para 'fixo'
--            e atualiza o constraint para aceitar apenas 'fixo' e 'inadimplente'

-- Converte dados legados
UPDATE idosos
SET status = 'fixo'
WHERE status = 'espera';

-- Atualiza o constraint de status
ALTER TABLE idosos DROP CONSTRAINT IF EXISTS idosos_status_check;

ALTER TABLE idosos
ADD CONSTRAINT idosos_status_check CHECK (status IN ('fixo', 'inadimplente'));

-- Atualiza comentário da coluna
COMMENT ON COLUMN idosos.status IS 'Status do idoso: fixo ou inadimplente';
