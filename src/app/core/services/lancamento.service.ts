import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Lancamento } from '../models/lancamento.model';
import { LANCAMENTOS_MOCK } from '../mocks/lancamento.mock';

@Injectable({ providedIn: 'root' })
export class LancamentoService {
  private readonly lancamentos = signal<Lancamento[]>(structuredClone(LANCAMENTOS_MOCK));
  private proximoId = Math.max(...LANCAMENTOS_MOCK.map((l) => l.idLancamento)) + 1;

  /**
   * Lista os lançamentos de um determinado lote.
   * @param idLote - O ID do lote para o qual listar os lançamentos.
   * @returns - Retorna um Observable que emite a lista de lançamentos do lote, após um atraso simulado de 400ms.
   */
  listarPorLote(idLote: number): Observable<Lancamento[]> {
    const resultado = this.lancamentos().filter((l) => l.idLote === idLote);
    return of(resultado).pipe(delay(400));
  }

  /**
   * Inclui um novo lançamento.
   * @param lancamento - Os dados do lançamento a ser incluído.
   * @returns - Retorna um Observable que emite o lançamento incluído, após um atraso simulado de 400ms.
   */
  incluir(lancamento: Omit<Lancamento, 'idLancamento'>): Observable<Lancamento> {
    const novo: Lancamento = { ...lancamento, idLancamento: this.proximoId++ };
    this.lancamentos.update((atual) => [...atual, novo]);
    return of(novo).pipe(delay(400));
  }

  /**
   * Altera um lançamento existente.
   * @param lancamento - Os dados do lançamento a ser alterado.
   * @returns - Retorna um Observable que emite o lançamento alterado, após um atraso simulado de 400ms.
   */
  alterar(lancamento: Lancamento): Observable<Lancamento> {
    this.lancamentos.update((atual) =>
      atual.map((l) => (l.idLancamento === lancamento.idLancamento ? lancamento : l)),
    );
    return of(lancamento).pipe(delay(400));
  }

  /**
   * Exclui um lançamento existente.
   * @param idLancamento - O ID do lançamento a ser excluído.
   * @returns - Retorna um Observable que emite void, após um atraso simulado de 400ms.
   */
  excluir(idLancamento: number): Observable<void> {
    this.lancamentos.update((atual) => atual.filter((l) => l.idLancamento !== idLancamento));
    return of(undefined).pipe(delay(400));
  }

  /**
   * Conta a quantidade de lançamentos associados a um determinado lote.
   * @param idLote - O ID do lote para o qual contar os lançamentos.
   * @returns - Retorna o número de lançamentos associados ao lote.
   */
  contarPorLote(idLote: number): number {
    return this.lancamentos().filter((l) => l.idLote === idLote).length;
  }
}
