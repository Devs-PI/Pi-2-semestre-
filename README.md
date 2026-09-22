# App de Vendas — Projeto Integrador

Aplicação web estilo marketplace (loja única), feita em Angular + Supabase.
Ver `documentacao-tecnica.md` e `documentacao-design.md` (fora deste projeto) para o detalhamento completo.

## Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o script `supabase/esquema.sql` (cria as tabelas e o bucket de imagens).
3. Pegue a **URL do projeto** e a **chave `anon` (pública)** em *Project Settings → API*.
4. Cole essas informações em:
   - `src/environments/environment.ts` (desenvolvimento)
   - `src/environments/environment.prod.ts` (produção)

```ts
export const ambiente = {
  producao: false,
  ambienteUrlSupabase: 'https://SEU-PROJETO.supabase.co',
  ambienteChaveSupabase: 'SUA_CHAVE_ANON_AQUI',
};
```

### 3. Criar um usuário admin

Como o login é próprio (não usa Supabase Auth), você precisa inserir manualmente
o primeiro usuário admin direto na tabela `usuarios`, com a senha já em hash bcrypt.
Uma forma simples: rode este trecho uma vez no console do navegador (com o projeto
já rodando) ou em um script Node local:

```js
const bcrypt = require('bcryptjs');
bcrypt.hash('sua_senha_aqui', 10).then(console.log);
```

Copie o hash gerado e insira no Supabase (tabela `usuarios`):

```sql
insert into usuarios (nome, email, senha_hash, tipo_usuario)
values ('Administrador', 'admin@marketplace.com', '<hash_gerado>', 'admin');
```

Usuários do tipo `cliente` podem se cadastrar pela própria tela de login (link "Criar conta").

### 4. Rodar o projeto

```bash
npm start
```

Acesse em `http://localhost:4200`.
