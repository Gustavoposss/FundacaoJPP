import { errorResponse } from '../utils/responseHelper.js';
import { getSupabaseUser } from '../services/supabaseAuth.js';

export const authRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse(res, 'Token não fornecido', 401);
  }

  const token = authHeader.split(' ')[1];

  const user = await getSupabaseUser(token);

  if (!user) {
    return errorResponse(res, 'Token inválido ou expirado', 401);
  }

  req.usuario = {
    id: user.id,
    email: user.email,
    ...user.user_metadata,
  };

  return next();
};
