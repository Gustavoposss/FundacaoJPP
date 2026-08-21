import dotenv from 'dotenv';
import app from './app.js';
import { garantirNumeroSorteio } from './models/idosoModel.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await garantirNumeroSorteio();
    console.log('Números de sorteio dos idosos atualizados em ordem alfabética');
  } catch (error) {
    console.error('Não foi possível preparar numero_sorteio:', error.message);
  }
});

