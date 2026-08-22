import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { NovoPedido, PedidoDetalhado } from '../modelos/pedido.model';

// Serviço responsável por gravar o pedido finalizado (e seus itens)
@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  constructor(private supabaseService: SupabaseService) {}

  async listarPedidos(): Promise<PedidoDetalhado[]> {
    const cliente = this.supabaseService.obterCliente();
    const { data, error } = await cliente
      .from('pedidos')
      .select(
        'id, status, valor_total, criado_em, usuarios(nome), itens_pedido(id, quantidade, preco_unitario, produtos(nome, url_imagem))',
      )
      .order('criado_em', { ascending: false });

    if (error) {
      throw new Error('Não foi possível carregar os pedidos.');
    }

    return data as unknown as PedidoDetalhado[];
  }

  async criarPedido(novoPedido: NovoPedido): Promise<string> {
    const cliente = this.supabaseService.obterCliente();

    const { data: pedidoCriado, error: erroPedido } = await cliente
      .from('pedidos')
      .insert({
        usuario_id: novoPedido.usuario_id,
        valor_total: novoPedido.valor_total,
        status: 'recebido',
      })
      .select()
      .single();

    if (erroPedido || !pedidoCriado) {
      throw new Error('Não foi possível registrar o pedido.');
    }

    const itensParaInserir = novoPedido.itens.map((item) => ({
      pedido_id: pedidoCriado['id'],
      produto_id: item.produto_id,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
    }));

    const { error: erroItens } = await cliente
      .from('itens_pedido')
      .insert(itensParaInserir);

    if (erroItens) {
      throw new Error('Pedido criado, mas houve erro ao registrar os itens.');
    }

    await this.debitarEstoque(novoPedido.itens);

    return pedidoCriado['id'] as string;
  }

  // Abate a quantidade comprada do estoque de cada produto e marca como
  // indisponível quando o estoque chega a zero (via função no banco, para
  // que o cálculo seja atômico mesmo com pedidos concorrentes).
  private async debitarEstoque(itens: NovoPedido['itens']): Promise<void> {
    const cliente = this.supabaseService.obterCliente();

    await Promise.all(
      itens.map((item) =>
        cliente.rpc('debitar_estoque_produto', {
          p_produto_id: item.produto_id,
          p_quantidade: item.quantidade,
        }),
      ),
    );
  }
}
