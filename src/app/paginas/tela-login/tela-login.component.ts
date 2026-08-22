import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';

@Component({
  selector: 'app-tela-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tela-login.component.html',
  styleUrl: './tela-login.component.css',
})
export class TelaLoginComponent {
  email = '';
  senha = '';
  carregando = false;
  mensagemErro = '';

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {}

  async entrar(): Promise<void> {
    this.mensagemErro = '';
    this.carregando = true;

    const resultado = await this.autenticacaoService.entrar(
      this.email,
      this.senha
    );

    this.carregando = false;

    if (!resultado.sucesso) {
      this.mensagemErro = resultado.mensagemErro ?? 'Erro ao entrar.';
      return;
    }

    const usuario = this.autenticacaoService.usuarioLogado();
    if (usuario?.tipo_usuario === 'admin') {
      this.router.navigate(['/admin/produtos']);
    } else {
      this.router.navigate(['/produtos']);
    }
  }
}
