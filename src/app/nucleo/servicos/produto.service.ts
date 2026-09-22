import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Produto, ProdutoFormulario } from '../modelos/produto.model';

const NOME_BUCKET_IMAGENS = 'imagens-produtos';
const REGEX_CARACTERES_INVALIDOS = /[^a-zA-Z0-9.-]/g;
const REGEX_HIFENS_REPETIDOS = /-+/g;

// Serviço responsável pelo CRUD de produtos e pelo upload da imagem
@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  constructor(private supabaseService: SupabaseService) {}

  async listarProdutos(): Promise<Produto[]> {
    const cliente = this.supabaseService.obterCliente();
    const { data, error } = await cliente
      .from('produtos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      throw new Error('Não foi possível carregar os produtos.');
    }

    return data as Produto[];
  }

  async buscarProdutoPorId(id: string): Promise<Produto | null> {
    const cliente = this.supabaseService.obterCliente();
    const { data, error } = await cliente
      .from('produtos')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error('Não foi possível carregar o produto.');
    }

    return data as Produto | null;
  }

  async enviarImagemProduto(arquivo: File): Promise<string> {
    const cliente = this.supabaseService.obterCliente();
    const nomeArquivo = `${Date.now()}-${this.sanitizarNomeArquivo(arquivo.name)}`;

    const { error: erroUpload } = await cliente.storage
      .from(NOME_BUCKET_IMAGENS)
      .upload(nomeArquivo, arquivo);

    if (erroUpload) {
      throw new Error('Não foi possível enviar a imagem do produto.');
    }

    const { data } = cliente.storage
      .from(NOME_BUCKET_IMAGENS)
      .getPublicUrl(nomeArquivo);

    return data.publicUrl;
  }

  // O Storage do Supabase rejeita nomes de arquivo com espaço, acento ou
  // caracteres especiais (erro "InvalidKey"). Normalizamos para decompor
  // acentos e trocamos qualquer caractere fora de a-z/0-9/./- por hífen.
  private sanitizarNomeArquivo(nomeOriginal: string): string {
    return nomeOriginal
      .normalize('NFD')
      .replace(REGEX_CARACTERES_INVALIDOS, '-')
      .replace(REGEX_HIFENS_REPETIDOS, '-');
  }

  async criarProduto(
    dadosProduto: ProdutoFormulario,
    urlImagem: string,
  ): Promise<void> {
    const cliente = this.supabaseService.obterCliente();
    const { error } = await cliente.from('produtos').insert({
      ...dadosProduto,
      url_imagem: urlImagem,
    });

    if (error) {
      throw new Error('Não foi possível cadastrar o produto.');
    }
  }

  async atualizarProduto(
    id: string,
    dadosProduto: Partial<ProdutoFormulario>,
    urlImagem?: string,
  ): Promise<void> {
    const cliente = this.supabaseService.obterCliente();
    const atualizacao: Record<string, unknown> = { ...dadosProduto };
    if (urlImagem) {
      atualizacao['url_imagem'] = urlImagem;
    }

    const { error } = await cliente
      .from('produtos')
      .update(atualizacao)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Não foi possível atualizar o produto.');
    }
  }

  async excluirProduto(id: string): Promise<void> {
    const cliente = this.supabaseService.obterCliente();
    const { error } = await cliente.from('produtos').delete().eq('id', id);

    if (error) {
      // 23503 = violação de chave estrangeira: o produto já tem pedidos
      // registrados em itens_pedido, então o banco recusa apagar a linha
      // (isso quebraria o histórico de pedidos já feitos).
      if (error.code === '23503') {
        throw new Error(
          'Este produto já tem pedidos registrados e não pode ser excluído. Edite o produto e desmarque "Produto disponível" em vez de excluir.',
        );
      }
      throw new Error('Não foi possível excluir o produto.');
    }
  }
}
