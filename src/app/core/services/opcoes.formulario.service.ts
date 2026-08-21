import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HISTORICO_OPTIONS, PA_OPTIONS, INSTITUICAO_OPTIONS } from '../mocks/select-options.mock';

@Injectable({ providedIn: 'root' })
export class OpcoesFormularioService {
  /**
   * Lista os históricos disponíveis.
   * @returns - Retorna um Observable que emite a lista de históricos disponíveis, após um atraso simulado de 200ms.
   */
  listarHistoricos(): Observable<string[]> {
    return of(HISTORICO_OPTIONS).pipe(delay(200));
  }

  /**
   * Lista as opções de PA disponíveis.
   * @returns - Retorna um Observable que emite a lista de opções de PA disponíveis, após um atraso simulado de 200ms.
   */
  listarPA(): Observable<string[]> {
    return of(PA_OPTIONS).pipe(delay(200));
  }

  /**
   * Lista as instituições disponíveis.
   * @returns - Retorna um Observable que emite a lista de instituições disponíveis, após um atraso simulado de 200ms.
   */
  listarInstituicoes(): Observable<{ codigo: string; descricao: string }[]> {
    return of(INSTITUICAO_OPTIONS).pipe(delay(200));
  }
}
