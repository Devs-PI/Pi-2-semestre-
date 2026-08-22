# Como foi desenvolvido o App de Vendas

## 1. Visão geral

O sistema é um marketplace simples, com um único Admin e vários Clientes. O front-end foi feito em **Angular** e o back-end é o **Supabase**, que fornece banco de dados (PostgreSQL) e armazenamento de arquivos prontos, sem precisar criar um servidor próprio.

## 2. Tecnologias utilizadas

- **Angular** para a interface.
- **Supabase** para banco de dados e armazenamento de imagens.
- **bcryptjs** para criptografar a senha do usuário.
- **SCSS** para o estilo visual.

## 3. Organização do código

O código é dividido por função:

- **Serviços** (`nucleo/servicos`): cuidam da comunicação com o Supabase (login, produtos, carrinho, pedidos).
- **Guards** (`nucleo/guards`): bloqueiam o acesso a páginas para quem não está logado ou não é admin.
- **Modelos** (`nucleo/modelos`): definem o formato dos dados (produto, usuário, pedido).
- **Páginas** (`paginas`): uma tela para cada funcionalidade (login, cadastro, lista de produtos, carrinho, finalizar pedido, painel do admin).
- **Componentes compartilhados**: cabeçalho e cartão de produto, usados em várias telas.

## 4. Banco de dados

Foram criadas quatro tabelas: `usuarios`, `produtos`, `pedidos` e `itens_pedido`. Cada item do pedido guarda o preço do produto no momento da compra, para que uma mudança de preço depois não afete pedidos antigos.

## 5. Login próprio

O login não usa o sistema pronto do Supabase — foi criada uma tabela de usuários própria, com a senha guardada como hash (nunca em texto puro). Por isso, o sistema não consegue usar as regras de segurança automáticas do Supabase por usuário; essa limitação foi uma escolha consciente para simplificar o projeto, e está documentada aqui.

## 6. Funcionalidades importantes

- **Carrinho que não se perde**: o carrinho é salvo no navegador (localStorage), então continua lá mesmo se a página recarregar.
- **Estoque automático**: quando um pedido é confirmado, o sistema desconta a quantidade comprada do estoque do produto. Se o estoque chegar a zero, o produto vira "Indisponível" sozinho.
- **Limite no carrinho**: não é possível adicionar mais unidades do que existe em estoque.

## 7. Visual

O visual (cores, fontes, formato dos botões e cartões) foi baseado em um modelo de referência e aplicado de forma padronizada em todas as telas, para manter a mesma aparência em todo o sistema.

## 8. Limitações

- Não há pagamento de verdade, só o registro do pedido.
- É uma loja única, não múltiplos vendedores.
- Não há recuperação de senha nem confirmação por e-mail.

Essas limitações foram decisões de escopo do projeto, não erros esquecidos.
