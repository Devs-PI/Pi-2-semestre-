import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto } from '../../../nucleo/modelos/produto.model';

@Component({
  selector: 'app-cartao-produto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartao-produto.component.html',
  styleUrl: './cartao-produto.component.css',
})
export class CartaoProdutoComponent {
  @Input({ required: true }) produto!: Produto;
  @Output() adicionarAoCarrinho = new EventEmitter<Produto>();
}
