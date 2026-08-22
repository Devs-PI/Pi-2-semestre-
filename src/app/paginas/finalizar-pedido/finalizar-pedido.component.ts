import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../compartilhado/componentes/cabecalho/cabecalho.component';
import { CarrinhoService } from '../../nucleo/servicos/carrinho.service';
import { PedidoService } from '../../nucleo/servicos/pedido.service';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';

@Component({
  selector: 'app-finalizar-pedido',
  standalone: true,
  imports: [CommonModule, RouterLink, CabecalhoComponent],
  templateUrl: './finalizar-pedido.component.html',
  styleUrl: './finalizar-pedido.component.css',
})
export class FinalizarPedidoComponent {
  confirmando = false;
  pedidoConfirmado = false;
  mensagemErro = '';

  constructor(
    public carrinhoService: CarrinhoService,
    private pedidoService: PedidoService,
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {}

  async confirmarPedido(): Promise<void> {
    const usuario = this.autenticacaoService.usuarioLogado();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.confirmando = true;
    this.mensagemErro = '';

    try {
      await this.pedidoService.criarPedido({
        usuario_id: usuario.id,
        valor_total: this.carrinhoService.valorTotal(),
        itens: this.carrinhoService.itensCarrinho().map((item) => ({
          produto_id: item.produto.id,
          quantidade: item.quantidade,
          preco_unitario: item.produto.preco,
        })),
      });

      this.pedidoConfirmado = true;
      this.carrinhoService.limparCarrinho();
    } catch (erro) {
      this.mensagemErro = (erro as Error).message;
    } finally {
      this.confirmando = false;
    }
  }
}
