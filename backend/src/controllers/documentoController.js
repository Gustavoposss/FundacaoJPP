import fs from 'fs';
import path from 'path';
import {
  listarDocumentosPorIdoso,
  criarDocumento,
  deletarDocumento,
} from '../models/documentoModel.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';

const getFileUrl = (filename) => `/uploads/${filename}`;

export const obterDocumentosPorIdoso = async (req, res) => {
  try {
    const { idosoId } = req.params;
    const documentos = await listarDocumentosPorIdoso(idosoId);
    return successResponse(res, { documentos });
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    return errorResponse(res, 'Erro ao listar documentos', 500);
  }
};

export const uploadDocumento = async (req, res) => {
  try {
    const { idosoId } = req.params;

    if (!req.file) {
      return errorResponse(res, 'Arquivo não enviado', 400);
    }

    const novoDocumento = await criarDocumento({
      idIdoso: idosoId,
      nomeArquivo: req.file.filename,
      urlArquivo: getFileUrl(req.file.filename),
    });

    return successResponse(res, { documento: novoDocumento }, 'Documento enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar documento:', error);
    return errorResponse(res, 'Erro ao enviar documento', 500);
  }
};

export const removerDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const documento = await deletarDocumento(id);

    if (!documento) {
      return errorResponse(res, 'Documento não encontrado', 404);
    }

    const filepath = path.resolve(`src/uploads/${documento.nome_arquivo}`);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return successResponse(res, {}, 'Documento removido com sucesso');
  } catch (error) {
    console.error('Erro ao remover documento:', error);
    return errorResponse(res, 'Erro ao remover documento', 500);
  }
};

