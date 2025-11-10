import db from '../services/db.js';

export const findUserByEmail = async (email) => {
  const query = 'SELECT id, nome, email, senha_hash, tipo FROM usuarios WHERE email = $1';
  const { rows } = await db.query(query, [email]);
  return rows[0];
};

export const createUser = async ({ nome, email, senhaHash, tipo = 'colaborador' }) => {
  const query = `
    INSERT INTO usuarios (nome, email, senha_hash, tipo)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nome, email, tipo
  `;
  const { rows } = await db.query(query, [nome, email, senhaHash, tipo]);
  return rows[0];
};

