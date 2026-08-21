-- Número sequencial alfabético para sorteio (não altera o id interno).
ALTER TABLE idosos
ADD COLUMN IF NOT EXISTS numero_sorteio INTEGER;

UPDATE idosos SET numero_sorteio = NULL;

WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (ORDER BY LOWER(nome_completo) ASC, id ASC) AS rn
  FROM idosos
)
UPDATE idosos i
SET numero_sorteio = ranked.rn
FROM ranked
WHERE i.id = ranked.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_idosos_numero_sorteio
ON idosos(numero_sorteio);

COMMENT ON COLUMN idosos.numero_sorteio IS 'Número sequencial em ordem alfabética, iniciando em 1, para uso em sorteios';
