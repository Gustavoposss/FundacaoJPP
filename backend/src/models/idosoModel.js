import db from '../services/db.js';

export const listarIdosos = async ({ search }) => {
  let query = `
    SELECT id, nome_completo, idade, sexo, telefone, cpf, data_cadastro
    FROM idosos
  `;
  const params = [];

  if (search) {
    query += ` WHERE LOWER(nome_completo) LIKE $1 OR cpf LIKE $1`;
    params.push(`%${search.toLowerCase()}%`);
  }

  query += ' ORDER BY nome_completo ASC';

  const { rows } = await db.query(query, params);
  return rows;
};

export const buscarIdosoPorId = async (id) => {
  const query = `
    SELECT id, nome_completo, idade, sexo, endereco, rg, cpf, titulo_eleitoral, telefone, data_cadastro
    FROM idosos
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

export const criarIdoso = async (dados) => {
  const {
    nome_completo,
    idade,
    sexo,
    endereco,
    rg,
    cpf,
    titulo_eleitoral,
    telefone,
  } = dados;

  const query = `
    INSERT INTO idosos (nome_completo, idade, sexo, endereco, rg, cpf, titulo_eleitoral, telefone)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const { rows } = await db.query(query, [
    nome_completo,
    idade,
    sexo,
    endereco,
    rg,
    cpf,
    titulo_eleitoral,
    telefone,
  ]);

  return rows[0];
};

export const atualizarIdoso = async (id, dados) => {
  const {
    nome_completo,
    idade,
    sexo,
    endereco,
    rg,
    cpf,
    titulo_eleitoral,
    telefone,
  } = dados;

  const query = `
    UPDATE idosos
    SET nome_completo = $1,
        idade = $2,
        sexo = $3,
        endereco = $4,
        rg = $5,
        cpf = $6,
        titulo_eleitoral = $7,
        telefone = $8
    WHERE id = $9
    RETURNING *
  `;

  const { rows } = await db.query(query, [
    nome_completo,
    idade,
    sexo,
    endereco,
    rg,
    cpf,
    titulo_eleitoral,
    telefone,
    id,
  ]);

  return rows[0];
};

export const deletarIdoso = async (id) => {
  const query = 'DELETE FROM idosos WHERE id = $1';
  const resultado = await db.query(query, [id]);
  return resultado.rowCount > 0;
};

