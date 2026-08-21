import db from '../services/db.js';

const CAMPOS_SELECT = `
  id, numero_sorteio, nome_completo, data_nascimento, sexo, telefone, endereco, numero, bairro, 
  cidade, cep, rg, naturalidade, orgao_expedidor, cpf, titulo_eleitoral, zona_eleitoral, 
  secao_eleitoral, municipio_uf, data_inscricao, data_cadastro,
  CASE WHEN status = 'espera' THEN 'fixo' ELSE status END AS status
`;

const CAMPOS_SELECT_LISTA = `
  id, numero_sorteio, nome_completo, data_nascimento, sexo, telefone, cpf, data_cadastro,
  CASE WHEN status = 'espera' THEN 'fixo' ELSE status END AS status
`;

/**
 * Garante a coluna e numera os idosos em ordem alfabética, começando em 1.
 * O id interno do banco não muda (ele é usado em presenças e documentos).
 */
export const garantirNumeroSorteio = async () => {
  await db.query(`
    ALTER TABLE idosos
    ADD COLUMN IF NOT EXISTS numero_sorteio INTEGER
  `);

  await db.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_idosos_numero_sorteio
    ON idosos(numero_sorteio)
  `);

  await renumerarIdosos();
};

export const renumerarIdosos = async () => {
  await db.query('UPDATE idosos SET numero_sorteio = NULL');
  await db.query(`
    WITH ranked AS (
      SELECT id,
             ROW_NUMBER() OVER (ORDER BY LOWER(nome_completo) ASC, id ASC) AS rn
      FROM idosos
    )
    UPDATE idosos i
    SET numero_sorteio = ranked.rn
    FROM ranked
    WHERE i.id = ranked.id
  `);
};

export const listarIdosos = async ({ search, status }) => {
  let query = `SELECT ${CAMPOS_SELECT_LISTA} FROM idosos`;
  const params = [];
  const conditions = [];

  if (search) {
    const searchTerm = search.toLowerCase();
    const numeroBusca = searchTerm.replace(/\D/g, '');
    if (numeroBusca && numeroBusca === searchTerm.trim()) {
      conditions.push(`(
        LOWER(nome_completo) LIKE $${params.length + 1}
        OR cpf LIKE $${params.length + 1}
        OR CAST(numero_sorteio AS TEXT) = $${params.length + 2}
      )`);
      params.push(`%${searchTerm}%`, numeroBusca);
    } else {
      conditions.push(`(LOWER(nome_completo) LIKE $${params.length + 1} OR cpf LIKE $${params.length + 1})`);
      params.push(`%${searchTerm}%`);
    }
  }

  if (status) {
    const normalizedStatus = status === 'espera' ? 'fixo' : status;

    if (normalizedStatus === 'fixo') {
      conditions.push(`status IN ('fixo', 'espera')`);
    } else {
      conditions.push(`status = $${params.length + 1}`);
      params.push(normalizedStatus);
    }
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
  } = dados;

  const query = `
    INSERT INTO idosos (
      nome_completo, data_nascimento, sexo, telefone, endereco, numero, bairro,
      cidade, cep, rg, naturalidade, orgao_expedidor, cpf, titulo_eleitoral, zona_eleitoral,
      secao_eleitoral, municipio_uf, data_inscricao, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING *
  `;

  const { rows } = await db.query(query, [
    nome_completo,
    data_nascimento || null,
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
    'fixo',
  ]);

  await renumerarIdosos();
  return buscarIdosoPorId(rows[0].id);
};

export const atualizarIdoso = async (id, dados) => {
  const {
    nome_completo,
    data_nascimento,
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
        sexo = $3,
        telefone = $4,
        endereco = $5,
        numero = $6,
        bairro = $7,
        cidade = $8,
        cep = $9,
        rg = $10,
        naturalidade = $11,
        orgao_expedidor = $12,
        cpf = $13,
        titulo_eleitoral = $14,
        zona_eleitoral = $15,
        secao_eleitoral = $16,
        municipio_uf = $17,
        data_inscricao = $18,
        status = $19
    WHERE id = $20
    RETURNING *
  `;

  const normalizedStatus = status === 'espera' ? 'fixo' : status || 'fixo';

  const { rows } = await db.query(query, [
    nome_completo,
    data_nascimento || null,
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
    normalizedStatus,
    id,
  ]);

  if (!rows[0]) {
    return rows[0];
  }

  await renumerarIdosos();
  return buscarIdosoPorId(id);
};

export const deletarIdoso = async (id) => {
  const query = 'DELETE FROM idosos WHERE id = $1';
  const resultado = await db.query(query, [id]);
  if (resultado.rowCount > 0) {
    await renumerarIdosos();
  }
  return resultado.rowCount > 0;
};
