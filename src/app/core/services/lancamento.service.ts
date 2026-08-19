import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Lancamento } from '../models/lancamento.model';
import { LANCAMENTOS_MOCK } from '../mocks/lancamento.mock';

@Injectable({ providedIn: 'root' })
export class LancamentoService {
  private readonly lancamentos = signal<Lancamento[]>(structuredClone(LANCAMENTOS_MOCK));
  private proximoId = Math.max(...LANCAMENTOS_MOCK.map((l) => l.idLancamento)) + 1;

  listarPorLote(idLote: number): Observable<Lancamento[]> {
    const resultado = this.lancamentos().filter((l) => l.idLote === idLote);
    return of(resultado).pipe(delay(400));
  }

  incluir(lancamento: Omit<Lancamento, 'idLancamento'>): Observable<Lancamento> {
    const novo: Lancamento = { ...lancamento, idLancamento: this.proximoId++ };
    this.lancamentos.update((atual) => [...atual, novo]);
    return of(novo).pipe(delay(400));
  }

  alterar(lancamento: Lancamento): Observable<Lancamento> {
    this.lancamentos.update((atual) =>
      atual.map((l) => (l.idLancamento === lancamento.idLancamento ? lancamento : l))
    );
    return of(lancamento).pipe(delay(400));
  }

  excluir(idLancamento: number): Observable<void> {
    this.lancamentos.update((atual) => atual.filter((l) => l.idLancamento !== idLancamento));
    return of(undefined).pipe(delay(400));
  }

  contarPorLote(idLote: number): number {
    return this.lancamentos().filter((l) => l.idLote === idLote).length;
  }
}
