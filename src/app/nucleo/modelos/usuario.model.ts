export type TipoUsuario = 'cliente' | 'admin';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  tipo_usuario: TipoUsuario;
  criado_em?: string;
}

// Formato usado para manter o usuário logado em memória/localStorage,
// sem expor a senha (nem o hash) fora do processo de autenticação.
export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario;
}
