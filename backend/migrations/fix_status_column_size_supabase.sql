-- Migração simplificada para Supabase
-- Execute este SQL no SQL Editor do Supabase

-- Alterar o tipo da coluna status de VARCHAR(10) para VARCHAR(20)
-- Isso permite armazenar "inadimplente" que tem 12 caracteres
ALTER TABLE idosos 
ALTER COLUMN status TYPE VARCHAR(20);

