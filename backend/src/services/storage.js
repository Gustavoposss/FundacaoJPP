import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Inicializar cliente do Supabase Storage
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase Storage não configurado. Configure SUPABASE_URL e SUPABASE_ANON_KEY no .env');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Obtém a URL pública de uma imagem do Supabase Storage
 * @param {string} bucketName - Nome do bucket (ex: 'perfis', 'projetos')
 * @param {string} fileName - Nome do arquivo
 * @returns {string} URL pública da imagem
 */
export const getPublicUrl = (bucketName, fileName) => {
  if (!supabase) {
    console.error('Supabase Storage não configurado');
    return null;
  }
  
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
  
  return data?.publicUrl || null;
};

/**
 * Faz upload de uma imagem para o Supabase Storage
 * @param {string} bucketName - Nome do bucket
 * @param {string} fileName - Nome do arquivo
 * @param {Buffer} fileBuffer - Buffer do arquivo
 * @param {string} contentType - Tipo de conteúdo (ex: 'image/jpeg', 'image/png')
 * @returns {Promise<{success: boolean, url: string|null, error: string|null}>}
 */
export const uploadImage = async (bucketName, fileName, fileBuffer, contentType = 'image/jpeg') => {
  if (!supabase) {
    return {
      success: false,
      url: null,
      error: 'Supabase Storage não configurado'
    };
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true, // Substitui arquivo se já existir
      });

    if (error) {
      console.error('Erro ao fazer upload:', error);
      return {
        success: false,
        url: null,
        error: error.message
      };
    }

    const publicUrl = getPublicUrl(bucketName, fileName);
    
    return {
      success: true,
      url: publicUrl,
      error: null
    };
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return {
      success: false,
      url: null,
      error: error.message
    };
  }
};

/**
 * Remove uma imagem do Supabase Storage
 * @param {string} bucketName - Nome do bucket
 * @param {string} fileName - Nome do arquivo
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const deleteImage = async (bucketName, fileName) => {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase Storage não configurado'
    };
  }

  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.error('Erro ao remover imagem:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default supabase;

