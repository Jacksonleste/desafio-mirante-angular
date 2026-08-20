import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HISTORICO_OPTIONS, PA_OPTIONS, INSTITUICAO_OPTIONS } from '../mocks/select-options.mock';

@Injectable({ providedIn: 'root' })
export class OpcoesFormularioService {
  listarHistoricos(): Observable<string[]> {
    return of(HISTORICO_OPTIONS).pipe(delay(200));
  }

  listarPA(): Observable<string[]> {
    return of(PA_OPTIONS).pipe(delay(200));
  }

  listarInstituicoes(): Observable<{ codigo: string; descricao: string }[]> {
    return of(INSTITUICAO_OPTIONS).pipe(delay(200));
  }
}
