import db from '../services/db.js';

export const listarIdosos = async ({ search, status }) => {
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

  let query = `
    SELECT id, nome_completo, idade, sexo, telefone, cpf, data_cadastro${hasStatusColumn ? ', status' : ", 'fixo' as status"}
    FROM idosos
  `;
  const params = [];
  const conditions = [];

  if (search) {
    conditions.push(`(LOWER(nome_completo) LIKE $${params.length + 1} OR cpf LIKE $${params.length + 1})`);
    params.push(`%${search.toLowerCase()}%`);
  }

  if (status && hasStatusColumn) {
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
    SELECT id, nome_completo, idade, sexo, endereco, rg, cpf, titulo_eleitoral, telefone, data_cadastro${hasStatusColumn ? ', status' : ", 'fixo' as status"}
    FROM idosos
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

export const criarIdoso = async (dados) => {
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

  const {
    nome_completo,
    idade,
    sexo,
    endereco,
    rg,
    cpf,
    titulo_eleitoral,
    telefone,
    status = 'fixo',
  } = dados;

  if (hasStatusColumn) {
    const query = `
      INSERT INTO idosos (nome_completo, idade, sexo, endereco, rg, cpf, titulo_eleitoral, telefone, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      status,
    ]);

    return rows[0];
  } else {
    // Se a coluna não existe, inserir sem status
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

    // Adicionar status padrão no retorno
    return { ...rows[0], status: 'fixo' };
  }
};

export const atualizarIdoso = async (id, dados) => {
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

  const {
    nome_completo,
    idade,
    sexo,
    endereco,
    rg,
    cpf,
    titulo_eleitoral,
    telefone,
    status,
  } = dados;

  if (hasStatusColumn) {
    const query = `
      UPDATE idosos
      SET nome_completo = $1,
          idade = $2,
          sexo = $3,
          endereco = $4,
          rg = $5,
          cpf = $6,
          titulo_eleitoral = $7,
          telefone = $8,
          status = $9
      WHERE id = $10
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
      status || 'fixo',
      id,
    ]);

    return rows[0];
  } else {
    // Se a coluna não existe, atualizar sem status
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

    // Adicionar status padrão no retorno
    return { ...rows[0], status: 'fixo' };
  }
};

export const deletarIdoso = async (id) => {
  const query = 'DELETE FROM idosos WHERE id = $1';
  const resultado = await db.query(query, [id]);
  return resultado.rowCount > 0;
};

