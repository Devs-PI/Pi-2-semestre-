import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabecalhoComponent } from '../../compartilhado/componentes/cabecalho/cabecalho.component';
import { CartaoProdutoComponent } from '../../compartilhado/componentes/cartao-produto/cartao-produto.component';
import { ProdutoService } from '../../nucleo/servicos/produto.service';
import { CarrinhoService } from '../../nucleo/servicos/carrinho.service';
import { Produto } from '../../nucleo/modelos/produto.model';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [CommonModule, CabecalhoComponent, CartaoProdutoComponent],
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.css',
})
export class ListaProdutosComponent implements OnInit {
  listaProdutos: Produto[] = [];
  carregando = true;
  mensagemErro = '';

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.listaProdutos = await this.produtoService.listarProdutos();
    } catch (erro) {
      this.mensagemErro = (erro as Error).message;
    } finally {
      this.carregando = false;
    }
  }

  adicionarAoCarrinho(produto: Produto): void {
    this.carrinhoService.adicionarProduto(produto);
  }
}
