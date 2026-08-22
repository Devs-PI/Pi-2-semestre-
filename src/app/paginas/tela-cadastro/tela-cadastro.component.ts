import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';

@Component({
  selector: 'app-tela-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tela-cadastro.component.html',
  styleUrl: './tela-cadastro.component.css',
})
export class TelaCadastroComponent {
  nome = '';
  email = '';
  senha = '';
  carregando = false;
  mensagemErro = '';

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {}

  async criarConta(): Promise<void> {
    this.mensagemErro = '';
    this.carregando = true;

    const resultadoCadastro = await this.autenticacaoService.cadastrar(
      this.nome,
      this.email,
      this.senha
    );

    if (!resultadoCadastro.sucesso) {
      this.carregando = false;
      this.mensagemErro = resultadoCadastro.mensagemErro ?? 'Erro ao criar conta.';
      return;
    }

    const resultadoLogin = await this.autenticacaoService.entrar(
      this.email,
      this.senha
    );

    this.carregando = false;

    if (!resultadoLogin.sucesso) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/produtos']);
  }
}
