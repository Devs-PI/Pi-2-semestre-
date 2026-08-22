import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../../nucleo/servicos/autenticacao.service';
import { CarrinhoService } from '../../../nucleo/servicos/carrinho.service';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css',
})
export class CabecalhoComponent {
  constructor(
    public autenticacaoService: AutenticacaoService,
    public carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  iniciais(nome: string): string {
    return nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join('');
  }

  sair(): void {
    this.autenticacaoService.sair();
    this.router.navigate(['/login']);
  }
}
