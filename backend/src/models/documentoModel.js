import db from '../services/db.js';

export const listarDocumentosPorIdoso = async (idosoId) => {
  const query = `
    SELECT id, id_idoso, nome_arquivo, url_arquivo, data_upload
    FROM documentos
    WHERE id_idoso = $1
    ORDER BY data_upload DESC
  `;
  const { rows } = await db.query(query, [idosoId]);
  return rows;
};

export const criarDocumento = async ({ idIdoso, nomeArquivo, urlArquivo }) => {
  const query = `
    INSERT INTO documentos (id_idoso, nome_arquivo, url_arquivo)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await db.query(query, [idIdoso, nomeArquivo, urlArquivo]);
  return rows[0];
};

export const deletarDocumento = async (id) => {
  const query = 'DELETE FROM documentos WHERE id = $1 RETURNING *';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

