-- Script de Migração: Dados do Evento Novembro Azul
-- Data: Janeiro 2025
-- Descrição: Migra dados do evento Novembro Azul do código mockado para o banco de dados
--
-- INSTRUÇÕES:
-- 1. Execute este script APÓS executar a migration 003_add_eventos_publicos_fields.sql
-- 2. Primeiro, verifique se já existe um evento "Novembro Azul" no banco
-- 3. Se não existir, crie o evento primeiro usando a interface administrativa
-- 4. Depois, execute este script substituindo EVENTO_ID pelo ID do evento criado

-- PASSO 1: Verificar se existe evento "Novembro Azul"
-- Execute esta query para encontrar o ID do evento:
-- SELECT id, nome FROM eventos WHERE nome ILIKE '%novembro azul%';

-- PASSO 2: Atualizar o evento com os dados públicos
-- Substitua EVENTO_ID pelo ID encontrado no passo 1
UPDATE eventos 
SET 
  video_url = 'https://www.youtube.com/embed/a6KqnthgnMU?start=198',
  cor_tema = 'blue',
  exibir_publico = TRUE,
  descricao = COALESCE(descricao, 'Campanha de conscientização sobre a saúde do homem e prevenção do câncer de próstata')
WHERE nome ILIKE '%novembro azul%';

-- PASSO 3: Inserir as fotos do evento
-- Substitua EVENTO_ID pelo ID encontrado no passo 1
-- Se o evento não existir, você precisará criar primeiro:
-- INSERT INTO eventos (nome, data_evento, local, descricao, video_url, cor_tema, exibir_publico)
-- VALUES ('Novembro Azul', '2024-11-26', 'Local do evento', 'Campanha de conscientização sobre a saúde do homem e prevenção do câncer de próstata', 'https://www.youtube.com/embed/a6KqnthgnMU?start=198', 'blue', TRUE)
-- RETURNING id;

-- Depois, execute este INSERT substituindo EVENTO_ID:
INSERT INTO evento_fotos (evento_id, foto_url, alt_text, ordem_exibicao)
SELECT 
  (SELECT id FROM eventos WHERE nome ILIKE '%novembro azul%' LIMIT 1) as evento_id,
  foto_url,
  alt_text,
  ordem_exibicao
FROM (VALUES
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.23%20(1).jpeg', 'Evento Novembro Azul 1', 1),
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.23.jpeg', 'Evento Novembro Azul 2', 2),
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.27.jpeg', 'Evento Novembro Azul 3', 3),
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.28.jpeg', 'Evento Novembro Azul 4', 4),
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.29.jpeg', 'Evento Novembro Azul 5', 5),
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.44.jpeg', 'Evento Novembro Azul 6', 6),
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.53.35.jpeg', 'Evento Novembro Azul 7', 7),
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.53.36.jpeg', 'Evento Novembro Azul 8', 8),
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.53.37%20(1).jpeg', 'Evento Novembro Azul 9', 9),
  ('https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.53.37.jpeg', 'Evento Novembro Azul 10', 10)
) AS fotos(foto_url, alt_text, ordem_exibicao)
WHERE NOT EXISTS (
  SELECT 1 FROM evento_fotos 
  WHERE evento_id = (SELECT id FROM eventos WHERE nome ILIKE '%novembro azul%' LIMIT 1)
  AND foto_url = fotos.foto_url
);

-- Verificar se as fotos foram inseridas corretamente
-- SELECT ef.*, e.nome as evento_nome 
-- FROM evento_fotos ef
-- JOIN eventos e ON e.id = ef.evento_id
-- WHERE e.nome ILIKE '%novembro azul%'
-- ORDER BY ef.ordem_exibicao;

