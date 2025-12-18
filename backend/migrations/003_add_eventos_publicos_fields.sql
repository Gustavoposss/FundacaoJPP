-- Migração: Adicionar campos públicos em eventos e criar tabela de fotos
-- Data: Janeiro 2025
-- Descrição: Adiciona suporte para eventos públicos com galeria de fotos e vídeos

-- Adicionar campos na tabela eventos para suporte a conteúdo público
ALTER TABLE eventos 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS cor_tema VARCHAR(50) DEFAULT 'blue',
ADD COLUMN IF NOT EXISTS exibir_publico BOOLEAN DEFAULT TRUE;

-- Criar tabela de fotos dos eventos
CREATE TABLE IF NOT EXISTS evento_fotos (
  id SERIAL PRIMARY KEY,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  ordem_exibicao INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_evento_fotos_evento_id ON evento_fotos(evento_id);
CREATE INDEX IF NOT EXISTS idx_eventos_exibir_publico ON eventos(exibir_publico) WHERE exibir_publico = TRUE;

-- Comentários para documentação
COMMENT ON COLUMN eventos.video_url IS 'URL do vídeo do YouTube do evento';
COMMENT ON COLUMN eventos.cor_tema IS 'Cor do tema do evento (blue, green, red, etc.)';
COMMENT ON COLUMN eventos.exibir_publico IS 'Se o evento deve ser exibido na página pública';
COMMENT ON TABLE evento_fotos IS 'Galeria de fotos dos eventos públicos';

