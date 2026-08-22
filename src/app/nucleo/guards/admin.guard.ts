import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacaoService } from '../servicos/autenticacao.service';

// Bloqueia o acesso às rotas administrativas para usuários
// que não sejam do tipo "admin".
export const adminGuard: CanActivateFn = () => {
  const autenticacaoService = inject(AutenticacaoService);
  const router = inject(Router);

  if (autenticacaoService.estaAutenticado() && autenticacaoService.ehAdmin()) {
    return true;
  }

  router.navigate(['/produtos']);
  return false;
};
