# ⚠️ IMPORTANTE: Executar Migrations do Banco de Dados

## Problemas Identificados
1. **Constraint do status:** A coluna `status` só aceita 'fixo' e 'espera'. Precisamos adicionar 'inadimplente'.
2. **Tamanho da coluna:** A coluna `status` foi criada com `VARCHAR(10)`, mas "inadimplente" tem 12 caracteres. Precisamos aumentar para `VARCHAR(20)`.

## ⚠️ ERRO ATUAL
Se você está vendo o erro: `value too long for type character varying(10)`, significa que precisa executar a migration para aumentar o tamanho da coluna.

## Solução
Execute a migration no seu banco de dados PostgreSQL:

### ✅ Opção 1: Via Supabase SQL Editor (MAIS FÁCIL)

**Execute AMBAS as migrations nesta ordem:**

#### Migration 1: Aumentar tamanho da coluna status
1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto `fundacaojpp`
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Cole e execute este SQL:

```sql
-- Alterar o tipo da coluna status de VARCHAR(10) para VARCHAR(20)
ALTER TABLE idosos 
ALTER COLUMN status TYPE VARCHAR(20);
```

6. Clique em **Run** ou pressione `Ctrl+Enter`
7. Você deve ver: "Success. No rows returned"

#### Migration 2: Adicionar constraint para 'inadimplente'
8. Ainda no SQL Editor, clique em **New Query** novamente
9. Cole e execute este SQL:

```sql
-- Remover o constraint antigo
ALTER TABLE idosos DROP CONSTRAINT IF EXISTS idosos_status_check;

-- Adicionar o novo constraint com os três status
ALTER TABLE idosos 
ADD CONSTRAINT idosos_status_check CHECK (status IN ('fixo', 'espera', 'inadimplente'));
```

10. Clique em **Run** ou pressione `Ctrl+Enter`
11. Você deve ver: "Success. No rows returned"

**OU** use os arquivos simplificados:
- `backend/migrations/fix_status_column_size_supabase.sql` (primeiro)
- `backend/migrations/add_inadimplente_status_supabase.sql` (depois)

### Opção 1: Via psql (Recomendado)
```bash
psql -h [HOST] -U [USUARIO] -d [DATABASE] -f backend/migrations/add_inadimplente_status.sql
```

### Opção 2: Via psql (linha de comando)
```bash
psql [DATABASE_URL] -f backend/migrations/add_inadimplente_status.sql
```

### Opção 3: Via cliente PostgreSQL (pgAdmin, DBeaver, etc)
1. Abra o arquivo `backend/migrations/add_inadimplente_status_supabase.sql`
2. Execute o conteúdo do arquivo no seu banco de dados

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

