import { errorResponse } from '../utils/responseHelper.js';
import {
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
  const requiredFields = [
    'nome_completo', 'data_nascimento', 'sexo', 'naturalidade', 'telefone',
    'endereco', 'numero', 'bairro', 'cidade', 'cep',
    'cpf', 'rg', 'orgao_expedidor', 'titulo_eleitoral', 'zona_eleitoral', 'secao_eleitoral', 'municipio_uf',
    'data_inscricao'
  ];

  if (req.method === 'PUT' || req.method === 'PATCH') {
    requiredFields.push('status');
  }
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

  if (req.body.status === 'espera') {
    req.body.status = 'fixo';
  }

  // Validar nome
  if (req.body.nome_completo.length < 3) {
    return errorResponse(res, 'Nome completo deve ter pelo menos 3 caracteres', 400);
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

  // Validar status (se fornecido)
  if (req.body.status && !['fixo', 'inadimplente'].includes(req.body.status)) {
    return errorResponse(res, 'Status inválido (deve ser "fixo" ou "inadimplente")', 400);
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

