import {
  listarEventos,
  buscarEventoPorId,
  criarEvento,
  atualizarEvento,
  deletarEvento,
} from '../models/eventoModel.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const obterEventos = async (req, res) => {
  try {
    const eventos = await listarEventos();
    return successResponse(res, { eventos });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    return errorResponse(res, 'Erro ao listar eventos', 500);
  }
};

export const obterEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await buscarEventoPorId(id);

    if (!evento) {
      return errorResponse(res, 'Evento não encontrado', 404);
    }

    return successResponse(res, { evento });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return errorResponse(res, 'Erro ao buscar evento', 500);
  }
};

export const criarNovoEvento = async (req, res) => {
  try {
    const eventoCriado = await criarEvento(req.body);
    return successResponse(res, { evento: eventoCriado }, 'Evento criado com sucesso');
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return errorResponse(res, 'Erro ao criar evento', 500);
  }
};

export const atualizarEventoExistente = async (req, res) => {
  try {
    const { id } = req.params;
    const eventoAtualizado = await atualizarEvento(id, req.body);

    if (!eventoAtualizado) {
      return errorResponse(res, 'Evento não encontrado', 404);
    }

    return successResponse(res, { evento: eventoAtualizado }, 'Evento atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return errorResponse(res, 'Erro ao atualizar evento', 500);
  }
};

export const removerEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const removido = await deletarEvento(id);

    if (!removido) {
      return errorResponse(res, 'Evento não encontrado', 404);
    }

    return successResponse(res, {}, 'Evento removido com sucesso');
  } catch (error) {
    console.error('Erro ao remover evento:', error);
    return errorResponse(res, 'Erro ao remover evento', 500);
  }
};

