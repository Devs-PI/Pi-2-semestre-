# Documentação Técnica — App de Vendas (Projeto Integrador)

## 1. Visão Geral

Aplicação web estilo _marketplace de loja única_ (modelo iFood — um único Admin/loja, vários Clientes), desenvolvida em **Angular** com **Supabase** como backend (banco de dados + storage de imagens).

Escopo funcional definido:

- Tela de **login** única, com dois perfis de acesso: **Cliente** e **Admin**.
- Autenticação **própria** (tabela de usuários no Supabase, sem uso do Supabase Auth nativo).
- Tela de **produtos**, cadastrados exclusivamente pelo Admin (com upload de imagem).
- **Carrinho de compras** para o Cliente.
- Tela de **finalizar pedido** (sem integração de pagamento) — o pedido é **persistido no Supabase**.
- Loja única: todos os produtos pertencem ao mesmo Admin (não é multi-vendedor).

Fora de escopo (confirmado com o autor do projeto):

- Pagamento real ou simulado por gateway.
- Múltiplos vendedores/admins.
- Recuperação de senha, verificação de e-mail, 2FA.

> ⚠️ Como o login é feito por tabela própria (sem Supabase Auth), a senha será tratada com hash (recomendado: `bcryptjs` no client, ou idealmente uma Edge Function no Supabase). Documentado na seção 6 (Riscos).

---

## 2. Convenção de Nomenclatura

Todo o projeto usa **português** para nomes de variáveis, componentes, serviços, rotas e arquivos, mantendo relação direta com a função.

| Elemento           | Convenção                             | Exemplo                                                                    |
| ------------------ | ------------------------------------- | -------------------------------------------------------------------------- |
| Componentes        | `kebab-case` + sufixo da função       | `tela-login`, `lista-produtos`, `carrinho-compras`                         |
| Serviços           | sufixo `.service.ts`, nome do domínio | `produto.service.ts`, `pedido.service.ts`                                  |
| Modelos/Interfaces | PascalCase, singular                  | `Produto`, `Usuario`, `ItemCarrinho`, `Pedido`                             |
| Variáveis          | camelCase, em português               | `listaProdutos`, `usuarioLogado`, `itensCarrinho`                          |
| Rotas              | kebab-case, em português              | `/login`, `/produtos`, `/carrinho`, `/finalizar-pedido`, `/admin/produtos` |
| Tabelas Supabase   | snake_case, em português              | `usuarios`, `produtos`, `pedidos`, `itens_pedido`                          |

---

## 3. Estrutura de Pastas (Angular)

```
src/app/
├── nucleo/                        # "core" — serviços globais, guards, interceptors
│   ├── servicos/
│   │   ├── supabase.service.ts        # cliente único do Supabase (URL + chave)
│   │   ├── autenticacao.service.ts    # login, logout, sessão do usuário
│   │   ├── produto.service.ts         # CRUD de produtos + upload de imagem
│   │   ├── carrinho.service.ts        # estado do carrinho (BehaviorSubject)
│   │   └── pedido.service.ts          # criação/consulta de pedidos
│   ├── guards/
│   │   ├── autenticado.guard.ts       # bloqueia rotas sem login
│   │   └── admin.guard.ts             # bloqueia rotas de admin para clientes
│   └── modelos/
│       ├── usuario.model.ts
│       ├── produto.model.ts
│       ├── item-carrinho.model.ts
│       └── pedido.model.ts
│
├── paginas/
│   ├── tela-login/
│   │   ├── tela-login.component.ts
│   │   ├── tela-login.component.html
│   │   └── tela-login.component.scss
│   ├── lista-produtos/                # tela inicial pós-login (cliente)
│   ├── carrinho-compras/
│   ├── finalizar-pedido/
│   └── admin/
│       ├── admin-produtos/            # listagem + exclusão (admin)
│       └── admin-cadastro-produto/    # formulário de criação/edição + upload imagem
│
├── compartilhado/                 # "shared" — componentes reutilizáveis
│   └── componentes/
│       ├── cabecalho/
│       └── cartao-produto/
│
├── app.routes.ts
└── app.config.ts                  # aqui entra a config do cliente Supabase (env)
```

Arquivo de ambiente (onde entra a API do Supabase):

```
src/environments/
├── environment.ts          # ambienteUrlSupabase, ambienteChaveSupabase (dev)
└── environment.prod.ts     # idem (produção)
```

---

## 4. Modelo de Dados (Supabase / PostgreSQL)

### 4.1 Tabela `usuarios`

| Coluna         | Tipo                                     | Observação                        |
| -------------- | ---------------------------------------- | --------------------------------- |
| `id`           | `uuid` (PK, default `gen_random_uuid()`) |                                   |
| `nome`         | `text`                                   |                                   |
| `email`        | `text`, `unique`                         | usado como login                  |
| `senha_hash`   | `text`                                   | senha com hash — nunca texto puro |
| `tipo_usuario` | `text` (`'cliente'` \| `'admin'`)        | define o perfil de acesso         |
| `criado_em`    | `timestamptz`, default `now()`           |                                   |

### 4.2 Tabela `produtos`

| Coluna               | Tipo                                     | Observação                                  |
| -------------------- | ---------------------------------------- | ------------------------------------------- |
| `id`                 | `uuid` (PK, default `gen_random_uuid()`) |                                             |
| `nome`               | `text`                                   |                                             |
| `descricao`          | `text`                                   |                                             |
| `preco`              | `numeric(10,2)`                          |                                             |
| `url_imagem`         | `text`                                   | URL pública retornada pelo Supabase Storage |
| `quantidade_estoque` | `int4`, default `0`                      | opcional, mas recomendado                   |
| `disponivel`         | `bool`, default `true`                   | permite "pausar" produto sem excluir        |
| `criado_em`          | `timestamptz`, default `now()`           |                                             |

### 4.3 Tabela `pedidos`

| Coluna        | Tipo                                     | Observação                           |
| ------------- | ---------------------------------------- | ------------------------------------ |
| `id`          | `uuid` (PK, default `gen_random_uuid()`) |                                      |
| `usuario_id`  | `uuid` (FK → `usuarios.id`)              | cliente que fez o pedido             |
| `status`      | `text`, default `'recebido'`             | ex.: recebido, em preparo, concluído |
| `valor_total` | `numeric(10,2)`                          |                                      |
| `criado_em`   | `timestamptz`, default `now()`           |                                      |

### 4.4 Tabela `itens_pedido`

| Coluna           | Tipo                                     | Observação                           |
| ---------------- | ---------------------------------------- | ------------------------------------ |
| `id`             | `uuid` (PK, default `gen_random_uuid()`) |                                      |
| `pedido_id`      | `uuid` (FK → `pedidos.id`)               |                                      |
| `produto_id`     | `uuid` (FK → `produtos.id`)              |                                      |
| `quantidade`     | `int4`                                   |                                      |
| `preco_unitario` | `numeric(10,2)`                          | "foto" do preço no momento da compra |

### 4.5 Storage

- Bucket `imagens-produtos` (público para leitura) — usado pelo Admin ao cadastrar/editar produto.

> ⚠️ Como a autenticação não usa Supabase Auth, as políticas de **RLS (Row Level Security)** não podem se basear em `auth.uid()`. Duas opções, a decidir na implementação:
>
> 1. Deixar RLS desabilitado (mais simples, aceitável para escopo acadêmico, documentar como limitação).
> 2. Implementar as regras de admin/cliente via **Edge Functions** com `service_role` no backend.
>    Recomendação para um TCC/PI: opção 1, com uma nota explícita no relatório sobre a limitação de segurança.

---

## 5. Fluxo de Telas

```
tela-login
   │
   ├── tipo_usuario = cliente ──▶ lista-produtos ──▶ carrinho-compras ──▶ finalizar-pedido
   │
   └── tipo_usuario = admin ───▶ admin-produtos ──▶ admin-cadastro-produto (criar/editar)
```

- **tela-login**: formulário único (email + senha). Após autenticar, o `autenticacao.service.ts` guarda o usuário logado (ex.: em `signal`/`BehaviorSubject` + `localStorage`) e redireciona conforme `tipo_usuario`.
- **lista-produtos**: grid de `cartao-produto`, botão "adicionar ao carrinho".
- **carrinho-compras**: lista de `itens_carrinho`, ajuste de quantidade, remoção, total.
- **finalizar-pedido**: resumo do pedido → botão "Confirmar pedido" → grava em `pedidos` + `itens_pedido` via `pedido.service.ts`.
- **admin-produtos**: listagem com editar/excluir.
- **admin-cadastro-produto**: formulário (nome, descrição, preço, estoque) + input de imagem → upload para o Storage → salva `url_imagem` retornada.

---

## 6. Riscos e Limitações (para constar no relatório do PI)

1. **Login sem Supabase Auth**: exige hash de senha manual e ausência de RLS efetivo por usuário. Documentar como decisão consciente de escopo.
2. **Sem pagamento**: pedido fica com status fixo/inicial, sem gateway.
3. **Loja única**: não há isolamento de dados entre múltiplos vendedores.
4. **Chave do Supabase no frontend**: usar apenas a chave `anon` (pública), nunca a `service_role`, mesmo sem RLS completo.

---
