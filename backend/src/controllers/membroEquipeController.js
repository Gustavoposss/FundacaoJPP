import {
  listarMembros,
  listarMembrosAtivos,
  buscarMembroPorId,
  criarMembro,
  atualizarMembro,
  deletarMembro,
} from '../models/membroEquipeModel.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

// Listar todos os membros (admin)
export const obterMembros = async (req, res) => {
  try {
    const membros = await listarMembros();
    return successResponse(res, { membros });
  } catch (error) {
    console.error('Erro ao listar membros:', error);
    return errorResponse(res, 'Erro ao listar membros', 500);
  }
};

// Listar membros ativos (público)
export const obterMembrosAtivos = async (req, res) => {
  try {
    const membros = await listarMembrosAtivos();
    return successResponse(res, { membros });
  } catch (error) {
    console.error('Erro ao listar membros ativos:', error);
    return errorResponse(res, 'Erro ao listar membros', 500);
  }
};

// Buscar membro por ID
export const obterMembroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const membro = await buscarMembroPorId(id);

    if (!membro) {
      return errorResponse(res, 'Membro não encontrado', 404);
    }

    return successResponse(res, { membro });
  } catch (error) {
    console.error('Erro ao buscar membro:', error);
    return errorResponse(res, 'Erro ao buscar membro', 500);
  }
};

// Criar novo membro
export const criarNovoMembro = async (req, res) => {
  try {
    const { nome_completo, cargo, role, foto_url, ordem_exibicao, ativo } = req.body;

    if (!nome_completo || !cargo) {
      return errorResponse(res, 'Nome completo e cargo são obrigatórios', 400);
    }

    const membro = await criarMembro({
      nome_completo,
      cargo,
      role,
      foto_url,
      ordem_exibicao,
      ativo,
    });

    return successResponse(res, { membro }, 'Membro criado com sucesso', 201);
  } catch (error) {
    console.error('Erro ao criar membro:', error);
    return errorResponse(res, 'Erro ao criar membro', 500);
  }
};

// Atualizar membro
export const atualizarMembroExistente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_completo, cargo, role, foto_url, ordem_exibicao, ativo } = req.body;

    if (!nome_completo || !cargo) {
      return errorResponse(res, 'Nome completo e cargo são obrigatórios', 400);
    }

    const membro = await atualizarMembro(id, {
      nome_completo,
      cargo,
      role,
      foto_url,
      ordem_exibicao,
      ativo,
    });

    if (!membro) {
      return errorResponse(res, 'Membro não encontrado', 404);
    }

    return successResponse(res, { membro }, 'Membro atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    return errorResponse(res, 'Erro ao atualizar membro', 500);
  }
};

// Deletar membro
export const removerMembro = async (req, res) => {
  try {
    const { id } = req.params;
    const removido = await deletarMembro(id);

    if (!removido) {
      return errorResponse(res, 'Membro não encontrado', 404);
    }

    return successResponse(res, {}, 'Membro removido com sucesso');
  } catch (error) {
    console.error('Erro ao remover membro:', error);
    return errorResponse(res, 'Erro ao remover membro', 500);
  }
};

