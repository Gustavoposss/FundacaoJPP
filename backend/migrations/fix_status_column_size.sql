-- Migração: Aumentar tamanho da coluna status
-- Data: Janeiro 2025
-- Descrição: A coluna status foi criada com VARCHAR(10), mas "inadimplente" tem 12 caracteres

-- Alterar o tipo da coluna para suportar "inadimplente" (12 caracteres)
ALTER TABLE idosos 
ALTER COLUMN status TYPE VARCHAR(20);

