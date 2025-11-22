import dotenv from 'dotenv';
import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase') 
    ? { rejectUnauthorized: false }
    : false,
});

async function runMigration() {
  try {
    console.log('🔄 Iniciando processo de migração...');
    console.log('📁 Diretório atual:', __dirname);
    
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    const migrationPath = path.join(__dirname, '../migrations/add_status_to_idosos.sql');
    console.log('📄 Caminho da migração:', migrationPath);
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Arquivo de migração não encontrado:', migrationPath);
      await client.end();
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('📝 SQL carregado, tamanho:', sql.length, 'caracteres');

    console.log('🔄 Executando migração...');
    await client.query(sql);
    console.log('✅ Migração executada com sucesso!');

    await client.end();
    console.log('✅ Conexão encerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error.message);
    console.error('📋 Detalhes:', error);
    
    // Se a coluna já existe, não é um erro crítico
    if (error.message.includes('duplicate column') || 
        error.message.includes('already exists') ||
        error.message.includes('column "status" of relation "idosos" already exists')) {
      console.log('⚠️  Coluna já existe. Migração pode ter sido executada anteriormente.');
      await client.end();
      process.exit(0);
    }
    
    await client.end();
    process.exit(1);
  }
}

runMigration();

