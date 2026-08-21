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
  protected paginacaoAtual: PaginacaoRequest = { first: 0, rows: 10 };

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

  /**
   * Atualiza o filtro atual com os valores fornecidos e reinicia a paginação para a primeira página.
   * @param filtro - Objeto contendo os critérios de filtro para a pesquisa de lotes.
   * @returns void
   */
  onPesquisar(filtro: FiltroLotePesquisa): void {
    this.filtroAtual = filtro;
    this.paginacaoAtual = { first: 0, rows: this.paginacaoAtual.rows };
    this.buscarLotes();
  }

  /**
   * Atualiza a paginação atual e busca os lotes de acordo com o filtro e paginação atualizados.
   * @param paginacao - Objeto contendo os parâmetros de paginação (first e rows).
   * @returns void
   */
  onPageChange(paginacao: PaginacaoRequest): void {
    this.paginacaoAtual = paginacao;
    this.buscarLotes();
  }

  /**
   * Atualiza a seleção de lotes com base na seleção feita na tabela.
   * @param selecao - Array de lotes selecionados na tabela.
   * @returns void
   */
  onSelectionChange(selecao: Lote[]): void {
    this.selecionados.set(selecao);
  }

  /**
   * Abre o modal de inclusão de lançamento para o lote selecionado.
   * Se nenhum lote estiver selecionado, o modal não será aberto.
   * @returns void
   */
  onIncluir(): void {
    const lote = this.selecionados()[0];
    if (!lote) return;
    this.loteSelecionadoParaIncluir.set(lote.idLote);
    this.modalVisivel.set(true);
  }

  /**
   * Exibe os detalhes do lote selecionado para alteração.
   * @returns void
   */
  onAlterar(): void {
    console.log('Alterar', this.selecionados());
  }

  /**
   * Exclui o(s) lote(s) selecionado(s).
   * @returns void
   */
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

  /**
   * Busca os lotes de acordo com o filtro e paginação atuais, atualizando os sinais correspondentes.
   * Este método é chamado sempre que o filtro ou a paginação são alterados.
   * Ele também limpa a seleção atual de lotes.
   */
  private buscarLotes(): void {
    this.loading.set(true);
    this.lotes.set([]);
    this.selecionados.set([]);
    this.loteService.pesquisar(this.filtroAtual, this.paginacaoAtual).subscribe((resposta) => {
      this.lotes.set(resposta.data);
      this.totalRecords.set(resposta.totalRecords);
      this.loading.set(false);
    });
  }

  /**
   * Ao confirmar a inclusão de um lançamento, este método é chamado para incluir o lançamento no serviço de lançamentos.
   * Após a inclusão, ele atualiza a quantidade de lançamentos do lote correspondente e fecha o modal de inclusão.
   * Em seguida, ele busca novamente os lotes para refletir as alterações.
   * @param lancamento - O lançamento a ser incluído, sem o campo 'idLancamento' que será gerado pelo serviço.
   */
  onLancamentoConfirmado(lancamento: Omit<Lancamento, 'idLancamento'>): void {
    this.lancamentoService.incluir(lancamento).subscribe(() => {
      const quantidade = this.lancamentoService.contarPorLote(lancamento.idLote);
      this.loteService.atualizarQuantLancamentos(lancamento.idLote, quantidade);
      this.modalVisivel.set(false);
      this.buscarLotes();
    });
  }
}
