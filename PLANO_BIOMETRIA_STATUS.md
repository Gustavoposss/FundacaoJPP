# Plano de Implementação: Biometria e Status de Idosos

## 📋 Resumo das Funcionalidades

### 1. Sistema de Status (Fixo/Espera)
- Adicionar campo `status` na tabela `idosos` (valores: 'fixo' ou 'espera')
- Atualizar interface para permitir alteração de status
- Filtrar idosos por status nas listagens
- Considerar status nos relatórios

### 2. Integração com Leitor Biométrico Nitgen HFDU06
- Cadastro de biometria dos idosos
- Confirmação de presença via leitura biométrica
- Armazenamento seguro das digitais

---

## 🗄️ PARTE 1: Implementação do Campo Status

### Passo 1.1: Atualizar Banco de Dados

**No Supabase (SQL Editor), execute:**

```sql
-- Adicionar coluna status na tabela idosos
ALTER TABLE idosos 
ADD COLUMN status VARCHAR(10) DEFAULT 'fixo' CHECK (status IN ('fixo', 'espera'));

-- Atualizar idosos existentes para 'fixo' (padrão)
UPDATE idosos SET status = 'fixo' WHERE status IS NULL;

-- Criar índice para melhor performance em filtros
CREATE INDEX idx_idosos_status ON idosos(status);
```

### Passo 1.2: Atualizar Modelo Backend

**Arquivo:** `backend/src/models/idosoModel.js`

**Alterações necessárias:**
- Adicionar `status` nas queries SELECT
- Adicionar `status` no INSERT
- Adicionar `status` no UPDATE
- Adicionar filtro por status na listagem

### Passo 1.3: Atualizar Controller Backend

**Arquivo:** `backend/src/controllers/idosoController.js`

**Alterações necessárias:**
- Aceitar `status` no body das requisições POST/PUT
- Validar que status seja 'fixo' ou 'espera'

### Passo 1.4: Atualizar Frontend - Formulário

**Arquivo:** `frontend/src/components/IdosoForm.jsx`

**Alterações necessárias:**
- Adicionar campo select para status (Fixo/Espera)
- Incluir no formulário de cadastro/edição

### Passo 1.5: Atualizar Frontend - Listagem

**Arquivo:** `frontend/src/pages/Idosos.jsx`

**Alterações necessárias:**
- Adicionar filtro por status
- Mostrar badge/indicador visual do status
- Permitir alteração rápida de status

### Passo 1.6: Atualizar Relatórios

**Arquivos:** 
- `backend/src/models/relatorioModel.js`
- `frontend/src/pages/Relatorios.jsx`

**Alterações necessárias:**
- Adicionar filtro por status nos relatórios
- Incluir status nas exportações (CSV/PDF)

---

## 🔐 PARTE 2: Integração com Leitor Biométrico

### ⚠️ Considerações Importantes

O leitor biométrico **Nitgen HFDU06** geralmente requer:
1. **SDK proprietário** (geralmente em C/C++ ou .NET)
2. **Driver instalado** no computador
3. **Comunicação via USB** (não diretamente via browser)

### Opções de Implementação

#### **Opção A: Servidor Intermediário (Recomendado)**
- Criar serviço Node.js que se comunica com o SDK do dispositivo
- Frontend faz requisições HTTP para o backend
- Backend se comunica com o dispositivo via SDK

#### **Opção B: WebUSB API (Limitado)**
- Usar WebUSB API do navegador
- Requer que o dispositivo suporte protocolo USB genérico
- Nem todos os leitores biométricos são compatíveis

#### **Opção C: Aplicação Desktop (Electron)**
- Criar aplicação desktop que acessa o SDK
- Mais controle sobre o hardware
- Requer instalação no computador

### Passo 2.1: Pesquisar SDK/Driver do Nitgen HFDU06

**Ações necessárias:**
1. Verificar se o dispositivo veio com SDK/Driver
2. Consultar documentação do fabricante
3. Verificar se há biblioteca Node.js disponível
4. Testar comunicação básica com o dispositivo

**Links úteis:**
- Documentação do fabricante Nitgen
- Fórum de desenvolvedores
- GitHub (buscar por "nitgen" ou "hfdu06")

### Passo 2.2: Estrutura do Banco de Dados para Biometria

**No Supabase (SQL Editor), execute:**

```sql
-- Criar tabela para armazenar biometrias
CREATE TABLE IF NOT EXISTS biometrias (
  id SERIAL PRIMARY KEY,
  id_idoso INTEGER NOT NULL REFERENCES idosos(id) ON DELETE CASCADE,
  template_biometrico BYTEA NOT NULL, -- Template da digital (binário)
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,
  UNIQUE(id_idoso, ativo) -- Um idoso pode ter apenas uma biometria ativa
);

-- Criar índice para busca rápida
CREATE INDEX idx_biometrias_idoso ON biometrias(id_idoso);
CREATE INDEX idx_biometrias_ativo ON biometrias(ativo) WHERE ativo = TRUE;
```

### Passo 2.3: Criar Modelo de Biometria (Backend)

**Arquivo:** `backend/src/models/biometriaModel.js` (NOVO)

**Funcionalidades:**
- `cadastrarBiometria(idIdoso, template)`
- `buscarBiometriaPorIdoso(idIdoso)`
- `verificarBiometria(template)` - Comparar template com banco
- `desativarBiometria(idIdoso)`

### Passo 2.4: Criar Controller de Biometria (Backend)

**Arquivo:** `backend/src/controllers/biometriaController.js` (NOVO)

**Endpoints:**
- `POST /api/biometrias` - Cadastrar biometria
- `GET /api/biometrias/:idIdoso` - Buscar biometria do idoso
- `POST /api/biometrias/verificar` - Verificar biometria (para presença)
- `DELETE /api/biometrias/:idIdoso` - Remover biometria

### Passo 2.5: Integrar SDK do Leitor (Backend)

**Arquivo:** `backend/src/services/biometricReader.js` (NOVO)

**Funcionalidades:**
- Inicializar conexão com o dispositivo
- Capturar digital
- Converter digital em template
- Comparar templates

**Nota:** Este arquivo dependerá do SDK específico do Nitgen HFDU06.

### Passo 2.6: Atualizar Sistema de Presença

**Arquivo:** `frontend/src/pages/Presencas.jsx`

**Alterações:**
- Adicionar botão "Confirmar por Biometria"
- Ao clicar, iniciar captura da digital
- Verificar no backend e marcar presença automaticamente

**Arquivo:** `backend/src/controllers/presencaController.js`

**Alterações:**
- Adicionar endpoint para confirmar presença via biometria
- `POST /api/presencas/:eventoId/biometria`

### Passo 2.7: Interface de Cadastro de Biometria

**Arquivo:** `frontend/src/pages/IdosoDetalhes.jsx`

**Alterações:**
- Adicionar aba "Biometria"
- Botão "Cadastrar Biometria"
- Mostrar status da biometria (cadastrada/não cadastrada)
- Botão para remover biometria

---

## 📝 Checklist de Implementação

### Status (Fixo/Espera)
- [ ] Atualizar banco de dados (adicionar coluna status)
- [ ] Atualizar modelo backend (idosoModel.js)
- [ ] Atualizar controller backend (idosoController.js)
- [ ] Atualizar formulário frontend (IdosoForm.jsx)
- [ ] Atualizar listagem frontend (Idosos.jsx)
- [ ] Adicionar filtros por status
- [ ] Atualizar relatórios
- [ ] Testar alteração de status
- [ ] Testar filtros

### Biometria
- [ ] Pesquisar SDK/Driver do Nitgen HFDU06
- [ ] Criar tabela biometrias no banco
- [ ] Criar modelo biometriaModel.js
- [ ] Criar controller biometriaController.js
- [ ] Criar serviço biometricReader.js (integração SDK)
- [ ] Criar rotas de biometria
- [ ] Interface de cadastro de biometria
- [ ] Integrar biometria no sistema de presença
- [ ] Testar captura de digital
- [ ] Testar verificação de digital
- [ ] Testar confirmação de presença via biometria

---

## 🔍 Próximos Passos Imediatos

### 1. Implementar Status (Mais Simples)
Começar pela implementação do campo status, pois não depende de hardware externo.

### 2. Pesquisar SDK do Nitgen
Antes de implementar biometria, é essencial:
- Verificar se o dispositivo veio com SDK
- Testar comunicação básica
- Documentar API disponível

### 3. Protótipo de Biometria
Criar um protótipo simples para testar:
- Captura de digital
- Armazenamento do template
- Verificação básica

---

## ⚠️ Observações Importantes

### Segurança
- Templates biométricos são dados sensíveis
- Considerar criptografia dos templates
- Implementar logs de acesso
- Validar permissões (apenas usuários autorizados)

### Performance
- Comparação de templates pode ser custosa
- Considerar cache para templates ativos
- Otimizar queries de verificação

### UX
- Feedback visual durante captura
- Mensagens claras de erro
- Instruções para o usuário
- Indicador de qualidade da captura

---

## 📚 Recursos Úteis

- [WebUSB API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API)
- [Node.js USB Libraries](https://www.npmjs.com/package/usb)
- [Biometric Template Storage Best Practices](https://www.nist.gov/publications/biometric-template-security)

---

**Próxima ação sugerida:** Começar pela implementação do campo STATUS, que é mais direto e não depende de hardware externo.

