import { getPublicUrl } from '../services/storage.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';

/**
 * Obtém URLs públicas das imagens de perfil
 */
export const getPerfilImages = async (req, res) => {
  try {
    const images = {
      possidonio: getPublicUrl('perfis', 'possidonioperfil.jpg'),
      lucilene: getPublicUrl('perfis', 'lucileneperfil.jpg'),
      gustavo: getPublicUrl('perfis', 'gustavoperfil.jpg'),
    };

    return successResponse(res, { images });
  } catch (error) {
    console.error('Erro ao obter URLs das imagens:', error);
    return errorResponse(res, 'Erro ao obter URLs das imagens', 500);
  }
};

/**
 * Obtém URL pública de uma imagem específica
 */
export const getImageUrl = async (req, res) => {
  try {
    const { bucket, fileName } = req.params;
    
    if (!bucket || !fileName) {
      return errorResponse(res, 'Bucket e fileName são obrigatórios', 400);
    }

    const url = getPublicUrl(bucket, fileName);
    
    if (!url) {
      return errorResponse(res, 'Imagem não encontrada', 404);
    }

    return successResponse(res, { url });
  } catch (error) {
    console.error('Erro ao obter URL da imagem:', error);
    return errorResponse(res, 'Erro ao obter URL da imagem', 500);
  }
};

