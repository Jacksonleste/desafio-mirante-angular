import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroLotesComponent } from '../../components/filtro-lotes/filtro-lotes.component';
import { BarraAcoesLoteComponent } from '../../components/barra-acoes-lote/barra-acoes-lote.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ColumnDef } from '../../../../shared/components/data-table/column-def.model';
import { PaginacaoRequest } from '../../../../shared/models/paginacao.model';
import { Lote, FiltroLotePesquisa } from '../../../../core/models/lote.model';
import { LoteService } from '../../../../core/services/lote.service';
import { IncluirLancamentoComponent } from '../../dialogs/incluir-lancamento/incluir-lancamento.component';
import { LancamentoService } from '../../../../core/services/lancamento.service';
import { Lancamento } from '../../../../core/models/lancamento.model';

@Component({
  selector: 'app-consulta-lotes',
  standalone: true,
  imports: [
    CommonModule,
    FiltroLotesComponent,
    BarraAcoesLoteComponent,
    DataTableComponent,
    IncluirLancamentoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './consulta-lotes.component.html',
})
export class ConsultaLotesComponent {
  private readonly loteService = inject(LoteService);
  private readonly lancamentoService = inject(LancamentoService);

  readonly lotes = signal<Lote[]>([]);
  readonly totalRecords = signal(0);
  readonly loading = signal(false);
  readonly selecionados = signal<Lote[]>([]);

  private filtroAtual: FiltroLotePesquisa = {};
  private paginacaoAtual: PaginacaoRequest = { first: 0, rows: 5 };

  readonly umLoteSelecionado = computed(() => this.selecionados().length === 1);

  readonly modalVisivel = signal(false);
  readonly loteSelecionadoParaIncluir = signal<number | null>(null);

  readonly columns: ColumnDef<Lote>[] = [
    { field: 'idLote', header: 'ID Lote' },
    { field: 'dataEntrada', header: 'Data Entrada', type: 'date' },
    { field: 'valor', header: 'Valor', type: 'currency' },
    { field: 'quantLancamentos', header: 'Quant. Lançamentos' },
    { field: 'usuarioRegistro', header: 'Usuário Registro' },
    { field: 'usuarioAprovacao', header: 'Usuário Aprovação' },
    { field: 'situacaoLote', header: 'Situação Lote' },
    { field: 'dataHoraSituacaoLote', header: 'Data/Hora Situação Lote', type: 'date' },
  ];

  constructor() {
    this.buscarLotes();
  }

  onPesquisar(filtro: FiltroLotePesquisa): void {
    this.filtroAtual = filtro;
    this.paginacaoAtual = { first: 0, rows: this.paginacaoAtual.rows };
    this.buscarLotes();
  }

  onPageChange(paginacao: PaginacaoRequest): void {
    this.paginacaoAtual = paginacao;
    this.buscarLotes();
  }

  onSelectionChange(selecao: Lote[]): void {
    this.selecionados.set(selecao);
  }

  onIncluir(): void {
    const lote = this.selecionados()[0];
    if (!lote) return;
    this.loteSelecionadoParaIncluir.set(lote.idLote);
    this.modalVisivel.set(true);
  }

  onAlterar(): void {
    console.log('Alterar', this.selecionados());
  }
  onExcluir(): void {
    console.log('Excluir', this.selecionados());
  }
  onVisualizar(): void {
    console.log('Visualizar', this.selecionados());
  }
  onConfirmar(): void {
    console.log('Confirmar');
  }
  onEnviar(): void {
    console.log('Enviar');
  }
  onVisualizarJustificativa(): void {
    console.log('Visualizar Justificativa');
  }

  private buscarLotes(): void {
    this.loading.set(true);
    this.loteService.pesquisar(this.filtroAtual, this.paginacaoAtual).subscribe((resposta) => {
      this.lotes.set(resposta.data);
      this.totalRecords.set(resposta.totalRecords);
      this.loading.set(false);
    });
  }

  onLancamentoConfirmado(lancamento: Omit<Lancamento, 'idLancamento'>): void {
    this.lancamentoService.incluir(lancamento).subscribe(() => {
      const quantidade = this.lancamentoService.contarPorLote(lancamento.idLote);
      this.loteService.atualizarQuantLancamentos(lancamento.idLote, quantidade);
      this.modalVisivel.set(false);
      this.buscarLotes(); // rebusca pra refletir o quantLancamentos atualizado na tabela
    });
  }
}
