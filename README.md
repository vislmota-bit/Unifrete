# Unifrete — Plataforma LMS frete.com

Universidade corporativa da frete.com construída com Next.js 14, Supabase e Tailwind CSS.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — Design tokens da Unifrete
- **NextAuth.js** — SSO Google restrito a @frete.com
- **Supabase** — PostgreSQL + Storage + Realtime
- **Vercel** — Deploy

## Configuração

### 1. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

| Variável | Descrição |
|---|---|
| `NEXTAUTH_URL` | URL da aplicação (ex: http://localhost:3000) |
| `NEXTAUTH_SECRET` | Secret para JWT (use `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Secret do Google OAuth |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key do Supabase |

### 2. Banco de dados Supabase

Execute os arquivos SQL na seguinte ordem no SQL Editor do Supabase:

1. `supabase/schema.sql` — Cria as tabelas e RLS
2. `supabase/functions.sql` — Funções auxiliares (increment_xp)
3. `supabase/seed.sql` — Dados de exemplo para desenvolvimento

### 3. Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto ou use um existente
3. Em "APIs & Services" > "Credentials" > "Create credentials" > "OAuth client ID"
4. Tipo: Web application
5. Authorized origins: `http://localhost:3000` (dev) e sua URL de produção
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### 4. Instalar e rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`

## Estrutura do Projeto

```
app/
  (auth)/login/          Login com Google SSO
  (auth)/onboarding/     Onboarding de 5 passos
  (app)/home/            Dashboard do colaborador
  (app)/trilhas/         Grade de trilhas
  (app)/trilhas/[id]/    Detalhe da trilha
  (app)/trilhas/[id]/modulos/[moduloId]/  Player
  (app)/explorar/        Catálogo com filtros
  (app)/ranking/         Ranking de XP
  (app)/perfil/          Perfil do colaborador
  (app)/novidades/       Feed de novidades
  admin/                 Painel admin
  api/                   Routes de API
components/
  ui/                    Componentes de UI (RoadHero, XPOrb, etc)
  layout/                Topbar, Sidebar, PlayerTopbar
  courses/               TrailCard, CourseRow, VideoPlayer, ModuleSidebar
  news/                  NewsCard, NewsRow
lib/
  supabase.ts            Cliente Supabase + tipos
  auth.ts                Configuração NextAuth
  utils.ts               Utilitários (cn)
supabase/
  schema.sql             Schema do banco
  functions.sql          Funções SQL
  seed.sql               Dados de exemplo
```

## Funcionalidades MVP

- ✅ SSO Google restrito ao domínio @frete.com
- ✅ Onboarding de 5 passos para novos colaboradores
- ✅ Controle de papéis: admin / gestor / colaborador
- ✅ Trilhas com módulos sequenciais (vídeo/PDF/podcast)
- ✅ Rastreamento real de progresso por módulo
- ✅ Desbloqueio sequencial de módulos
- ✅ XP creditado automaticamente na conclusão (≥90%)
- ✅ Painel do gestor/admin com métricas de engajamento
- ✅ Busca e filtros no catálogo
- ✅ Responsividade mobile
- ✅ Exportação de relatório CSV pelo admin
- ✅ Feed de novidades com categorias

## Deploy na Vercel

1. Conecte o repositório no [Vercel Dashboard](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na branch main
