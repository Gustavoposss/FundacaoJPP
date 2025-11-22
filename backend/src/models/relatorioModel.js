import db from '../services/db.js';

/**
 * Busca presenças com filtros avançados
 */
export const buscarPresencas = async ({ inicio, fim, idoso_id, evento_id, presente, ordenar = 'data_desc' }) => {
  let query = `
    SELECT 
      p.id,
      p.presente,
      p.data_registro,
      i.id AS idoso_id,
      i.nome_completo AS idoso_nome,
      i.cpf AS idoso_cpf,
      e.id AS evento_id,
      e.nome AS evento_nome,
      e.data_evento AS evento_data,
      e.local AS evento_local
    FROM presencas p
    INNER JOIN idosos i ON i.id = p.id_idoso
    INNER JOIN eventos e ON e.id = p.id_evento
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  if (inicio) {
    query += ` AND e.data_evento >= $${paramIndex}`;
    params.push(inicio);
    paramIndex++;
  }

  if (fim) {
    query += ` AND e.data_evento <= $${paramIndex}`;
    params.push(fim);
    paramIndex++;
  }

  if (idoso_id) {
    query += ` AND i.id = $${paramIndex}`;
    params.push(idoso_id);
    paramIndex++;
  }

  if (evento_id) {
    query += ` AND e.id = $${paramIndex}`;
    params.push(evento_id);
    paramIndex++;
  }

  if (presente !== undefined && presente !== null && presente !== '') {
    query += ` AND p.presente = $${paramIndex}`;
    params.push(presente === 'true' || presente === true);
    paramIndex++;
  }

  // Ordenação
  const orderBy = {
    data_desc: 'e.data_evento DESC, i.nome_completo ASC',
    data_asc: 'e.data_evento ASC, i.nome_completo ASC',
    nome_asc: 'i.nome_completo ASC, e.data_evento DESC',
    nome_desc: 'i.nome_completo DESC, e.data_evento DESC',
  };

  query += ` ORDER BY ${orderBy[ordenar] || orderBy.data_desc}`;

  const { rows } = await db.query(query, params);
  return rows;
};

/**
 * Busca eventos com filtros avançados
 */
export const buscarEventos = async ({ inicio, fim, nome, local, ordenar = 'data_desc' }) => {
  let query = `
    SELECT 
      e.id,
      e.nome,
      e.data_evento,
      e.local,
      e.descricao,
      COUNT(DISTINCT p.id_idoso) FILTER (WHERE p.presente = true) AS total_presentes,
      COUNT(DISTINCT p.id_idoso) AS total_cadastrados
    FROM eventos e
    LEFT JOIN presencas p ON p.id_evento = e.id
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  if (inicio) {
    query += ` AND e.data_evento >= $${paramIndex}`;
    params.push(inicio);
    paramIndex++;
  }

  if (fim) {
    query += ` AND e.data_evento <= $${paramIndex}`;
    params.push(fim);
    paramIndex++;
  }

  if (nome) {
    query += ` AND LOWER(e.nome) LIKE $${paramIndex}`;
    params.push(`%${nome.toLowerCase()}%`);
    paramIndex++;
  }

  if (local) {
    query += ` AND LOWER(e.local) LIKE $${paramIndex}`;
    params.push(`%${local.toLowerCase()}%`);
    paramIndex++;
  }

  query += ' GROUP BY e.id';

  // Ordenação
  const orderBy = {
    data_desc: 'e.data_evento DESC',
    data_asc: 'e.data_evento ASC',
    nome_asc: 'e.nome ASC',
    nome_desc: 'e.nome DESC',
    presentes_desc: 'total_presentes DESC',
    presentes_asc: 'total_presentes ASC',
  };

  query += ` ORDER BY ${orderBy[ordenar] || orderBy.data_desc}`;

  const { rows } = await db.query(query, params);
  return rows;
};

/**
 * Busca idosos com filtros avançados
 */
export const buscarIdosos = async ({ inicio, fim, nome, cpf, sexo, idade_min, idade_max, status, ordenar = 'nome_asc' }) => {
  let query = `
    SELECT 
      i.id,
      i.nome_completo,
      i.idade,
      i.sexo,
      i.telefone,
      i.cpf,
      i.rg,
      i.data_cadastro,
      i.status,
      COUNT(DISTINCT p.id_evento) FILTER (WHERE p.presente = true) AS total_presencas
    FROM idosos i
    LEFT JOIN presencas p ON p.id_idoso = i.id
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  if (inicio) {
    query += ` AND i.data_cadastro >= $${paramIndex}`;
    params.push(inicio);
    paramIndex++;
  }

  if (fim) {
    query += ` AND i.data_cadastro <= $${paramIndex}`;
    params.push(fim);
    paramIndex++;
  }

  if (nome) {
    query += ` AND LOWER(i.nome_completo) LIKE $${paramIndex}`;
    params.push(`%${nome.toLowerCase()}%`);
    paramIndex++;
  }

  if (cpf) {
    query += ` AND i.cpf LIKE $${paramIndex}`;
    params.push(`%${cpf.replace(/\D/g, '')}%`);
    paramIndex++;
  }

  if (sexo) {
    query += ` AND i.sexo = $${paramIndex}`;
    params.push(sexo);
    paramIndex++;
  }

  if (idade_min) {
    query += ` AND i.idade >= $${paramIndex}`;
    params.push(Number(idade_min));
    paramIndex++;
  }

  if (idade_max) {
    query += ` AND i.idade <= $${paramIndex}`;
    params.push(Number(idade_max));
    paramIndex++;
  }

  if (status) {
    query += ` AND i.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  query += ' GROUP BY i.id';

  // Ordenação
  const orderBy = {
    nome_asc: 'i.nome_completo ASC',
    nome_desc: 'i.nome_completo DESC',
    idade_asc: 'i.idade ASC',
    idade_desc: 'i.idade DESC',
    cadastro_desc: 'i.data_cadastro DESC',
    cadastro_asc: 'i.data_cadastro ASC',
    presencas_desc: 'total_presencas DESC',
    presencas_asc: 'total_presencas ASC',
  };

  query += ` ORDER BY ${orderBy[ordenar] || orderBy.nome_asc}`;

  const { rows } = await db.query(query, params);
  return rows;
};

