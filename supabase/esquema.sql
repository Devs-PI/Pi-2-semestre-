-- Extensão necessária para gen_random_uuid()
create extension if not exists "pgcrypto";

-- Tabela de usuários (autenticação própria, sem Supabase Auth)
create table usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  senha_hash text not null,
  tipo_usuario text not null check (tipo_usuario in ('cliente', 'admin')),
  criado_em timestamptz not null default now()
);

-- Tabela de produtos
create table produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  preco numeric(10,2) not null,
  preco_antigo numeric(10,2),
  url_imagem text,
  quantidade_estoque int4 not null default 0,
  disponivel bool not null default true,
  criado_em timestamptz not null default now()
);

-- Tabela de pedidos
create table pedidos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id),
  status text not null default 'recebido',
  valor_total numeric(10,2) not null,
  criado_em timestamptz not null default now()
);

-- Tabela de itens do pedido
create table itens_pedido (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  produto_id uuid not null references produtos(id),
  quantidade int4 not null,
  preco_unitario numeric(10,2) not null
);

-- Bucket de imagens dos produtos (execute no painel Storage, ou via SQL abaixo)
insert into storage.buckets (id, name, public)
values ('imagens-produtos', 'imagens-produtos', true)
on conflict (id) do nothing;

