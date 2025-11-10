import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

// Configuração SSL para Supabase
// O Supabase requer SSL, mas podemos usar rejectUnauthorized: false em desenvolvimento
const sslConfig = process.env.DATABASE_URL?.includes('supabase') 
  ? { rejectUnauthorized: false }
  : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: 10, // Aumentar o pool para evitar problemas de conexão
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // Permitir múltiplas conexões para o pooler do Supabase
  allowExitOnIdle: false,
});

// Melhorar tratamento de erros - não encerrar o processo imediatamente
pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões:', err.message);
  // Não encerrar o processo, apenas logar o erro
  // O pool tentará reconectar automaticamente
});

// Testar conexão ao iniciar
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Conexão com banco de dados estabelecida com sucesso');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar com banco de dados:', err.message);
    console.error('Verifique se a DATABASE_URL está correta no arquivo .env');
  });

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool, // Exportar pool para uso direto se necessário
};
