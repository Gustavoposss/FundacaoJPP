-- Script de Migração: Dados da Equipe e Patrocinadores
-- Data: Janeiro 2025
-- Descrição: Migra dados da equipe e patrocinadores do código mockado para o banco de dados
--
-- INSTRUÇÕES:
-- 1. Execute este script APÓS executar a migration 005_create_equipe_patrocinadores.sql
-- 2. Este script insere os dados existentes da equipe e patrocinadores

-- Migrar Membros da Equipe
INSERT INTO membros_equipe (nome_completo, cargo, role, foto_url, ordem_exibicao, ativo)
VALUES
  ('Possidonio Peixoto', 'Presidente', 'Liderança', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/possidonioperfil.jpeg', 1, TRUE),
  ('Lucilene Possidonio', 'Vice Presidente', 'Gestão', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/lucileneperfil.jpeg', 2, TRUE),
  ('Gustavo Possidonio', 'Lider Técnico', 'Tecnologia', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/gustavoperfil.jpeg', 3, TRUE),
  ('Rose', 'Voluntária', 'Apoio', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/roseperfil.jpeg', 4, TRUE),
  ('Gina Possidonio', 'Advogada', 'Jurídica', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/ginaperfil.jpeg', 5, TRUE),
  ('Robinson Ramalho', 'Voluntário', 'Apoio', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/robisonperfil.jpeg', 6, TRUE)
ON CONFLICT DO NOTHING;

-- Migrar Patrocinadores
INSERT INTO patrocinadores (nome, logo_url, titulo, ordem_exibicao, ativo)
VALUES
  ('Junior Soares', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/soaresperfil.png', 'Patrocinador', 1, TRUE)
ON CONFLICT DO NOTHING;

-- Verificar se os dados foram inseridos corretamente
-- SELECT COUNT(*) as total_membros FROM membros_equipe WHERE ativo = TRUE;
-- SELECT COUNT(*) as total_patrocinadores FROM patrocinadores WHERE ativo = TRUE;

-- Ver detalhes dos membros inseridos
-- SELECT id, nome_completo, cargo, role, ordem_exibicao FROM membros_equipe ORDER BY ordem_exibicao;

-- Ver detalhes dos patrocinadores inseridos
-- SELECT id, nome, titulo, ordem_exibicao FROM patrocinadores ORDER BY ordem_exibicao;

