import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabecalhoComponent } from '../../../compartilhado/componentes/cabecalho/cabecalho.component';
import { PedidoService } from '../../../nucleo/servicos/pedido.service';
import { PedidoDetalhado } from '../../../nucleo/modelos/pedido.model';

const ROTULOS_STATUS: Record<string, string> = {
  recebido: 'Recebido',
  em_preparo: 'Em preparo',
  concluido: 'Concluído',
};

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, CabecalhoComponent],
  templateUrl: './admin-pedidos.component.html',
  styleUrl: './admin-pedidos.component.css',
})
export class AdminPedidosComponent implements OnInit {
  listaPedidos: PedidoDetalhado[] = [];
  carregando = true;
  mensagemErro = '';

  constructor(private pedidoService: PedidoService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.listaPedidos = await this.pedidoService.listarPedidos();
    } catch (erro) {
      this.mensagemErro = (erro as Error).message;
    } finally {
      this.carregando = false;
    }
  }

  numeroPedido(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }

  rotuloStatus(status: string): string {
    return ROTULOS_STATUS[status] ?? status;
  }
}
