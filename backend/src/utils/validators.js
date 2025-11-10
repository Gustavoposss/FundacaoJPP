/**
 * Validações reutilizáveis para o backend
 */

/**
 * Valida formato de email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida CPF (formato básico - 11 dígitos)
 */
export const isValidCPF = (cpf) => {
  if (!cpf) return false;
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  return true;
};

/**
 * Valida telefone (formato básico - mínimo 10 dígitos)
 */
export const isValidPhone = (phone) => {
  if (!phone) return true; // Telefone é opcional
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Valida idade (deve ser um número positivo entre 0 e 150)
 */
export const isValidAge = (age) => {
  const ageNum = Number(age);
  return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 150;
};

/**
 * Valida campos obrigatórios
 */
export const validateRequired = (data, requiredFields) => {
  const missing = [];
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field);
    }
  }
  return missing.length === 0 ? null : missing;
};

/**
 * Sanitiza string (remove espaços extras)
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim();
};

/**
 * Sanitiza objeto (remove espaços extras de strings)
 */
export const sanitizeObject = (obj) => {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]);
    }
  }
  return sanitized;
};

