import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/responseHelper.js';

export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse(res, 'Token não fornecido', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    return next();
  } catch (error) {
    return errorResponse(res, 'Token inválido ou expirado', 401);
  }
};

