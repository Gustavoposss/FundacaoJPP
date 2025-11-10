import {
  listarPresencasPorEvento,
  listarIdososComStatus,
  registrarAtualizarPresenca,
} from '../models/presencaModel.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';

export const obterPresencasPorEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const presencas = await listarPresencasPorEvento(eventoId);
    return successResponse(res, { presencas });
  } catch (error) {
    console.error('Erro ao obter presenças:', error);
    return errorResponse(res, 'Erro ao obter presenças', 500);
  }
};

export const obterIdososComPresenca = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const idosos = await listarIdososComStatus(eventoId);
    return successResponse(res, { idosos });
  } catch (error) {
    console.error('Erro ao listar idosos/presenças:', error);
    return errorResponse(res, 'Erro ao listar presenças', 500);
  }
};

export const registrarPresencas = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { presencas } = req.body;

    if (!Array.isArray(presencas)) {
      return errorResponse(res, 'Formato de presenças inválido', 400);
    }

    const resultados = [];

    for (const presenca of presencas) {
      const { idosoId, presente } = presenca;
      const resultado = await registrarAtualizarPresenca({ eventoId, idosoId, presente });
      resultados.push(resultado);
    }

    return successResponse(res, { presencas: resultados }, 'Presenças registradas com sucesso');
  } catch (error) {
    console.error('Erro ao registrar presenças:', error);
    return errorResponse(res, 'Erro ao registrar presenças', 500);
  }
};

