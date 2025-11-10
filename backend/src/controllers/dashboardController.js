import db from '../services/db.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

const sumPresentesQuery = `
  SELECT e.id,
         e.nome,
         e.data_evento,
         COALESCE(SUM(CASE WHEN p.presente THEN 1 ELSE 0 END), 0) AS presentes
  FROM eventos e
  LEFT JOIN presencas p ON p.id_evento = e.id
  GROUP BY e.id
  ORDER BY e.data_evento DESC
  LIMIT 6
`;

export const obterResumoDashboard = async (_req, res) => {
  try {
    const [{ rows: idososRows }, { rows: eventosRows }] = await Promise.all([
      db.query('SELECT COUNT(*)::int AS total FROM idosos'),
      db.query('SELECT COUNT(*)::int AS total FROM eventos'),
    ]);

    const proximoEventoQuery = `
      SELECT id, nome, data_evento
      FROM eventos
      WHERE data_evento >= CURRENT_DATE
      ORDER BY data_evento ASC
      LIMIT 1
    `;

    const [{ rows: proximoEventoRows }, { rows: presencasRows }] = await Promise.all([
      db.query(proximoEventoQuery),
      db.query(sumPresentesQuery),
    ]);

    const proximoEvento = proximoEventoRows[0]
      ? {
          id: proximoEventoRows[0].id,
          nome: proximoEventoRows[0].nome,
          data_evento: proximoEventoRows[0].data_evento,
        }
      : null;

    return successResponse(
      res,
      {
        total_idosos: idososRows[0]?.total ?? 0,
        total_eventos: eventosRows[0]?.total ?? 0,
        proximo_evento: proximoEvento,
        presencasRecentes: presencasRows.map((row) => ({
          id: row.id,
          evento: row.nome,
          data_evento: row.data_evento,
          presentes: Number(row.presentes) || 0,
        })),
      },
      'Resumo carregado com sucesso'
    );
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    return errorResponse(res, 'Erro ao carregar dados do dashboard', 500);
  }
};

