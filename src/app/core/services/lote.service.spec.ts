import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { LoteService } from './lote.service';
import { SituacaoLote } from '../models/lote.model';

describe('LoteService', () => {
  let service: LoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoteService);
  });

  it('deve retornar apenas lotes com a situação filtrada', async () => {
    const resposta = await firstValueFrom(
      service.pesquisar({ situacaoLote: SituacaoLote.Aberto }, { first: 0, rows: 100 })
    );
    expect(resposta.data.every((lote) => lote.situacaoLote === SituacaoLote.Aberto)).toBe(true);
  });

  it('deve paginar corretamente, respeitando first e rows', async () => {
    const resposta = await firstValueFrom(service.pesquisar({}, { first: 0, rows: 5 }));
    expect(resposta.data.length).toBe(5);
    expect(resposta.totalRecords).toBeGreaterThan(5);
  });

  it('deve atualizar quantLancamentos do lote correto', async () => {
    service.atualizarQuantLancamentos(1, 99);
    const resposta = await firstValueFrom(service.pesquisar({ idLoteDe: 1, idLoteAte: 1 }, { first: 0, rows: 10 }));
    expect(resposta.data[0].quantLancamentos).toBe(99);
  });
});
