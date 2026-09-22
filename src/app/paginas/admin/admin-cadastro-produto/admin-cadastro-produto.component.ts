import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../../compartilhado/componentes/cabecalho/cabecalho.component';
import { ProdutoService } from '../../../nucleo/servicos/produto.service';
import { ProdutoFormulario } from '../../../nucleo/modelos/produto.model';

@Component({
  selector: 'app-admin-cadastro-produto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CabecalhoComponent],
  templateUrl: './admin-cadastro-produto.component.html',
  styleUrl: './admin-cadastro-produto.component.css',
})
export class AdminCadastroProdutoComponent implements OnInit {
  produtoId: string | null = null;
  modoEdicao = false;

  dadosFormulario: ProdutoFormulario = {
    nome: '',
    descricao: '',
    preco: 0,
    preco_antigo: null,
    quantidade_estoque: 0,
    disponivel: true,
  };

  arquivoImagemSelecionado: File | null = null;
  urlPreviewImagem: string | null = null;

  salvando = false;
  mensagemErro = '';

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.produtoId = this.route.snapshot.paramMap.get('id');

    if (this.produtoId) {
      this.modoEdicao = true;
      const produtoExistente = await this.produtoService.buscarProdutoPorId(
        this.produtoId
      );

      if (produtoExistente) {
        this.dadosFormulario = {
          nome: produtoExistente.nome,
          descricao: produtoExistente.descricao,
          preco: produtoExistente.preco,
          preco_antigo: produtoExistente.preco_antigo ?? null,
          quantidade_estoque: produtoExistente.quantidade_estoque,
          disponivel: produtoExistente.disponivel,
        };
        this.urlPreviewImagem = produtoExistente.url_imagem;
      }
    }
  }

  aoSelecionarImagem(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];

    if (!arquivo) {
      return;
    }

    this.arquivoImagemSelecionado = arquivo;
    this.urlPreviewImagem = URL.createObjectURL(arquivo);
  }

  async salvarProduto(): Promise<void> {
    this.mensagemErro = '';

    if (!this.modoEdicao && !this.arquivoImagemSelecionado) {
      this.mensagemErro = 'Selecione uma imagem para o produto.';
      return;
    }

    this.salvando = true;

    try {
      let urlImagem: string | undefined;

      if (this.arquivoImagemSelecionado) {
        urlImagem = await this.produtoService.enviarImagemProduto(
          this.arquivoImagemSelecionado
        );
      }

      if (this.modoEdicao && this.produtoId) {
        await this.produtoService.atualizarProduto(
          this.produtoId,
          this.dadosFormulario,
          urlImagem
        );
      } else {
        await this.produtoService.criarProduto(
          this.dadosFormulario,
          urlImagem as string
        );
      }

      this.router.navigate(['/admin/produtos']);
    } catch (erro) {
      this.mensagemErro = (erro as Error).message;
    } finally {
      this.salvando = false;
    }
  }
}
