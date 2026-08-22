import { Injectable, signal } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { SupabaseService } from './supabase.service';
import { Usuario, UsuarioLogado } from '../modelos/usuario.model';

const CHAVE_ARMAZENAMENTO = 'usuarioLogado';

// Serviço de autenticação própria: valida login contra a tabela "usuarios"
// do Supabase (sem usar o Supabase Auth nativo), comparando a senha
// informada com o hash salvo no banco.
@Injectable({
  providedIn: 'root',
})
export class AutenticacaoService {
  // signal com o usuário logado (ou null se não houver sessão ativa)
  usuarioLogado = signal<UsuarioLogado | null>(this.recuperarUsuarioSalvo());

  constructor(private supabaseService: SupabaseService) {}

  private recuperarUsuarioSalvo(): UsuarioLogado | null {
    const dados = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    return dados ? (JSON.parse(dados) as UsuarioLogado) : null;
  }

  async entrar(
    email: string,
    senha: string
  ): Promise<{ sucesso: boolean; mensagemErro?: string }> {
    const cliente = this.supabaseService.obterCliente();

    const { data, error } = await cliente
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      return { sucesso: false, mensagemErro: 'Erro ao consultar usuário.' };
    }

    if (!data) {
      return { sucesso: false, mensagemErro: 'E-mail ou senha inválidos.' };
    }

    const usuarioEncontrado = data as Usuario;
    const senhaConfere = await bcrypt.compare(
      senha,
      usuarioEncontrado.senha_hash
    );

    if (!senhaConfere) {
      return { sucesso: false, mensagemErro: 'E-mail ou senha inválidos.' };
    }

    const usuarioLogado: UsuarioLogado = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
      tipo_usuario: usuarioEncontrado.tipo_usuario,
    };

    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(usuarioLogado));
    this.usuarioLogado.set(usuarioLogado);

    return { sucesso: true };
  }

  async cadastrar(
    nome: string,
    email: string,
    senha: string
  ): Promise<{ sucesso: boolean; mensagemErro?: string }> {
    const cliente = this.supabaseService.obterCliente();
    const senhaHash = await bcrypt.hash(senha, 10);

    const { error } = await cliente.from('usuarios').insert({
      nome,
      email,
      senha_hash: senhaHash,
      tipo_usuario: 'cliente',
    });

    if (error) {
      return { sucesso: false, mensagemErro: 'Não foi possível cadastrar. O e-mail já pode estar em uso.' };
    }

    return { sucesso: true };
  }

  sair(): void {
    localStorage.removeItem(CHAVE_ARMAZENAMENTO);
    this.usuarioLogado.set(null);
  }

  estaAutenticado(): boolean {
    return this.usuarioLogado() !== null;
  }

  ehAdmin(): boolean {
    return this.usuarioLogado()?.tipo_usuario === 'admin';
  }
}
