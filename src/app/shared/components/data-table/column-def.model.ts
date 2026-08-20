export type ColumnType = 'text' | 'number' | 'currency' | 'date' | 'custom';

export interface ColumnDef<T> {
  field: keyof T;
  header: string;
  type?: ColumnType;
  templateRef?: string;
  width?: string;
}
