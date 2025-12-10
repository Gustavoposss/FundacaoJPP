import https from 'https';

/**
 * Envia email via Brevo (API v3).
 * Requer as variáveis de ambiente:
 * - BREVO_API_KEY
 * - BREVO_SENDER_EMAIL
 * - BREVO_SENDER_NAME (opcional)
 */
export const sendBrevoEmail = async ({ to, subject, htmlContent, replyTo }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'Fundação José Possidônio Peixoto';

  if (!apiKey || !senderEmail) {
    throw new Error('Configuração do Brevo ausente: defina BREVO_API_KEY e BREVO_SENDER_EMAIL');
  }

  const payload = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  if (replyTo) {
    payload.replyTo = { email: replyTo };
  }

  const data = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            const details = body || `status ${res.statusCode}`;
            reject(new Error(`Brevo retorno inesperado: ${details}`));
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
};

