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
    
    // Verificar se é erro de constraint do banco (status inválido)
    if (error.code === '23514' || error.message?.includes('check constraint') || error.message?.includes('idosos_status_check')) {
      return errorResponse(
        res,
        'Status inválido. Certifique-se de que a migration add_inadimplente_status.sql foi executada no banco de dados.',
        400
      );
    }
    
    // Verificar se é erro de violação de constraint única (CPF duplicado, etc)
    if (error.code === '23505') {
      return errorResponse(res, 'Já existe um idoso cadastrado com este CPF', 400);
    }
    
    return errorResponse(res, error.message || 'Erro ao criar idoso', 500);
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
    console.error('Detalhes do erro:', {
      code: error.code,
      message: error.message,
      detail: error.detail,
      constraint: error.constraint,
      stack: error.stack
    });
    
    // Verificar se é erro de constraint do banco (status inválido)
    if (error.code === '23514' || error.message?.includes('check constraint') || error.message?.includes('idosos_status_check') || error.constraint === 'idosos_status_check') {
      return errorResponse(
        res,
        'Status inválido. Certifique-se de que a migration add_inadimplente_status.sql foi executada no banco de dados. Erro: ' + (error.detail || error.message),
        400
      );
    }
    
    // Verificar se é erro de violação de constraint única (CPF duplicado, etc)
    if (error.code === '23505') {
      return errorResponse(res, 'Já existe um idoso cadastrado com este CPF', 400);
    }
    
    // Retornar mensagem mais detalhada em desenvolvimento
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Erro ao atualizar idoso. Verifique os logs do servidor.' 
      : `Erro ao atualizar idoso: ${error.message || error.detail || 'Erro desconhecido'}`;
    
    return errorResponse(res, errorMessage, 500);
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

