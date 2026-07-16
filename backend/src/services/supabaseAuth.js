import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

if (!supabase) {
  console.error(
    '⚠️  Supabase Auth não configurado. Defina SUPABASE_URL e SUPABASE_ANON_KEY (ou SUPABASE_SERVICE_ROLE_KEY).'
  );
}

/**
 * Valida um access token do Supabase e retorna o usuário correspondente.
 * Retorna null se o token for inválido/expirado ou se o Supabase não estiver configurado.
 */
export const getSupabaseUser = async (token) => {
  if (!supabase || !token) return null;

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return null;
    return data?.user || null;
  } catch (error) {
    console.error('Erro ao validar token do Supabase:', error.message);
    return null;
  }
};
