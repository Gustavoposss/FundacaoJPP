# Configuração do Supabase Storage

Este guia explica como configurar o Supabase Storage para armazenar imagens do site institucional.

## 📋 Pré-requisitos

1. Projeto Supabase criado
2. Acesso ao dashboard do Supabase

## 🔧 Passo a Passo

### 1. Criar Buckets no Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Storage** no menu lateral
4. Clique em **New bucket**

#### Bucket 1: `perfis`
- **Nome**: `perfis`
- **Public**: ✅ Sim (marcar como público)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### Bucket 2: `projetos`
- **Nome**: `projetos`
- **Public**: ✅ Sim (marcar como público)
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### Bucket 3: `backgrounds`
- **Nome**: `backgrounds`
- **Public**: ✅ Sim (marcar como público)
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

### 2. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env` do backend:

```env
# Supabase Storage
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
```

**Onde encontrar:**
- `SUPABASE_URL`: Settings > API > Project URL
- `SUPABASE_ANON_KEY`: Settings > API > Project API keys > `anon` `public`

### 3. Fazer Upload das Imagens

#### Opção 1: Via Dashboard do Supabase (Recomendado)

1. Acesse **Storage** > **perfis**
2. Clique em **Upload file**
3. Faça upload das imagens com os nomes:
   - `possidonioperfil.jpg` (ou .png)
   - `lucileneperfil.jpg` (ou .png)
   - `gustavoperfil.jpg` (ou .png)

4. Para backgrounds:
   - Acesse **Storage** > **backgrounds**
   - Faça upload da imagem de fundo com o nome: `sobre-hero.jpg` (ou .png)

5. Para projetos:
   - Acesse **Storage** > **projetos**
   - Faça upload das fotos dos eventos

#### Opção 2: Via API (Futuro)

Você pode criar um endpoint de upload no backend se necessário.

### 4. Obter URLs das Imagens

Após fazer upload, você pode obter as URLs de duas formas:

#### Via API do Backend:
```
GET /api/storage/perfis
```

Retorna:
```json
{
  "success": true,
  "data": {
    "images": {
      "possidonio": "https://seu-projeto.supabase.co/storage/v1/object/public/perfis/possidonioperfil.jpg",
      "lucilene": "https://seu-projeto.supabase.co/storage/v1/object/public/perfis/lucileneperfil.jpg",
      "gustavo": "https://seu-projeto.supabase.co/storage/v1/object/public/perfis/gustavoperfil.jpg"
    }
  }
}
```

#### Via URL Direta:
```
https://seu-projeto.supabase.co/storage/v1/object/public/perfis/nome-do-arquivo.jpg
```

### 5. Atualizar o Frontend

O frontend será atualizado para usar essas URLs automaticamente após a configuração.

## 📝 Estrutura de Pastas Recomendada

```
perfis/
  ├── possidonioperfil.jpg
  ├── lucileneperfil.jpg
  └── gustavoperfil.jpg

backgrounds/
  └── sobre-hero.jpg

projetos/
  ├── outubro-rosa/
  │   ├── foto1.jpg
  │   ├── foto2.jpg
  │   └── ...
  ├── novembro-azul/
  │   ├── foto1.jpg
  │   └── ...
  └── ...
```

## 🔒 Políticas de Segurança

Os buckets devem estar configurados como **públicos** para que as imagens sejam acessíveis sem autenticação. O Supabase Storage já fornece URLs públicas seguras.

## ✅ Vantagens do Supabase Storage

- ✅ URLs públicas estáveis
- ✅ CDN global (imagens carregam rápido em qualquer lugar)
- ✅ Sem problemas de tamanho de arquivo
- ✅ Fácil gerenciamento via dashboard
- ✅ Suporte a diferentes formatos (JPEG, PNG, WebP)
- ✅ Otimização automática de imagens

## 🐛 Solução de Problemas

### Imagens não aparecem
- Verifique se o bucket está marcado como **público**
- Verifique se os nomes dos arquivos estão corretos
- Verifique se as variáveis de ambiente estão configuradas

### Erro 403 (Forbidden)
- Certifique-se de que o bucket está público
- Verifique se a `SUPABASE_ANON_KEY` está correta

### Erro ao fazer upload
- Verifique o tamanho do arquivo (não deve exceder o limite)
- Verifique o tipo MIME permitido

