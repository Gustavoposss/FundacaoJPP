import db from '../services/db.js';

const CAMPOS_SELECT = `
  id, nome_completo, data_nascimento, idade, sexo, telefone, endereco, numero, bairro, 
  cidade, cep, rg, naturalidade, orgao_expedidor, cpf, titulo_eleitoral, zona_eleitoral, 
  secao_eleitoral, municipio_uf, data_inscricao, data_cadastro, status
`;

const CAMPOS_SELECT_LISTA = `
  id, nome_completo, idade, sexo, telefone, cpf, data_cadastro, status
`;

export const listarIdosos = async ({ search, status }) => {
  let query = `SELECT ${CAMPOS_SELECT_LISTA} FROM idosos`;
  const params = [];
  const conditions = [];

  if (search) {
    conditions.push(`(LOWER(nome_completo) LIKE $${params.length + 1} OR cpf LIKE $${params.length + 1})`);
    params.push(`%${search.toLowerCase()}%`);
  }

  if (status) {
    conditions.push(`status = $${params.length + 1}`);
    params.push(status);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY nome_completo ASC';

  const { rows } = await db.query(query, params);
  return rows;
};

export const buscarIdosoPorId = async (id) => {
  const query = `SELECT ${CAMPOS_SELECT} FROM idosos WHERE id = $1`;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

export const criarIdoso = async (dados) => {
  const {
    nome_completo,
    data_nascimento,
    idade,
    sexo,
    telefone,
    endereco,
    numero,
    bairro,
    cidade,
    cep,
    rg,
    naturalidade,
    orgao_expedidor,
    cpf,
    titulo_eleitoral,
    zona_eleitoral,
    secao_eleitoral,
    municipio_uf,
    data_inscricao,
    status = 'fixo',
  } = dados;

  const query = `
    INSERT INTO idosos (
      nome_completo, data_nascimento, idade, sexo, telefone, endereco, numero, bairro,
      cidade, cep, rg, naturalidade, orgao_expedidor, cpf, titulo_eleitoral, zona_eleitoral,
      secao_eleitoral, municipio_uf, data_inscricao, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    RETURNING *
  `;

  const { rows } = await db.query(query, [
    nome_completo,
    data_nascimento || null,
    idade,
    sexo,
    telefone,
    endereco,
    numero,
    bairro,
    cidade,
    cep,
    rg,
    naturalidade,
    orgao_expedidor,
    cpf,
    titulo_eleitoral,
    zona_eleitoral,
    secao_eleitoral,
    municipio_uf,
    data_inscricao || null,
    status,
  ]);

  return rows[0];
};

export const atualizarIdoso = async (id, dados) => {
  const {
    nome_completo,
    data_nascimento,
    idade,
    sexo,
    telefone,
    endereco,
    numero,
    bairro,
    cidade,
    cep,
    rg,
    naturalidade,
    orgao_expedidor,
    cpf,
    titulo_eleitoral,
    zona_eleitoral,
    secao_eleitoral,
    municipio_uf,
    data_inscricao,
    status,
  } = dados;

  const query = `
    UPDATE idosos
    SET nome_completo = $1,
        data_nascimento = $2,
        idade = $3,
        sexo = $4,
        telefone = $5,
        endereco = $6,
        numero = $7,
        bairro = $8,
        cidade = $9,
        cep = $10,
        rg = $11,
        naturalidade = $12,
        orgao_expedidor = $13,
        cpf = $14,
        titulo_eleitoral = $15,
        zona_eleitoral = $16,
        secao_eleitoral = $17,
        municipio_uf = $18,
        data_inscricao = $19,
        status = $20
    WHERE id = $21
    RETURNING *
  `;

  const { rows } = await db.query(query, [
    nome_completo,
    data_nascimento || null,
    idade,
    sexo,
    telefone,
    endereco,
    numero,
    bairro,
    cidade,
    cep,
    rg,
    naturalidade,
    orgao_expedidor,
    cpf,
    titulo_eleitoral,
    zona_eleitoral,
    secao_eleitoral,
    municipio_uf,
    data_inscricao || null,
    status || 'fixo',
    id,
  ]);

  return rows[0];
};

export const deletarIdoso = async (id) => {
  const query = 'DELETE FROM idosos WHERE id = $1';
  const resultado = await db.query(query, [id]);
  return resultado.rowCount > 0;
};
