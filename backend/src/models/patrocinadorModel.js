import db from '../services/db.js';

// Listar todos os patrocinadores (para admin)
export const listarPatrocinadores = async () => {
  const query = `
    SELECT id, nome, logo_url, titulo, link_website, ordem_exibicao, ativo, created_at, updated_at
    FROM patrocinadores
    ORDER BY ordem_exibicao ASC, nome ASC
  `;
  const { rows } = await db.query(query);
  return rows;
};

// Listar apenas patrocinadores ativos (para página pública)
export const listarPatrocinadoresAtivos = async () => {
  const query = `
    SELECT id, nome, logo_url, titulo, link_website, ordem_exibicao
    FROM patrocinadores
    WHERE ativo = TRUE
    ORDER BY ordem_exibicao ASC, nome ASC
  `;
  const { rows } = await db.query(query);
  return rows;
};

// Buscar patrocinador por ID
export const buscarPatrocinadorPorId = async (id) => {
  const query = `
    SELECT id, nome, logo_url, titulo, link_website, ordem_exibicao, ativo, created_at, updated_at
    FROM patrocinadores
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// Criar novo patrocinador
export const criarPatrocinador = async ({ nome, logo_url, titulo, link_website, ordem_exibicao, ativo }) => {
  const query = `
    INSERT INTO patrocinadores (nome, logo_url, titulo, link_website, ordem_exibicao, ativo)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const { rows } = await db.query(query, [
    nome,
    logo_url || null,
    titulo || null,
    link_website || null,
    ordem_exibicao || 0,
    ativo !== undefined ? ativo : true
  ]);
  return rows[0];
};

// Atualizar patrocinador
export const atualizarPatrocinador = async (id, { nome, logo_url, titulo, link_website, ordem_exibicao, ativo }) => {
  const query = `
    UPDATE patrocinadores
    SET nome = $1,
        logo_url = $2,
        titulo = $3,
        link_website = $4,
        ordem_exibicao = $5,
        ativo = $6,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
  `;
  const { rows } = await db.query(query, [
    nome,
    logo_url || null,
    titulo || null,
    link_website || null,
    ordem_exibicao || 0,
    ativo !== undefined ? ativo : true,
    id
  ]);
  return rows[0];
};

// Deletar patrocinador
export const deletarPatrocinador = async (id) => {
  const query = 'DELETE FROM patrocinadores WHERE id = $1';
  const resultado = await db.query(query, [id]);
  return resultado.rowCount > 0;
};

