import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';

const generateToken = (user) => {
  const payload = { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return errorResponse(res, 'E-mail e senha são obrigatórios', 400);
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return errorResponse(res, 'Credenciais inválidas', 401);
    }

    const passwordMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!passwordMatch) {
      return errorResponse(res, 'Credenciais inválidas', 401);
    }

    const token = generateToken(user);

    return successResponse(res, {
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    }, 'Login realizado com sucesso');
  } catch (error) {
    console.error('Erro no login:', error);
    return errorResponse(res, 'Erro ao realizar login', 500);
  }
};

export const registrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
      return errorResponse(res, 'Nome, e-mail e senha são obrigatórios', 400);
    }

    const usuarioExistente = await findUserByEmail(email);
    if (usuarioExistente) {
      return errorResponse(res, 'E-mail já cadastrado', 400);
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await createUser({ nome, email, senhaHash, tipo });

    return successResponse(res, {
      usuario: novoUsuario,
    }, 'Usuário criado com sucesso');
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return errorResponse(res, 'Erro ao registrar usuário', 500);
  }
};

