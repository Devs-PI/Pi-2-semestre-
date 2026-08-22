// Usado ao montar o pedido a partir do carrinho, antes de gravar no banco.
export interface NovoPedido {
  usuario_id: string;
  valor_total: number;
  itens: {
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
  }[];
}

// Usado na tela de pedidos do admin, com os itens e o produto de cada
// item já trazidos junto (join feito na própria consulta ao Supabase).
export interface ItemPedidoDetalhado {
  id: string;
  quantidade: number;
  preco_unitario: number;
  produtos: {
    nome: string;
    url_imagem: string;
  };
}

export interface PedidoDetalhado {
  id: string;
  status: string;
  valor_total: number;
  criado_em: string;
  usuarios: {
    nome: string;
  };
  itens_pedido: ItemPedidoDetalhado[];
}
