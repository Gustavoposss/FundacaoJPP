# 🎯 Plano de Ação - Migração de Dados Mockados para Banco

**Data:** Janeiro 2025  
**Objetivo:** Migrar dados hardcoded para banco de dados de forma gradual e segura

---

## 📊 Priorização

### 🔴 **CRÍTICO - Fase 1: Eventos Públicos**
**Problema:** Eventos existem no banco mas página pública usa array mockado  
**Impacto:** Inconsistência entre sistema interno e site público  
**Tempo estimado:** 2-3 horas

### 🟡 **IMPORTANTE - Fase 2: Equipe e Patrocinadores**
**Problema:** Dados hardcoded que mudam com frequência  
**Impacto:** Requer deploy para qualquer mudança  
**Tempo estimado:** 3-4 horas

### 🟢 **OPCIONAL - Fase 3: Conteúdo Institucional**
**Problema:** Textos estáticos (missão, visão, valores)  
**Impacto:** Baixo (mudam raramente)  
**Tempo estimado:** 2 horas

---

## 🚀 FASE 1: Eventos Públicos (CRÍTICO)

### **Passo 1.1: Atualizar Schema do Banco**

**Arquivo:** `backend/migrations/003_add_eventos_publicos_fields.sql` (CRIAR)

```sql
-- Adicionar campos na tabela eventos para suporte a conteúdo público
ALTER TABLE eventos 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS cor_tema VARCHAR(50) DEFAULT 'blue',
ADD COLUMN IF NOT EXISTS exibir_publico BOOLEAN DEFAULT TRUE;

-- Criar tabela de fotos dos eventos
CREATE TABLE IF NOT EXISTS evento_fotos (
  id SERIAL PRIMARY KEY,
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  ordem_exibicao INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_evento_fotos_evento_id ON evento_fotos(evento_id);
CREATE INDEX IF NOT EXISTS idx_eventos_exibir_publico ON eventos(exibir_publico) WHERE exibir_publico = TRUE;

-- Comentários para documentação
COMMENT ON COLUMN eventos.video_url IS 'URL do vídeo do YouTube do evento';
COMMENT ON COLUMN eventos.cor_tema IS 'Cor do tema do evento (blue, green, red, etc.)';
COMMENT ON COLUMN eventos.exibir_publico IS 'Se o evento deve ser exibido na página pública';
```

**Ação:** Executar este SQL no Supabase SQL Editor

---

### **Passo 1.2: Atualizar Modelo de Eventos**

**Arquivo:** `backend/src/models/eventoModel.js`

**Alterações:**
1. Atualizar `listarEventos` para incluir novos campos
2. Criar função `listarEventosPublicos` (apenas eventos com `exibir_publico = TRUE`)
3. Criar funções para gerenciar fotos:
   - `listarFotosEvento(eventoId)`
   - `adicionarFotoEvento(eventoId, fotoUrl, altText, ordem)`
   - `removerFotoEvento(fotoId)`
   - `atualizarOrdemFotos(fotos)`

**Código a adicionar:**

```javascript
// Listar eventos públicos (para página pública)
export const listarEventosPublicos = async () => {
  const query = `
    SELECT 
      id, 
      nome, 
      data_evento, 
      local, 
      descricao,
      video_url,
      cor_tema,
      exibir_publico
    FROM eventos
    WHERE exibir_publico = TRUE
    ORDER BY data_evento DESC
  `;
  const { rows } = await db.query(query);
  return rows;
};

// Buscar evento público com fotos
export const buscarEventoPublicoComFotos = async (id) => {
  const eventoQuery = `
    SELECT 
      id, 
      nome, 
      data_evento, 
      local, 
      descricao,
      video_url,
      cor_tema
    FROM eventos
    WHERE id = $1 AND exibir_publico = TRUE
  `;
  
  const fotosQuery = `
    SELECT id, foto_url, alt_text, ordem_exibicao
    FROM evento_fotos
    WHERE evento_id = $1
    ORDER BY ordem_exibicao ASC, id ASC
  `;
  
  const [eventoResult, fotosResult] = await Promise.all([
    db.query(eventoQuery, [id]),
    db.query(fotosQuery, [id])
  ]);
  
  if (eventoResult.rows.length === 0) {
    return null;
  }
  
  return {
    ...eventoResult.rows[0],
    fotos: fotosResult.rows
  };
};

// Funções para gerenciar fotos
export const listarFotosEvento = async (eventoId) => {
  const query = `
    SELECT id, foto_url, alt_text, ordem_exibicao
    FROM evento_fotos
    WHERE evento_id = $1
    ORDER BY ordem_exibicao ASC, id ASC
  `;
  const { rows } = await db.query(query, [eventoId]);
  return rows;
};

export const adicionarFotoEvento = async (eventoId, { foto_url, alt_text, ordem_exibicao = 0 }) => {
  const query = `
    INSERT INTO evento_fotos (evento_id, foto_url, alt_text, ordem_exibicao)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await db.query(query, [eventoId, foto_url, alt_text, ordem_exibicao]);
  return rows[0];
};

export const removerFotoEvento = async (fotoId) => {
  const query = 'DELETE FROM evento_fotos WHERE id = $1 RETURNING *';
  const { rows } = await db.query(query, [fotoId]);
  return rows[0];
};
```

**Ação:** Adicionar essas funções ao arquivo `eventoModel.js`

---

### **Passo 1.3: Atualizar Controller de Eventos**

**Arquivo:** `backend/src/controllers/eventoController.js`

**Alterações:**
1. Atualizar `criarEvento` e `atualizarEvento` para aceitar novos campos
2. Criar endpoints públicos:
   - `GET /api/public/eventos` - Listar eventos públicos
   - `GET /api/public/eventos/:id` - Buscar evento público com fotos
3. Criar endpoints para fotos (protegidos):
   - `GET /api/eventos/:id/fotos` - Listar fotos
   - `POST /api/eventos/:id/fotos` - Adicionar foto
   - `DELETE /api/eventos/:id/fotos/:fotoId` - Remover foto

**Código a adicionar:**

```javascript
// Listar eventos públicos (sem autenticação)
export const listarEventosPublicos = async (req, res) => {
  try {
    const eventos = await eventoModel.listarEventosPublicos();
    return successResponse(res, { eventos }, 200);
  } catch (error) {
    return errorResponse(res, 'Erro ao buscar eventos públicos.', 500);
  }
};

// Buscar evento público com fotos
export const buscarEventoPublico = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await eventoModel.buscarEventoPublicoComFotos(id);
    
    if (!evento) {
      return errorResponse(res, 'Evento não encontrado.', 404);
    }
    
    return successResponse(res, { evento }, 200);
  } catch (error) {
    return errorResponse(res, 'Erro ao buscar evento.', 500);
  }
};

// Listar fotos de um evento
export const listarFotosEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const fotos = await eventoModel.listarFotosEvento(id);
    return successResponse(res, { fotos }, 200);
  } catch (error) {
    return errorResponse(res, 'Erro ao buscar fotos do evento.', 500);
  }
};

// Adicionar foto a um evento
export const adicionarFotoEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { foto_url, alt_text, ordem_exibicao } = req.body;
    
    if (!foto_url) {
      return errorResponse(res, 'URL da foto é obrigatória.', 400);
    }
    
    const foto = await eventoModel.adicionarFotoEvento(id, {
      foto_url,
      alt_text: alt_text || '',
      ordem_exibicao: ordem_exibicao || 0
    });
    
    return successResponse(res, { foto }, 201);
  } catch (error) {
    return errorResponse(res, 'Erro ao adicionar foto.', 500);
  }
};

// Remover foto de um evento
export const removerFotoEvento = async (req, res) => {
  try {
    const { id, fotoId } = req.params;
    const foto = await eventoModel.removerFotoEvento(fotoId);
    
    if (!foto) {
      return errorResponse(res, 'Foto não encontrada.', 404);
    }
    
    return successResponse(res, { message: 'Foto removida com sucesso.' }, 200);
  } catch (error) {
    return errorResponse(res, 'Erro ao remover foto.', 500);
  }
};
```

**Ação:** Adicionar essas funções ao controller

---

### **Passo 1.4: Criar Rotas Públicas**

**Arquivo:** `backend/src/routes/eventoRoutes.js`

**Alterações:**
1. Adicionar rotas públicas (sem autenticação)
2. Adicionar rotas para fotos (com autenticação)

**Código a adicionar:**

```javascript
import express from 'express';
import * as eventoController from '../controllers/eventoController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas públicas (sem autenticação)
router.get('/public', eventoController.listarEventosPublicos);
router.get('/public/:id', eventoController.buscarEventoPublico);

// Rotas protegidas (com autenticação)
router.get('/', authenticate, eventoController.listarEventos);
router.get('/:id', authenticate, eventoController.buscarEvento);
router.post('/', authenticate, eventoController.criarEvento);
router.put('/:id', authenticate, eventoController.atualizarEvento);
router.delete('/:id', authenticate, eventoController.deletarEvento);

// Rotas para fotos (protegidas)
router.get('/:id/fotos', authenticate, eventoController.listarFotosEvento);
router.post('/:id/fotos', authenticate, eventoController.adicionarFotoEvento);
router.delete('/:id/fotos/:fotoId', authenticate, eventoController.removerFotoEvento);

export default router;
```

**Ação:** Atualizar rotas existentes

---

### **Passo 1.5: Atualizar Frontend - Página Projetos**

**Arquivo:** `frontend/src/public-site/pages/Projetos.jsx`

**Alterações:**
1. Remover array mockado de eventos
2. Criar hook/service para buscar eventos públicos
3. Atualizar componente para usar dados da API
4. Adicionar loading state
5. Adicionar tratamento de erros

**Código:**

```javascript
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PublicLayout } from '../../components/public/PublicLayout';
import { api } from '../../services/api';

export const Projetos = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/eventos/public');
        setEventos(data.data?.eventos || []);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        toast.error('Não foi possível carregar os eventos.');
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    carregarEventos();
  }, []);

  // Formatar data para exibir mês/ano
  const formatarDataEvento = (dataEvento) => {
    if (!dataEvento) return { mes: '', ano: '' };
    const date = new Date(dataEvento);
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return {
      mes: meses[date.getMonth()],
      ano: date.getFullYear().toString()
    };
  };

  // Buscar evento completo com fotos quando abrir modal
  const openModal = async (evento) => {
    try {
      const { data } = await api.get(`/eventos/public/${evento.id}`);
      setSelectedEvent(data.data?.evento || evento);
    } catch (error) {
      console.error('Erro ao carregar detalhes do evento:', error);
      setSelectedEvent(evento); // Usa dados básicos se falhar
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fjpp-blue-DEFAULT mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando eventos...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (eventos.length === 0) {
    return (
      <PublicLayout>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 text-lg">Nenhum evento encontrado.</p>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Galeria de Eventos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {eventos.map((evento) => {
            const { mes, ano } = formatarDataEvento(evento.data_evento);
            const primeiraFoto = evento.fotos && evento.fotos.length > 0 
              ? evento.fotos[0].foto_url 
              : null;
            
            return (
              <div
                key={evento.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer max-w-2xl mx-auto mb-8"
                onClick={() => openModal(evento)}
              >
                {/* Imagem de capa */}
                <div className="relative h-64 bg-gradient-to-br from-fjpp-blue-DEFAULT to-fjpp-blue-700 overflow-hidden">
                  {primeiraFoto && (
                    <img
                      src={primeiraFoto}
                      alt={evento.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/90 text-fjpp-blue-DEFAULT text-sm font-semibold rounded-full">
                      {mes} {ano}
                    </span>
                  </div>
                </div>
                
                {/* Informações do evento */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT mb-2">
                    {evento.nome}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {evento.descricao}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {evento.fotos?.length || 0} {evento.fotos?.length === 1 ? 'foto' : 'fotos'}
                    </span>
                    <span className="text-fjpp-green-DEFAULT font-medium flex items-center">
                      Ver galeria
                      <svg className="w-5 h-5 ml-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal de Galeria - manter código existente, mas usar selectedEvent.fotos */}
      {/* ... código do modal ... */}
    </PublicLayout>
  );
};
```

**Ação:** Substituir código mockado por chamadas à API

---

### **Passo 1.6: Migrar Dados Existentes**

**Ação Manual no Supabase:**

1. Atualizar evento "Novembro Azul" existente:
   ```sql
   UPDATE eventos 
   SET 
     video_url = 'https://www.youtube.com/embed/a6KqnthgnMU?start=198',
     cor_tema = 'blue',
     exibir_publico = TRUE
   WHERE nome ILIKE '%novembro azul%';
   ```

2. Inserir fotos do evento:
   ```sql
   -- Primeiro, descobrir o ID do evento
   SELECT id FROM eventos WHERE nome ILIKE '%novembro azul%';
   
   -- Depois, inserir as fotos (substituir EVENTO_ID pelo ID encontrado)
   INSERT INTO evento_fotos (evento_id, foto_url, alt_text, ordem_exibicao) VALUES
   (EVENTO_ID, 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.23%20(1).jpeg', 'Evento Novembro Azul 1', 1),
   (EVENTO_ID, 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.23.jpeg', 'Evento Novembro Azul 2', 2),
   -- ... adicionar todas as 10 fotos
   ;
   ```

---

### **Passo 1.7: Testar**

**Checklist:**
- [ ] Executar migration SQL
- [ ] Atualizar modelo backend
- [ ] Atualizar controller backend
- [ ] Atualizar rotas backend
- [ ] Testar endpoints públicos (Postman/Insomnia)
- [ ] Atualizar frontend
- [ ] Migrar dados existentes
- [ ] Testar página pública
- [ ] Verificar se eventos aparecem corretamente
- [ ] Verificar se fotos carregam
- [ ] Verificar se vídeo aparece

---

## 🟡 FASE 2: Equipe e Patrocinadores

### **Passo 2.1: Criar Tabelas**

**Arquivo:** `backend/migrations/004_create_equipe_patrocinadores.sql`

```sql
-- Tabela de Membros da Equipe
CREATE TABLE IF NOT EXISTS membros_equipe (
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
CREATE TABLE IF NOT EXISTS patrocinadores (
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_membros_equipe_ativo ON membros_equipe(ativo) WHERE ativo = TRUE;
CREATE INDEX IF NOT EXISTS idx_patrocinadores_ativo ON patrocinadores(ativo) WHERE ativo = TRUE;
```

---

### **Passo 2.2: Criar Modelos**

**Arquivos a criar:**
- `backend/src/models/membroEquipeModel.js`
- `backend/src/models/patrocinadorModel.js`

**Funções necessárias:**
- `listarMembrosAtivos()` - Para página pública
- `listarMembros()` - Para admin
- `criarMembro()`
- `atualizarMembro()`
- `deletarMembro()`
- `listarPatrocinadoresAtivos()` - Para página pública
- `listarPatrocinadores()` - Para admin
- `criarPatrocinador()`
- `atualizarPatrocinador()`
- `deletarPatrocinador()`

---

### **Passo 2.3: Criar Controllers e Rotas**

**Arquivos a criar:**
- `backend/src/controllers/membroEquipeController.js`
- `backend/src/controllers/patrocinadorController.js`
- `backend/src/routes/membroEquipeRoutes.js`
- `backend/src/routes/patrocinadorRoutes.js`

**Rotas públicas:**
- `GET /api/public/equipe` - Listar membros ativos
- `GET /api/public/patrocinadores` - Listar patrocinadores ativos

**Rotas protegidas:**
- CRUD completo para ambos

---

### **Passo 2.4: Atualizar Frontend**

**Arquivos a atualizar:**
- `frontend/src/public-site/pages/Sobre.jsx` - Remover dados mockados
- Criar páginas administrativas (opcional):
  - `frontend/src/pages/Equipe.jsx`
  - `frontend/src/pages/Patrocinadores.jsx`

---

### **Passo 2.5: Migrar Dados Existentes**

**SQL para migrar equipe:**

```sql
INSERT INTO membros_equipe (nome_completo, cargo, role, foto_url, ordem_exibicao) VALUES
('Possidonio Peixoto', 'Presidente', 'Liderança', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/possidonioperfil.jpeg', 1),
('Lucilene Possidonio', 'Vice Presidente', 'Gestão', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/lucileneperfil.jpeg', 2),
('Gustavo Possidonio', 'Lider Técnico', 'Tecnologia', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/gustavoperfil.jpeg', 3),
('Rose', 'Voluntária', 'Apoio', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/roseperfil.jpeg', 4),
('Gina Possidonio', 'Advogada', 'Jurídica', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/ginaperfil.jpeg', 5),
('Robinson Ramalho', 'Voluntário', 'Apoio', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/robisonperfil.jpeg', 6);
```

**SQL para migrar patrocinadores:**

```sql
INSERT INTO patrocinadores (nome, logo_url, titulo, ordem_exibicao) VALUES
('Junior Soares', 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/perfis/soaresperfil.png', 'Patrocinador', 1);
```

---

## ✅ Checklist Geral

### Fase 1 - Eventos
- [ ] Migration SQL executada
- [ ] Modelo atualizado
- [ ] Controller atualizado
- [ ] Rotas criadas
- [ ] Frontend atualizado
- [ ] Dados migrados
- [ ] Testes realizados

### Fase 2 - Equipe e Patrocinadores
- [ ] Tabelas criadas
- [ ] Modelos criados
- [ ] Controllers criados
- [ ] Rotas criadas
- [ ] Frontend atualizado
- [ ] Dados migrados
- [ ] Testes realizados

---

## 🎯 Próximos Passos Imediatos

1. **Começar pela Fase 1 (Eventos)** - É o mais crítico
2. **Testar cada passo antes de avançar**
3. **Fazer commit após cada fase concluída**
4. **Documentar qualquer problema encontrado**

---

**Nota:** Este plano pode ser executado gradualmente. Não é necessário fazer tudo de uma vez. Podemos pausar entre fases para testar e validar.

