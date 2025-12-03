import api from './api';

/**
 * Obtém URLs das imagens de perfil do Supabase Storage
 */
export const getPerfilImages = async () => {
  try {
    const { data } = await api.get('/storage/perfis');
    return data.data?.images || {};
  } catch (error) {
    console.error('Erro ao obter URLs das imagens de perfil:', error);
    // Retorna URLs padrão caso a API falhe
    return {
      possidonio: '/possidonioperfil.svg',
      lucilene: '/lucileneperfil.svg',
      gustavo: '/gustavoperfil.svg',
    };
  }
};

/**
 * Obtém URL de uma imagem específica do Supabase Storage
 * @param {string} bucket - Nome do bucket (ex: 'perfis', 'projetos', 'backgrounds')
 * @param {string} fileName - Nome do arquivo
 * @returns {Promise<string>} URL da imagem
 */
export const getImageUrl = async (bucket, fileName) => {
  try {
    const { data } = await api.get(`/storage/${bucket}/${fileName}`);
    return data.data?.url || null;
  } catch (error) {
    console.error(`Erro ao obter URL da imagem ${bucket}/${fileName}:`, error);
    return null;
  }
};

