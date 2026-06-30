-- Migração: Remover galeria de fotos dos eventos
-- Data: Junho 2026
-- Descrição: A página pública de Projetos passou a exibir apenas vídeos.
--            A funcionalidade de fotos de eventos foi removida do site e do admin,
--            portanto a tabela de fotos não é mais utilizada.
--
-- ATENÇÃO: Esta operação é DESTRUTIVA e irreversível. Todos os registros de
--          fotos de eventos serão apagados. Faça backup antes de executar, se necessário.

DROP INDEX IF EXISTS idx_evento_fotos_evento_id;

DROP TABLE IF EXISTS evento_fotos;
