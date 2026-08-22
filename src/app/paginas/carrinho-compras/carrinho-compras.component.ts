import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../compartilhado/componentes/cabecalho/cabecalho.component';
import { CarrinhoService } from '../../nucleo/servicos/carrinho.service';

@Component({
  selector: 'app-carrinho-compras',
  standalone: true,
  imports: [CommonModule, RouterLink, CabecalhoComponent],
  templateUrl: './carrinho-compras.component.html',
  styleUrl: './carrinho-compras.component.css',
})
export class CarrinhoComprasComponent {
  constructor(
    public carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  alterarQuantidade(produtoId: string, quantidade: number): void {
    this.carrinhoService.alterarQuantidade(produtoId, quantidade);
  }

  removerProduto(produtoId: string): void {
    this.carrinhoService.removerProduto(produtoId);
  }

  irParaFinalizarPedido(): void {
    this.router.navigate(['/finalizar-pedido']);
  }
}
