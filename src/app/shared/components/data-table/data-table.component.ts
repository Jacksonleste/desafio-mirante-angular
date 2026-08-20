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

  get skeletonRows(): number[] {
    return Array.from({ length: this.rows });
  }

  onSelectionChange(novaSelecao: T[]): void {
    this.selectionChange.emit(novaSelecao);
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.pageChange.emit({ first: event.first ?? 0, rows: event.rows ?? this.rows });
  }

  valorMonetario(row: T, column: ColumnDef<T>): number {
    return row[column.field] as number;
  }

  valorData(row: T, column: ColumnDef<T>): Date {
    return row[column.field] as Date;
  }

  valorTexto(row: T, column: ColumnDef<T>): string | number {
    return row[column.field] as string | number;
  }
}
