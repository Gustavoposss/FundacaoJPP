import { errorResponse } from '../utils/responseHelper.js';
import {
  isValidEmail,
  isValidCPF,
  isValidPhone,
  isValidAge,
  validateRequired,
  sanitizeObject,
} from '../utils/validators.js';

/**
 * Middleware para validar dados de idoso
 */
export const validateIdoso = (req, res, next) => {
  const requiredFields = ['nome_completo', 'idade', 'sexo', 'cpf'];
  const missing = validateRequired(req.body, requiredFields);

  if (missing) {
    return errorResponse(
      res,
      `Campos obrigatórios faltando: ${missing.join(', ')}`,
      400
    );
  }

  // Sanitizar dados
  req.body = sanitizeObject(req.body);

  // Validar nome
  if (req.body.nome_completo.length < 3) {
    return errorResponse(res, 'Nome completo deve ter pelo menos 3 caracteres', 400);
  }

  // Validar idade
  if (!isValidAge(req.body.idade)) {
    return errorResponse(res, 'Idade inválida (deve ser entre 0 e 150)', 400);
  }

  // Validar sexo
  const validSexos = ['Masculino', 'Feminino', 'Outro'];
  if (!validSexos.includes(req.body.sexo)) {
    return errorResponse(res, 'Sexo inválido', 400);
  }

  // Validar CPF
  if (!isValidCPF(req.body.cpf)) {
    return errorResponse(res, 'CPF inválido (deve ter 11 dígitos)', 400);
  }

  // Validar telefone (se fornecido)
  if (req.body.telefone && !isValidPhone(req.body.telefone)) {
    return errorResponse(res, 'Telefone inválido', 400);
  }

  next();
};

/**
 * Middleware para validar dados de evento
 */
export const validateEvento = (req, res, next) => {
  const requiredFields = ['nome', 'data_evento', 'local'];
  const missing = validateRequired(req.body, requiredFields);

  if (missing) {
    return errorResponse(
      res,
      `Campos obrigatórios faltando: ${missing.join(', ')}`,
      400
    );
  }

  // Sanitizar dados
  req.body = sanitizeObject(req.body);

  // Validar nome
  if (req.body.nome.length < 3) {
    return errorResponse(res, 'Nome do evento deve ter pelo menos 3 caracteres', 400);
  }

  // Validar data
  const dataEvento = new Date(req.body.data_evento);
  if (isNaN(dataEvento.getTime())) {
    return errorResponse(res, 'Data do evento inválida', 400);
  }

  // Validar local
  if (req.body.local.length < 3) {
    return errorResponse(res, 'Local deve ter pelo menos 3 caracteres', 400);
  }

  next();
};

/**
 * Middleware para validar dados de login
 */
export const validateLogin = (req, res, next) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return errorResponse(res, 'E-mail e senha são obrigatórios', 400);
  }

  if (!isValidEmail(email)) {
    return errorResponse(res, 'E-mail inválido', 400);
  }

  if (senha.length < 6) {
    return errorResponse(res, 'Senha deve ter pelo menos 6 caracteres', 400);
  }

  next();
};

/**
 * Middleware para validar dados de registro
 */
export const validateRegistro = (req, res, next) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return errorResponse(res, 'Nome, e-mail e senha são obrigatórios', 400);
  }

  if (nome.length < 3) {
    return errorResponse(res, 'Nome deve ter pelo menos 3 caracteres', 400);
  }

  if (!isValidEmail(email)) {
    return errorResponse(res, 'E-mail inválido', 400);
  }

  if (senha.length < 6) {
    return errorResponse(res, 'Senha deve ter pelo menos 6 caracteres', 400);
  }

  next();
};

