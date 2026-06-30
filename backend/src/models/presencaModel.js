import db from '../services/db.js';

export const listarPresencasPorEvento = async (eventoId) => {
  const query = `
    SELECT p.id,
           p.presente,
           p.data_registro,
           i.id AS idoso_id,
           i.nome_completo
    FROM presencas p
    INNER JOIN idosos i ON i.id = p.id_idoso
    WHERE p.id_evento = $1
    ORDER BY i.nome_completo ASC
  `;
  const { rows } = await db.query(query, [eventoId]);
  return rows;
};

export const listarIdososComStatus = async (eventoId) => {
  // Verificar se a coluna status existe
  let hasStatusColumn = false;
  try {
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'idosos' AND column_name = 'status'
    `;
    const { rows } = await db.query(checkQuery);
    hasStatusColumn = rows.length > 0;
  } catch (error) {
    console.error('Erro ao verificar coluna status:', error);
    hasStatusColumn = false;
  }

  const query = `
    SELECT i.id,
           i.nome_completo,
           i.cpf,
           ${hasStatusColumn ? 'i.status,' : "'fixo' as status,"}
           COALESCE(p.presente, false) AS presente,
           p.id AS presenca_id
    FROM idosos i
    LEFT JOIN presencas p
      ON p.id_idoso = i.id AND p.id_evento = $1
    ORDER BY i.nome_completo ASC
  `;
  const { rows } = await db.query(query, [eventoId]);
  return rows;
};

export const registrarAtualizarPresenca = async ({ eventoId, idosoId, presente }) => {
  const query = `
    INSERT INTO presencas (id_evento, id_idoso, presente)
    VALUES ($1, $2, $3)
    ON CONFLICT (id_evento, id_idoso)
    DO UPDATE SET presente = EXCLUDED.presente, data_registro = CURRENT_TIMESTAMP
    RETURNING *
  `;
  const { rows } = await db.query(query, [eventoId, idosoId, presente]);
  return rows[0];
};

// Registra/atualiza várias presenças em uma única query (muito mais rápido que
// fazer um INSERT por idoso em sequência).
export const registrarPresencasEmLote = async (eventoId, presencas) => {
  if (!Array.isArray(presencas) || presencas.length === 0) {
    return [];
  }

  // Remove duplicatas pelo idosoId (o ON CONFLICT não pode afetar a mesma linha
  // duas vezes na mesma instrução). Mantém o último valor enviado.
  const presencasPorIdoso = new Map();
  for (const presenca of presencas) {
    if (presenca?.idosoId === undefined || presenca?.idosoId === null) continue;
    presencasPorIdoso.set(presenca.idosoId, Boolean(presenca.presente));
  }

  const presencasUnicas = [...presencasPorIdoso.entries()];
  if (presencasUnicas.length === 0) {
    return [];
  }

  const params = [eventoId];
  const valores = presencasUnicas.map(([idosoId, presente], index) => {
    const idosoParam = index * 2 + 2;
    const presenteParam = index * 2 + 3;
    params.push(idosoId, presente);
    return `($1, $${idosoParam}, $${presenteParam})`;
  });

  const query = `
    INSERT INTO presencas (id_evento, id_idoso, presente)
    VALUES ${valores.join(', ')}
    ON CONFLICT (id_evento, id_idoso)
    DO UPDATE SET presente = EXCLUDED.presente, data_registro = CURRENT_TIMESTAMP
    RETURNING *
  `;

  const { rows } = await db.query(query, params);
  return rows;
};

export const removerPresencasPorEvento = async (eventoId) => {
  const query = 'DELETE FROM presencas WHERE id_evento = $1';
  await db.query(query, [eventoId]);
};

