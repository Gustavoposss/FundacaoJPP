import {
  listarIdosos,
  buscarIdosoPorId,
  criarIdoso,
  atualizarIdoso,
  deletarIdoso,
} from '../models/idosoModel.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const obterIdosos = async (req, res) => {
  try {
    const { search, status } = req.query;
    const idosos = await listarIdosos({ search, status });
    return successResponse(res, { idosos });
  } catch (error) {
    console.error('Erro ao listar idosos:', error);
    return errorResponse(res, 'Erro ao listar idosos', 500);
  }
};

export const obterIdosoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const idoso = await buscarIdosoPorId(id);

    if (!idoso) {
      return errorResponse(res, 'Idoso não encontrado', 404);
    }

    return successResponse(res, { idoso });
  } catch (error) {
    console.error('Erro ao buscar idoso:', error);
    return errorResponse(res, 'Erro ao buscar idoso', 500);
  }
};

export const criarNovoIdoso = async (req, res) => {
  try {
    const idosoCriado = await criarIdoso(req.body);
    return successResponse(res, { idoso: idosoCriado }, 'Idoso cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao criar idoso:', error);
    return errorResponse(res, 'Erro ao criar idoso', 500);
  }
};

export const atualizarIdosoExistente = async (req, res) => {
  try {
    const { id } = req.params;
    const idosoAtualizado = await atualizarIdoso(id, req.body);

    if (!idosoAtualizado) {
      return errorResponse(res, 'Idoso não encontrado', 404);
    }

    return successResponse(res, { idoso: idosoAtualizado }, 'Idoso atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar idoso:', error);
    return errorResponse(res, 'Erro ao atualizar idoso', 500);
  }
};

export const removerIdoso = async (req, res) => {
  try {
    const { id } = req.params;
    const removido = await deletarIdoso(id);

    if (!removido) {
      return errorResponse(res, 'Idoso não encontrado', 404);
    }

    return successResponse(res, {}, 'Idoso removido com sucesso');
  } catch (error) {
    console.error('Erro ao remover idoso:', error);
    return errorResponse(res, 'Erro ao remover idoso', 500);
  }
};

