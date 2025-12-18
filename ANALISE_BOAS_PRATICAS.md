# Análise de Boas Práticas e Dados Mockados

**Data:** Janeiro 2025  
**Objetivo:** Identificar dados mockados e avaliar boas práticas no código

---

## 📋 Dados Mockados Identificados

### 1. **Equipe (Sobre.jsx)**
**Localização:** `frontend/src/public-site/pages/Sobre.jsx` (linhas 188-230)

**Dados hardcoded:**
- Array de membros da equipe com:
  - Nome completo
  - Cargo/posição
  - Role/função
  - URL da imagem de perfil

**Impacto:**
- ❌ Qualquer mudança na equipe requer deploy
- ❌ Não há interface administrativa para gerenciar
- ❌ Dificulta escalabilidade
- ❌ Não há histórico de mudanças

---

### 2. **Patrocinadores (Sobre.jsx)**
**Localização:** `frontend/src/public-site/pages/Sobre.jsx` (linhas 17-27)

**Dados hardcoded:**
- Array de patrocinadores com:
  - Nome
  - Logo/imagem
  - Título/categoria

**Impacto:**
- ❌ Mesmos problemas da equipe
- ❌ Patrocinadores podem mudar frequentemente
- ❌ Não há controle de ordem/exibição

---

### 3. **Eventos Públicos (Projetos.jsx)**
**Localização:** `frontend/src/public-site/pages/Projetos.jsx` (linhas 8-70)

**Dados hardcoded:**
- Array completo de eventos com:
  - Nome, descrição, mês, ano
  - Vídeo do YouTube
  - Array de fotos (10 fotos hardcoded)
  - Cor do tema

**Impacto:**
- ⚠️ **CRÍTICO:** Já existe tabela `eventos` no banco, mas não está sendo usada
- ❌ Duplicação de dados (eventos no banco vs eventos mockados)
- ❌ Não há sincronização
- ❌ Galeria de fotos não está no banco

---

### 4. **Conteúdo Estático (Textos)**
**Localização:** Várias páginas

**Dados hardcoded:**
- Missão, Visão, Valores (Sobre.jsx)
- Textos da Home (Home.jsx)
- Descrições e textos informativos

**Impacto:**
- ⚠️ **MODERADO:** Textos institucionais mudam pouco
- ⚠️ Mas seria útil ter CMS básico para não precisar de deploy

---

## 🔍 Análise de Boas Práticas

### ✅ **Pontos Positivos**

1. **Separação de responsabilidades**
   - Backend e frontend bem separados
   - Modelos, controllers e rotas organizados

2. **Uso de variáveis de ambiente**
   - `.env` configurado corretamente
   - URLs do Supabase Storage em variáveis

3. **Tratamento de erros**
   - Try/catch implementados
   - Error handlers no backend

4. **Validação de dados**
   - Validators no frontend e backend
   - Validação de CPF, telefone, etc.

5. **Responsividade**
   - Tailwind CSS bem utilizado
   - Design mobile-first

---

### ⚠️ **Problemas Identificados**

#### 1. **Duplicação de Dados**
- **Problema:** Eventos existem no banco (`eventos` table) mas página pública usa array mockado
- **Risco:** Inconsistência entre sistema interno e site público
- **Solução:** Usar mesma fonte de dados

#### 2. **Falta de Modelo de Dados para Conteúdo Público**
- **Problema:** Não há tabelas para:
  - Equipe/membros
  - Patrocinadores
  - Galeria de fotos dos eventos
  - Conteúdo institucional (missão, visão, valores)

#### 3. **URLs Hardcoded do Supabase**
- **Problema:** URLs do Supabase Storage espalhadas pelo código
- **Solução:** Centralizar em arquivo de configuração ou variáveis de ambiente

#### 4. **Falta de Cache**
- **Problema:** Dados públicos são carregados toda vez
- **Solução:** Implementar cache no frontend (React Query) ou backend

#### 5. **Falta de Loading States**
- **Problema:** Algumas páginas não têm estados de carregamento
- **Solução:** Adicionar skeletons/loaders

#### 6. **Falta de Tratamento de Erros no Frontend**
- **Problema:** Alguns componentes não tratam erros de API
- **Solução:** Error boundaries e tratamento consistente

---

## 💡 Propostas de Solução

### **Opção 1: Migração Completa para Banco de Dados** ⭐ **RECOMENDADA**

#### **Vantagens:**
- ✅ Fonte única de verdade
- ✅ Interface administrativa para gerenciar conteúdo
- ✅ Histórico de mudanças
- ✅ Escalável
- ✅ Pode ter diferentes versões (rascunho/publicado)

#### **Desvantagens:**
- ⚠️ Requer mais desenvolvimento
- ⚠️ Precisa criar interfaces administrativas
- ⚠️ Mais complexo inicialmente

#### **Estrutura Proposta:**

```sql
-- Tabela de Membros da Equipe
CREATE TABLE membros_equipe (
  id SERIAL PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  foto_url TEXT,
  ordem_exibicao INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Patrocinadores
CREATE TABLE patrocinadores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  logo_url TEXT,
  titulo VARCHAR(100),
  link_website TEXT,
  ordem_exibicao INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Fotos dos Eventos (galeria)
CREATE TABLE evento_fotos (
  id SERIAL PRIMARY KEY,
  evento_id INTEGER REFERENCES eventos(id) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  ordem_exibicao INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Conteúdo Institucional
CREATE TABLE conteudo_institucional (
  id SERIAL PRIMARY KEY,
  chave VARCHAR(100) UNIQUE NOT NULL, -- 'missao', 'visao', 'valores', 'historia'
  titulo VARCHAR(255),
  conteudo TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar campos na tabela eventos existente
ALTER TABLE eventos 
ADD COLUMN video_url TEXT,
ADD COLUMN cor_tema VARCHAR(50),
ADD COLUMN exibir_publico BOOLEAN DEFAULT TRUE;
```

#### **Implementação:**
1. Criar modelos no backend (`membroEquipeModel.js`, `patrocinadorModel.js`, etc.)
2. Criar controllers e rotas
3. Criar interfaces administrativas no sistema interno
4. Atualizar páginas públicas para consumir API
5. Migrar dados mockados para banco

---

### **Opção 2: Híbrida (Banco + JSON Estático)**

#### **Vantagens:**
- ✅ Mais rápido de implementar
- ✅ Conteúdo que muda pouco pode ficar estático
- ✅ Conteúdo dinâmico no banco

#### **Desvantagens:**
- ⚠️ Ainda tem dados mockados
- ⚠️ Duas fontes de verdade

#### **Estrutura:**
- **Banco:** Equipe, Patrocinadores, Eventos (com fotos)
- **JSON/Estático:** Missão, Visão, Valores, Textos institucionais

---

### **Opção 3: Manter Estático (Não Recomendado)**

#### **Quando faz sentido:**
- ✅ Conteúdo muda muito raramente
- ✅ Equipe muito pequena
- ✅ Não há necessidade de interface administrativa

#### **Desvantagens:**
- ❌ Requer deploy para qualquer mudança
- ❌ Não escala bem
- ❌ Não há histórico

---

## 🎯 Recomendação Final

### **Migração Gradual:**

**Fase 1 (Prioritária):**
1. ✅ Migrar **Eventos** para usar tabela `eventos` existente
2. ✅ Criar tabela `evento_fotos` para galeria
3. ✅ Unificar fonte de dados (sistema interno = site público)

**Fase 2:**
1. ✅ Criar tabelas `membros_equipe` e `patrocinadores`
2. ✅ Criar interfaces administrativas básicas
3. ✅ Migrar dados mockados

**Fase 3 (Opcional):**
1. ✅ Criar CMS básico para conteúdo institucional
2. ✅ Implementar cache
3. ✅ Adicionar versionamento de conteúdo

---

## 📊 Comparação de Abordagens

| Aspecto | Estático | Híbrida | Banco Completo |
|---------|----------|---------|----------------|
| **Velocidade de Implementação** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Escalabilidade** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Manutenibilidade** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Flexibilidade** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Complexidade** | ⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## ❓ Perguntas para Decisão

1. **Com que frequência a equipe muda?**
   - Se raramente: pode manter estático por enquanto
   - Se frequentemente: precisa de banco

2. **Quantos patrocinadores espera ter?**
   - Poucos (< 5): pode manter estático
   - Muitos (> 10): precisa de banco

3. **Quem vai gerenciar o conteúdo?**
   - Desenvolvedor: pode manter estático
   - Não-desenvolvedor: precisa de interface administrativa

4. **Eventos públicos são os mesmos do sistema interno?**
   - Sim: **CRÍTICO** migrar para usar mesma tabela
   - Não: pode manter separado (mas não recomendado)

5. **Orçamento/tempo disponível?**
   - Pouco: Opção 2 (Híbrida)
   - Médio/Alto: Opção 1 (Banco Completo)

---

## 🚀 Próximos Passos Sugeridos

1. **Debater abordagem** com base nas perguntas acima
2. **Definir prioridades** (o que migrar primeiro)
3. **Criar plano de migração** detalhado
4. **Implementar gradualmente** para não quebrar o que funciona

---

**Observação:** A migração pode ser feita gradualmente, sem quebrar funcionalidades existentes. Podemos manter o código atual funcionando enquanto migramos para o banco.

