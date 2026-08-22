import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ambiente } from '../../../environments/environment';

// para toda a aplicação (banco de dados + storage de imagens).
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private cliente: SupabaseClient;

  constructor() {
    this.cliente = createClient(
      ambiente.ambienteUrlSupabase,
      ambiente.ambienteChaveSupabase,
    );
  }

  obterCliente(): SupabaseClient {
    return this.cliente;
  }
}
