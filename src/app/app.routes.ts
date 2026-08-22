import { Routes } from '@angular/router';
import { autenticadoGuard } from './nucleo/guards/autenticado.guard';
import { adminGuard } from './nucleo/guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: 'login',
    loadComponent: () =>
      import('./paginas/tela-login/tela-login.component').then(
        (m) => m.TelaLoginComponent
      ),
  },

  {
    path: 'cadastro',
    loadComponent: () =>
      import('./paginas/tela-cadastro/tela-cadastro.component').then(
        (m) => m.TelaCadastroComponent
      ),
  },

  {
    path: 'produtos',
    canActivate: [autenticadoGuard],
    loadComponent: () =>
      import('./paginas/lista-produtos/lista-produtos.component').then(
        (m) => m.ListaProdutosComponent
      ),
  },

  {
    path: 'carrinho',
    canActivate: [autenticadoGuard],
    loadComponent: () =>
      import('./paginas/carrinho-compras/carrinho-compras.component').then(
        (m) => m.CarrinhoComprasComponent
      ),
  },

  {
    path: 'finalizar-pedido',
    canActivate: [autenticadoGuard],
    loadComponent: () =>
      import('./paginas/finalizar-pedido/finalizar-pedido.component').then(
        (m) => m.FinalizarPedidoComponent
      ),
  },

  {
    path: 'admin/produtos',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./paginas/admin/admin-produtos/admin-produtos.component').then(
        (m) => m.AdminProdutosComponent
      ),
  },

  {
    path: 'admin/produtos/novo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import(
        './paginas/admin/admin-cadastro-produto/admin-cadastro-produto.component'
      ).then((m) => m.AdminCadastroProdutoComponent),
  },

  {
    path: 'admin/produtos/editar/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import(
        './paginas/admin/admin-cadastro-produto/admin-cadastro-produto.component'
      ).then((m) => m.AdminCadastroProdutoComponent),
  },

  {
    path: 'admin/pedidos',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./paginas/admin/admin-pedidos/admin-pedidos.component').then(
        (m) => m.AdminPedidosComponent
      ),
  },

  { path: '**', redirectTo: 'login' },
];
