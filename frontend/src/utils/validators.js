/**
 * Validações reutilizáveis para o frontend
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
 * Remove formatação do CPF, retornando apenas números
 */
export const cleanCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
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
 * Formata telefone ((XX) XXXXX-XXXX ou (XX) XXXX-XXXX)
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

/**
 * Valida idade (deve ser um número positivo entre 0 e 150)
 */
export const isValidAge = (age) => {
  const ageNum = Number(age);
  return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 150;
};

