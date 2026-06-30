import db from '../services/db.js';

export const listarEventos = async () => {
  const query = `
    SELECT id, nome, data_evento, local, descricao, video_url, cor_tema, exibir_publico
    FROM eventos
    ORDER BY data_evento DESC
  `;
  const { rows } = await db.query(query);
  return rows;
};

export const buscarEventoPorId = async (id) => {
  const query = `
    SELECT id, nome, data_evento, local, descricao, video_url, cor_tema, exibir_publico
    FROM eventos
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

export const criarEvento = async ({ nome, data_evento, local, descricao, video_url, cor_tema, exibir_publico }) => {
  const query = `
    INSERT INTO eventos (nome, data_evento, local, descricao, video_url, cor_tema, exibir_publico)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const { rows } = await db.query(query, [
    nome, 
    data_evento, 
    local, 
    descricao, 
    video_url || null, 
    cor_tema || 'blue', 
    exibir_publico !== undefined ? exibir_publico : true
  ]);
  return rows[0];
};

export const atualizarEvento = async (id, { nome, data_evento, local, descricao, video_url, cor_tema, exibir_publico }) => {
  const query = `
    UPDATE eventos
    SET nome = $1,
        data_evento = $2,
        local = $3,
        descricao = $4,
        video_url = $5,
        cor_tema = $6,
        exibir_publico = $7
    WHERE id = $8
    RETURNING *
  `;
  const { rows } = await db.query(query, [
    nome, 
    data_evento, 
    local, 
    descricao, 
    video_url || null, 
    cor_tema || 'blue', 
    exibir_publico !== undefined ? exibir_publico : true,
    id
  ]);
  return rows[0];
};

export const deletarEvento = async (id) => {
  const query = 'DELETE FROM eventos WHERE id = $1';
  const resultado = await db.query(query, [id]);
  return resultado.rowCount > 0;
};

// Funções para eventos públicos
export const listarEventosPublicos = async () => {
  const query = `
    SELECT 
      id, 
      nome, 
      data_evento, 
      local, 
      descricao,
      video_url,
      cor_tema
    FROM eventos
    WHERE exibir_publico = TRUE
    ORDER BY data_evento DESC
  `;
  const { rows } = await db.query(query);
  return rows;
};

export const buscarEventoPublico = async (id) => {
  const query = `
    SELECT 
      id, 
      nome, 
      data_evento, 
      local, 
      descricao,
      video_url,
      cor_tema
    FROM eventos
    WHERE id = $1 AND exibir_publico = TRUE
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

