import { Injectable, computed, effect, signal } from '@angular/core';
import { Produto } from '../modelos/produto.model';
import { ItemCarrinho } from '../modelos/item-carrinho.model';

const CHAVE_ARMAZENAMENTO = 'itensCarrinho';

// Serviço responsável por manter o estado do carrinho de compras.
// Persistido no localStorage para sobreviver a recarregamentos de página
// (o carrinho não deve sumir se o usuário der F5 ou voltar depois).
@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  itensCarrinho = signal<ItemCarrinho[]>(this.recuperarCarrinhoSalvo());

  valorTotal = computed(() =>
    this.itensCarrinho().reduce(
      (total, item) => total + item.produto.preco * item.quantidade,
      0
    )
  );

  quantidadeTotalItens = computed(() =>
    this.itensCarrinho().reduce((total, item) => total + item.quantidade, 0)
  );

  constructor() {
    effect(() => {
      localStorage.setItem(
        CHAVE_ARMAZENAMENTO,
        JSON.stringify(this.itensCarrinho())
      );
    });
  }

  private recuperarCarrinhoSalvo(): ItemCarrinho[] {
    const dados = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    return dados ? (JSON.parse(dados) as ItemCarrinho[]) : [];
  }

  adicionarProduto(produto: Produto): void {
    this.itensCarrinho.update((itensAtuais) => {
      const itemExistente = itensAtuais.find(
        (item) => item.produto.id === produto.id
      );

      const quantidadeAtual = itemExistente?.quantidade ?? 0;
      if (quantidadeAtual >= produto.quantidade_estoque) {
        return itensAtuais;
      }

      if (itemExistente) {
        return itensAtuais.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...itensAtuais, { produto, quantidade: 1 }];
    });
  }

  alterarQuantidade(produtoId: string, quantidade: number): void {
    if (quantidade <= 0) {
      this.removerProduto(produtoId);
      return;
    }

    this.itensCarrinho.update((itensAtuais) =>
      itensAtuais.map((item) =>
        item.produto.id === produtoId
          ? { ...item, quantidade: Math.min(quantidade, item.produto.quantidade_estoque) }
          : item
      )
    );
  }

  removerProduto(produtoId: string): void {
    this.itensCarrinho.update((itensAtuais) =>
      itensAtuais.filter((item) => item.produto.id !== produtoId)
    );
  }

  limparCarrinho(): void {
    this.itensCarrinho.set([]);
  }
}
