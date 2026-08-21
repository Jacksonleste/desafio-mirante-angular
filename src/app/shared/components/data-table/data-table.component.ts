import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PaginacaoRequest } from '../../models/paginacao.model';
import { ColumnDef } from './column-def.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule, SkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table.component.html',
})
export class DataTableComponent<T extends object> {
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) columns: ColumnDef<T>[] = [];
  @Input({ required: true }) dataKey!: keyof T & string;
  @Input() totalRecords = 0;
  @Input() rows = 10;
  @Input() first = 0;
  @Input() loading = false;
  @Input() selectionMode: 'single' | 'multiple' | null = 'multiple';
  @Input() selection: T[] = [];

  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() pageChange = new EventEmitter<PaginacaoRequest>();

  @ContentChild('customCell') customCellTemplate?: TemplateRef<{
    $implicit: T;
    column: ColumnDef<T>;
  }>;

  /**
   * Retorna um array de números representando as linhas do esqueleto de carregamento, com base no número de linhas configurado.
   * @returns - Retorna um array de números de 0 até (rows - 1), que é usado para renderizar o esqueleto de carregamento.
   */
  get skeletonRows(): number[] {
    return Array.from({ length: this.rows });
  }

  /**
   * Manipula a mudança de seleção no dataTable.
   * @param novaSelecao - O array de itens selecionados após a mudança de seleção.
   * @returns - Retorna void. Emite o evento `selectionChange` com a nova seleção de itens.
   */
  onSelectionChange(novaSelecao: T[]): void {
    this.selectionChange.emit(novaSelecao);
  }

  /**
   * Manipula o evento de carregamento preguiçoso (lazy load) do dataTable, emitindo um evento de mudança de página com os parâmetros de paginação.
   * @param event - O evento de carregamento preguiçoso.
   * @returns - Retorna void. Emite o evento `pageChange` com os parâmetros de paginação.
   */
  onLazyLoad(event: TableLazyLoadEvent): void {
    this.pageChange.emit({ first: event.first ?? 0, rows: event.rows ?? this.rows });
  }

  /**
   * Retorna o valor monetário de uma célula específica na tabela, com base na linha e na coluna fornecidas.
   * @param row - A linha de dados da tabela.
   * @param column - A definição da coluna da tabela.
   * @returns - Retorna o valor monetário da célula.
   */
  valorMonetario(row: T, column: ColumnDef<T>): number {
    return row[column.field] as number;
  }

  /**
   * Retorna o valor de data de uma célula específica na tabela, com base na linha e na coluna fornecidas.
   * @param row - A linha de dados da tabela.
   * @param column - A definição da coluna da tabela.
   * @returns - Retorna o valor de data da célula.
   */
  valorData(row: T, column: ColumnDef<T>): Date {
    return row[column.field] as Date;
  }

  /**
   * Retorna o valor de texto de uma célula específica na tabela, com base na linha e na coluna fornecidas.
   * @param row - A linha de dados da tabela.
   * @param column - A definição da coluna da tabela.
   * @returns - Retorna o valor de texto da célula.
   */
  valorTexto(row: T, column: ColumnDef<T>): string | number {
    return row[column.field] as string | number;
  }
}
