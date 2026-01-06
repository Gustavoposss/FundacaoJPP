-- Migração simplificada para Supabase
-- Execute este SQL no SQL Editor do Supabase

-- Remover o constraint antigo
ALTER TABLE idosos DROP CONSTRAINT IF EXISTS idosos_status_check;

-- Adicionar o novo constraint com os três status
ALTER TABLE idosos 
ADD CONSTRAINT idosos_status_check CHECK (status IN ('fixo', 'espera', 'inadimplente'));

