import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaLotesComponent } from './consulta-lotes.component';
import { Lote, SituacaoLote } from '../../../../core/models/lote.model';

describe('ConsultaLotesComponent - regra de habilitação', () => {
  let component: ConsultaLotesComponent;
  let fixture: ComponentFixture<ConsultaLotesComponent>;

  function criarLoteMock(id: number): Lote {
    return {
      idLote: id, instituicaoResp: '0001', instituicao: '0002',
      dataEntrada: new Date(), valor: 100, quantLancamentos: 0,
      usuarioRegistro: 'teste', usuarioAprovacao: null,
      situacaoLote: SituacaoLote.Aberto, dataHoraSituacaoLote: new Date(),
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ConsultaLotesComponent] }).compileComponents();
    fixture = TestBed.createComponent(ConsultaLotesComponent);
    component = fixture.componentInstance;
  });

  it('deve estar desabilitado com 0 lotes selecionados', () => {
    component.selecionados.set([]);
    expect(component.umLoteSelecionado()).toBe(false);
  });

  it('deve estar habilitado com exatamente 1 lote selecionado', () => {
    component.selecionados.set([criarLoteMock(1)]);
    expect(component.umLoteSelecionado()).toBe(true);
  });

  it('deve estar desabilitado com 2 ou mais lotes selecionados', () => {
    component.selecionados.set([criarLoteMock(1), criarLoteMock(2)]);
    expect(component.umLoteSelecionado()).toBe(false);
  });
});
