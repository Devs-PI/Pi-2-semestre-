import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../../compartilhado/componentes/cabecalho/cabecalho.component';
import { ProdutoService } from '../../../nucleo/servicos/produto.service';
import { Produto } from '../../../nucleo/modelos/produto.model';

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [CommonModule, RouterLink, CabecalhoComponent],
  templateUrl: './admin-produtos.component.html',
  styleUrl: './admin-produtos.component.css',
})
export class AdminProdutosComponent implements OnInit {
  listaProdutos: Produto[] = [];
  carregando = true;
  mensagemErro = '';

  constructor(private produtoService: ProdutoService) {}

  async ngOnInit(): Promise<void> {
    await this.carregarProdutos();
  }

  async carregarProdutos(): Promise<void> {
    this.carregando = true;
    try {
      this.listaProdutos = await this.produtoService.listarProdutos();
    } catch (erro) {
      this.mensagemErro = (erro as Error).message;
    } finally {
      this.carregando = false;
    }
  }

  async excluirProduto(id: string): Promise<void> {
    const confirmou = confirm('Deseja realmente excluir este produto?');
    if (!confirmou) {
      return;
    }

    try {
      await this.produtoService.excluirProduto(id);
      await this.carregarProdutos();
    } catch (erro) {
      this.mensagemErro = (erro as Error).message;
    }
  }
}
