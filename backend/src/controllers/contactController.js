import { sendBrevoEmail } from '../services/emailService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

const TARGET_EMAIL = 'fundacaojosepossidoniopeixoto@gmail.com';

export const sendContactMessage = async (req, res) => {
  const { nome, email, assunto, mensagem } = req.body || {};

  if (!nome || !email || !assunto || !mensagem) {
    return errorResponse(res, 'Preencha todos os campos obrigatórios.', 400);
  }

  const htmlContent = `
    <h2>Nova mensagem do site</h2>
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Assunto:</strong> ${assunto}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${mensagem.replace(/\n/g, '<br/>')}</p>
  `;

  try {
    await sendBrevoEmail({
      to: TARGET_EMAIL,
      subject: `Contato pelo site: ${assunto}`,
      htmlContent,
      replyTo: email,
    });

    return successResponse(res, {}, 'Mensagem enviada com sucesso.');
  } catch (error) {
    console.error('Erro ao enviar e-mail de contato:', error);
    return errorResponse(res, 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.', 500);
  }
};

