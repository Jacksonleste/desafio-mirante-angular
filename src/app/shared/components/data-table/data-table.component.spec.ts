import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { ColumnDef } from './column-def.model';
import { Lote, SituacaoLote } from '../../../core/models/lote.model';

function criarLoteMock(sobrescrever: Partial<Lote> = {}): Lote {
  return {
    idLote: 1,
    instituicaoResp: '0001',
    instituicao: '0002',
    dataEntrada: new Date('2026-08-10'),
    valor: 100,
    quantLancamentos: 1,
    usuarioRegistro: 'teste',
    usuarioAprovacao: null,
    situacaoLote: SituacaoLote.Aberto,
    dataHoraSituacaoLote: new Date('2026-08-10'),
    ...sobrescrever,
  };
}

describe('DataTableComponent', () => {
  let component: DataTableComponent<Lote>;
  let fixture: ComponentFixture<DataTableComponent<Lote>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent<Lote>);
    component = fixture.componentInstance;
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir selectionChange quando onSelectionChange é chamado', () => {
    const lote = criarLoteMock();
    let valorEmitido: Lote[] | undefined;

    component.selectionChange.subscribe((valor) => {
      valorEmitido = valor;
    });

    component.onSelectionChange([lote]);

    expect(valorEmitido).toEqual([lote]);
  });

  it('deve emitir pageChange com first e rows ao chamar onLazyLoad', () => {
    let emitido: { first: number; rows: number } | undefined;

    component.pageChange.subscribe((valor) => {
      emitido = valor;
    });

    component.onLazyLoad({ first: 20, rows: 10 } as any);

    expect(emitido).toEqual({ first: 20, rows: 10 });
  });

  it('valorMonetario deve retornar o valor numérico do campo configurado', () => {
    const lote = criarLoteMock({ valor: 250.5 });
    const coluna: ColumnDef<Lote> = { field: 'valor', header: 'Valor', type: 'currency' };

    const resultado = component.valorMonetario(lote, coluna);

    expect(resultado).toBe(250.5);
  });

  it('valorData deve retornar a data do campo configurado', () => {
    const data = new Date('2026-08-15');
    const lote = criarLoteMock({ dataEntrada: data });
    const coluna: ColumnDef<Lote> = { field: 'dataEntrada', header: 'Data Entrada', type: 'date' };

    const resultado = component.valorData(lote, coluna);

    expect(resultado).toBe(data);
  });
});
