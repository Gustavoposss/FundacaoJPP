import {
  listarEventos,
  buscarEventoPorId,
  criarEvento,
  atualizarEvento,
  deletarEvento,
  listarEventosPublicos,
  buscarEventoPublicoComFotos,
  listarFotosEvento,
  adicionarFotoEvento,
  removerFotoEvento,
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

// Endpoints públicos (sem autenticação)
export const listarEventosPublicosController = async (req, res) => {
  try {
    const eventos = await listarEventosPublicos();
    return successResponse(res, { eventos });
  } catch (error) {
    console.error('Erro ao listar eventos públicos:', error);
    return errorResponse(res, 'Erro ao buscar eventos públicos', 500);
  }
};

export const buscarEventoPublicoController = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await buscarEventoPublicoComFotos(id);
    
    if (!evento) {
      return errorResponse(res, 'Evento não encontrado', 404);
    }
    
    return successResponse(res, { evento });
  } catch (error) {
    console.error('Erro ao buscar evento público:', error);
    return errorResponse(res, 'Erro ao buscar evento', 500);
  }
};

// Endpoint público para listar fotos (sem autenticação)
export const listarFotosEventoPublicoController = async (req, res) => {
  try {
    const { id } = req.params;
    // Verificar se o evento é público antes de retornar as fotos
    const evento = await buscarEventoPorId(id);
    if (!evento || !evento.exibir_publico) {
      return errorResponse(res, 'Evento não encontrado ou não é público', 404);
    }
    const fotos = await listarFotosEvento(id);
    return successResponse(res, { fotos });
  } catch (error) {
    console.error('Erro ao listar fotos do evento público:', error);
    return errorResponse(res, 'Erro ao buscar fotos do evento', 500);
  }
};

// Endpoints para gerenciar fotos (com autenticação)
export const listarFotosEventoController = async (req, res) => {
  try {
    const { id } = req.params;
    const fotos = await listarFotosEvento(id);
    return successResponse(res, { fotos });
  } catch (error) {
    console.error('Erro ao listar fotos do evento:', error);
    return errorResponse(res, 'Erro ao buscar fotos do evento', 500);
  }
};

export const adicionarFotoEventoController = async (req, res) => {
  try {
    const { id } = req.params;
    const { foto_url, alt_text, ordem_exibicao } = req.body;
    
    if (!foto_url) {
      return errorResponse(res, 'URL da foto é obrigatória', 400);
    }
    
    const foto = await adicionarFotoEvento(id, {
      foto_url,
      alt_text: alt_text || '',
      ordem_exibicao: ordem_exibicao || 0
    });
    
    return successResponse(res, { foto }, 'Foto adicionada com sucesso', 201);
  } catch (error) {
    console.error('Erro ao adicionar foto:', error);
    return errorResponse(res, 'Erro ao adicionar foto', 500);
  }
};

export const removerFotoEventoController = async (req, res) => {
  try {
    const { id, fotoId } = req.params;
    const foto = await removerFotoEvento(fotoId);
    
    if (!foto) {
      return errorResponse(res, 'Foto não encontrada', 404);
    }
    
    return successResponse(res, {}, 'Foto removida com sucesso');
  } catch (error) {
    console.error('Erro ao remover foto:', error);
    return errorResponse(res, 'Erro ao remover foto', 500);
  }
};

