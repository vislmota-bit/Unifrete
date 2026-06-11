create extension if not exists "uuid-ossp";

create table usuarios (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  nome text,
  cargo text,
  diretoria text check (diretoria in ('Gente e Gestão', 'Tecnologia', 'Marketplace', 'Fintech', 'Produto', 'Broker')),
  regime text check (regime in ('remoto', 'híbrido', 'presencial')),
  gestor_id uuid references usuarios(id),
  papel text default 'colaborador' check (papel in ('colaborador', 'gestor', 'admin')),
  xp_total integer default 0,
  nivel text generated always as (
    case
      when xp_total >= 5000 then 'Platina'
      when xp_total >= 2500 then 'Ouro'
      when xp_total >= 1000 then 'Prata'
      else 'Bronze'
    end
  ) stored,
  data_admissao date default current_date,
  onboarding_completo boolean default false,
  created_at timestamptz default now()
);

create table trilhas (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  descricao text,
  diretoria text,
  facilitador text,
  xp_total integer default 0,
  ativo boolean default true,
  created_at timestamptz default now()
);

create table modulos (
  id uuid primary key default uuid_generate_v4(),
  trilha_id uuid references trilhas(id) on delete cascade,
  titulo text not null,
  descricao text,
  formato text check (formato in ('video', 'pdf', 'podcast')),
  url_conteudo text,
  duracao_min integer,
  xp integer default 0,
  ordem integer,
  obrigatorio boolean default false,
  bloqueado_ate uuid references modulos(id),
  created_at timestamptz default now()
);

create table progresso (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references usuarios(id) on delete cascade,
  modulo_id uuid references modulos(id) on delete cascade,
  pct_assistido integer default 0 check (pct_assistido between 0 and 100),
  concluido boolean default false,
  xp_ganho integer default 0,
  data_conclusao timestamptz,
  updated_at timestamptz default now(),
  unique(usuario_id, modulo_id)
);

create table novidades (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  descricao text,
  categoria text check (categoria in ('interno', 'logistica', 'rh', 'tech', 'mercado', 'regulatorio')),
  tempo_leitura_min integer default 3,
  url_externa text,
  destaque boolean default false,
  publicado_em timestamptz default now(),
  autor text
);

create table prazo_obrigatorio (
  id uuid primary key default uuid_generate_v4(),
  modulo_id uuid references modulos(id) on delete cascade,
  usuario_id uuid references usuarios(id) on delete cascade,
  prazo_data date not null,
  unique(modulo_id, usuario_id)
);

alter table usuarios enable row level security;
alter table trilhas enable row level security;
alter table modulos enable row level security;
alter table progresso enable row level security;
alter table novidades enable row level security;

create policy "usuarios can read own data" on usuarios for select using (auth.uid()::text = id::text);
create policy "usuarios can update own data" on usuarios for update using (auth.uid()::text = id::text);
create policy "service role full access" on usuarios using (true);
create policy "trilhas are public" on trilhas for select using (ativo = true);
create policy "modulos are public" on modulos for select using (true);
create policy "progresso own data" on progresso for all using (auth.uid()::text = usuario_id::text);
create policy "novidades are public" on novidades for select using (true);
