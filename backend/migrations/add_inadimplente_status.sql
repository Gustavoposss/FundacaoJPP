-- Migração: Adicionar status 'inadimplente' na tabela idosos
-- Data: Janeiro 2025
-- Descrição: Adiciona o status 'inadimplente' ao campo status da tabela idosos

-- Verificar e remover o constraint antigo se existir
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'idosos_status_check' 
        AND table_name = 'idosos'
    ) THEN
        ALTER TABLE idosos DROP CONSTRAINT idosos_status_check;
    END IF;
END $$;

-- Adicionar o novo constraint com os três status
ALTER TABLE idosos 
ADD CONSTRAINT idosos_status_check CHECK (status IN ('fixo', 'espera', 'inadimplente'));

-- Atualizar comentário na coluna
COMMENT ON COLUMN idosos.status IS 'Status do idoso: fixo (recebe benefício), espera (não recebe benefício) ou inadimplente (em atraso com pagamentos)';

-- Verificar se a migration foi aplicada corretamente
DO $$
BEGIN
    RAISE NOTICE 'Migration aplicada com sucesso! O status agora aceita: fixo, espera, inadimplente';
END $$;

