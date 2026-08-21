import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FiltroLotePesquisa, Lote } from '../models/lote.model';
import { PaginacaoRequest, PaginacaoResponse } from '../../shared/models/paginacao.model';
import { LOTES_MOCK } from '../mocks/lote.mock';

@Injectable({ providedIn: 'root' })
export class LoteService {
  private readonly lotes = signal<Lote[]>(structuredClone(LOTES_MOCK));

  /**
   * Pesquisa lotes com base em filtros e paginação.
   * @param filtro - Os critérios de filtro para a pesquisa de lotes.
   * @param paginacao - Os parâmetros de paginação, incluindo o índice inicial e o número de registros por página.
   * @returns - Retorna um Observable que emite um objeto contendo os lotes filtrados e o total de registros encontrados, após um atraso simulado de 600ms.
   */
  pesquisar(
    filtro: FiltroLotePesquisa,
    paginacao: PaginacaoRequest
  ): Observable<PaginacaoResponse<Lote>> {
    const filtrados = this.aplicarFiltro(this.lotes(), filtro);
    const pagina = filtrados.slice(paginacao.first, paginacao.first + paginacao.rows);

    return of({ data: pagina, totalRecords: filtrados.length }).pipe(delay(600));
  }

  /**
   * Atualiza a quantidade de lançamentos associados a um determinado lote.
   * @param idLote - O ID do lote para o qual atualizar a quantidade de lançamentos.
   * @param quantidade - A nova quantidade de lançamentos.
   */
  atualizarQuantLancamentos(idLote: number, quantidade: number): void {
    this.lotes.update((lotes) =>
      lotes.map((l) => (l.idLote === idLote ? { ...l, quantLancamentos: quantidade } : l))
    );
  }

  /**
   * Aplica os filtros fornecidos a uma lista de lotes.
   * @param lotes - A lista de lotes a ser filtrada.
   * @param filtro -  Os critérios de filtro a serem aplicados.
   * @returns - Retorna a lista de lotes filtrada.
   */
  private aplicarFiltro(lotes: Lote[], filtro: FiltroLotePesquisa): Lote[] {
    return lotes.filter((lote) => {
      if (filtro.instituicaoResp && !lote.instituicaoResp.includes(filtro.instituicaoResp)) return false;
      if (filtro.instituicao && !lote.instituicao.includes(filtro.instituicao)) return false;
      if (filtro.situacaoLote && filtro.situacaoLote !== 'Todas' && lote.situacaoLote !== filtro.situacaoLote) return false;
      if (filtro.idLoteDe != null && lote.idLote < filtro.idLoteDe) return false;
      if (filtro.idLoteAte != null && lote.idLote > filtro.idLoteAte) return false;
      if (filtro.valorLoteDe != null && lote.valor < filtro.valorLoteDe) return false;
      if (filtro.valorLoteAte != null && lote.valor > filtro.valorLoteAte) return false;
      if (filtro.dataEntradaDe && lote.dataEntrada < filtro.dataEntradaDe) return false;
      if (filtro.dataEntradaAte && lote.dataEntrada > filtro.dataEntradaAte) return false;
      return true;
    });
  }
}
