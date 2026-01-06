# ⚠️ IMPORTANTE: Executar Migration do Banco de Dados

## Problema
O erro 500 ao atualizar idosos ocorre porque o banco de dados ainda não foi atualizado com a migration que permite o status 'inadimplente'.

## Solução
Execute a migration no seu banco de dados PostgreSQL:

### Opção 1: Via psql (Recomendado)
```bash
psql -h [HOST] -U [USUARIO] -d [DATABASE] -f backend/migrations/add_inadimplente_status.sql
```

### Opção 2: Via cliente PostgreSQL (pgAdmin, DBeaver, etc)
1. Abra o arquivo `backend/migrations/add_inadimplente_status.sql`
2. Execute o conteúdo do arquivo no seu banco de dados

### Opção 3: Via Render.com (se estiver usando)
1. Acesse o dashboard do Render
2. Vá até o banco de dados PostgreSQL
3. Use o "Connect" ou "Query" para executar o SQL

## Conteúdo da Migration
```sql
-- Remover o constraint antigo
ALTER TABLE idosos DROP CONSTRAINT IF EXISTS idosos_status_check;

-- Adicionar o novo constraint com os três status
ALTER TABLE idosos 
ADD CONSTRAINT idosos_status_check CHECK (status IN ('fixo', 'espera', 'inadimplente'));

-- Atualizar comentário na coluna
COMMENT ON COLUMN idosos.status IS 'Status do idoso: fixo (recebe benefício), espera (não recebe benefício) ou inadimplente (em atraso com pagamentos)';
```

## Verificação
Após executar, verifique se funcionou:
```sql
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'idosos_status_check';
```

Deve mostrar: `status IN ('fixo', 'espera', 'inadimplente')`

