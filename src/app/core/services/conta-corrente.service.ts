import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ContaCorrente } from '../models/conta-corrente.model';
import { CONTAS_CORRENTE_MOCK } from '../mocks/conta-corrente.mock';

@Injectable({ providedIn: 'root' })
export class ContaCorrenteService {
  /**
   * Busca uma conta corrente pelo número fornecido.
   * @param numero - O número da conta corrente a ser buscada.
   * @returns - Retorna um Observable que emite a conta corrente encontrada ou null se não for encontrada, após um atraso simulado de 500ms.
   */
  buscar(numero: string): Observable<ContaCorrente | null> {
    const encontrada = CONTAS_CORRENTE_MOCK.find((c) => c.numero === numero.trim()) ?? null;
    return of(encontrada).pipe(delay(500));
  }
}
