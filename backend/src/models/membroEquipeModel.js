import db from '../services/db.js';

// Listar todos os membros (para admin)
export const listarMembros = async () => {
  const query = `
    SELECT id, nome_completo, cargo, role, foto_url, ordem_exibicao, ativo, created_at, updated_at
    FROM membros_equipe
    ORDER BY ordem_exibicao ASC, nome_completo ASC
  `;
  const { rows } = await db.query(query);
  return rows;
};

// Listar apenas membros ativos (para página pública)
export const listarMembrosAtivos = async () => {
  const query = `
    SELECT id, nome_completo, cargo, role, foto_url, ordem_exibicao
    FROM membros_equipe
    WHERE ativo = TRUE
    ORDER BY ordem_exibicao ASC, nome_completo ASC
  `;
  const { rows } = await db.query(query);
  return rows;
};

// Buscar membro por ID
export const buscarMembroPorId = async (id) => {
  const query = `
    SELECT id, nome_completo, cargo, role, foto_url, ordem_exibicao, ativo, created_at, updated_at
    FROM membros_equipe
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// Criar novo membro
export const criarMembro = async ({ nome_completo, cargo, role, foto_url, ordem_exibicao, ativo }) => {
  const query = `
    INSERT INTO membros_equipe (nome_completo, cargo, role, foto_url, ordem_exibicao, ativo)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const { rows } = await db.query(query, [
    nome_completo,
    cargo,
    role || null,
    foto_url || null,
    ordem_exibicao || 0,
    ativo !== undefined ? ativo : true
  ]);
  return rows[0];
};

// Atualizar membro
export const atualizarMembro = async (id, { nome_completo, cargo, role, foto_url, ordem_exibicao, ativo }) => {
  const query = `
    UPDATE membros_equipe
    SET nome_completo = $1,
        cargo = $2,
        role = $3,
        foto_url = $4,
        ordem_exibicao = $5,
        ativo = $6,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
  `;
  const { rows } = await db.query(query, [
    nome_completo,
    cargo,
    role || null,
    foto_url || null,
    ordem_exibicao || 0,
    ativo !== undefined ? ativo : true,
    id
  ]);
  return rows[0];
};

// Deletar membro
export const deletarMembro = async (id) => {
  const query = 'DELETE FROM membros_equipe WHERE id = $1';
  const resultado = await db.query(query, [id]);
  return resultado.rowCount > 0;
};

