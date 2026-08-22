import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacaoService } from '../servicos/autenticacao.service';

// Bloqueia o acesso a rotas que exigem usuário logado (cliente ou admin).
export const autenticadoGuard: CanActivateFn = () => {
  const autenticacaoService = inject(AutenticacaoService);
  const router = inject(Router);

  if (autenticacaoService.estaAutenticado()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
