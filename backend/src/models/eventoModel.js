import db from '../services/db.js';

export const listarEventos = async () => {
  const query = `
    SELECT id, nome, data_evento, local, descricao
    FROM eventos
    ORDER BY data_evento DESC
  `;
  const { rows } = await db.query(query);
  return rows;
};

export const buscarEventoPorId = async (id) => {
  const query = `
    SELECT id, nome, data_evento, local, descricao
    FROM eventos
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

export const criarEvento = async ({ nome, data_evento, local, descricao }) => {
  const query = `
    INSERT INTO eventos (nome, data_evento, local, descricao)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await db.query(query, [nome, data_evento, local, descricao]);
  return rows[0];
};

export const atualizarEvento = async (id, { nome, data_evento, local, descricao }) => {
  const query = `
    UPDATE eventos
    SET nome = $1,
        data_evento = $2,
        local = $3,
        descricao = $4
    WHERE id = $5
    RETURNING *
  `;
  const { rows } = await db.query(query, [nome, data_evento, local, descricao, id]);
  return rows[0];
};

export const deletarEvento = async (id) => {
  const query = 'DELETE FROM eventos WHERE id = $1';
  const resultado = await db.query(query, [id]);
  return resultado.rowCount > 0;
};

