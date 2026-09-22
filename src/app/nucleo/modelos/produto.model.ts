export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  preco_antigo?: number | null;
  url_imagem: string;
  quantidade_estoque: number;
  disponivel: boolean;
  criado_em?: string;
}

// Usado no formulário de cadastro/edição — sem os campos gerados pelo banco.
export interface ProdutoFormulario {
  nome: string;
  descricao: string;
  preco: number;
  preco_antigo?: number | null;
  quantidade_estoque: number;
  disponivel: boolean;
}
