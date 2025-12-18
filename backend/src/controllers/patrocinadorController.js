import {
  listarPatrocinadores,
  listarPatrocinadoresAtivos,
  buscarPatrocinadorPorId,
  criarPatrocinador,
  atualizarPatrocinador,
  deletarPatrocinador,
} from '../models/patrocinadorModel.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

// Listar todos os patrocinadores (admin)
export const obterPatrocinadores = async (req, res) => {
  try {
    const patrocinadores = await listarPatrocinadores();
    return successResponse(res, { patrocinadores });
  } catch (error) {
    console.error('Erro ao listar patrocinadores:', error);
    return errorResponse(res, 'Erro ao listar patrocinadores', 500);
  }
};

// Listar patrocinadores ativos (público)
export const obterPatrocinadoresAtivos = async (req, res) => {
  try {
    const patrocinadores = await listarPatrocinadoresAtivos();
    return successResponse(res, { patrocinadores });
  } catch (error) {
    console.error('Erro ao listar patrocinadores ativos:', error);
    return errorResponse(res, 'Erro ao listar patrocinadores', 500);
  }
};

// Buscar patrocinador por ID
export const obterPatrocinadorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const patrocinador = await buscarPatrocinadorPorId(id);

    if (!patrocinador) {
      return errorResponse(res, 'Patrocinador não encontrado', 404);
    }

    return successResponse(res, { patrocinador });
  } catch (error) {
    console.error('Erro ao buscar patrocinador:', error);
    return errorResponse(res, 'Erro ao buscar patrocinador', 500);
  }
};

// Criar novo patrocinador
export const criarNovoPatrocinador = async (req, res) => {
  try {
    const { nome, logo_url, titulo, link_website, ordem_exibicao, ativo } = req.body;

    if (!nome) {
      return errorResponse(res, 'Nome é obrigatório', 400);
    }

    const patrocinador = await criarPatrocinador({
      nome,
      logo_url,
      titulo,
      link_website,
      ordem_exibicao,
      ativo,
    });

    return successResponse(res, { patrocinador }, 'Patrocinador criado com sucesso', 201);
  } catch (error) {
    console.error('Erro ao criar patrocinador:', error);
    return errorResponse(res, 'Erro ao criar patrocinador', 500);
  }
};

// Atualizar patrocinador
export const atualizarPatrocinadorExistente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, logo_url, titulo, link_website, ordem_exibicao, ativo } = req.body;

    if (!nome) {
      return errorResponse(res, 'Nome é obrigatório', 400);
    }

    const patrocinador = await atualizarPatrocinador(id, {
      nome,
      logo_url,
      titulo,
      link_website,
      ordem_exibicao,
      ativo,
    });

    if (!patrocinador) {
      return errorResponse(res, 'Patrocinador não encontrado', 404);
    }

    return successResponse(res, { patrocinador }, 'Patrocinador atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar patrocinador:', error);
    return errorResponse(res, 'Erro ao atualizar patrocinador', 500);
  }
};

// Deletar patrocinador
export const removerPatrocinador = async (req, res) => {
  try {
    const { id } = req.params;
    const removido = await deletarPatrocinador(id);

    if (!removido) {
      return errorResponse(res, 'Patrocinador não encontrado', 404);
    }

    return successResponse(res, {}, 'Patrocinador removido com sucesso');
  } catch (error) {
    console.error('Erro ao remover patrocinador:', error);
    return errorResponse(res, 'Erro ao remover patrocinador', 500);
  }
};

