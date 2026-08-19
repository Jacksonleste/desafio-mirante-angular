export interface PaginacaoRequest {
  first: number;
  rows: number;
}

export interface PaginacaoResponse<T> {
  data: T[];
  totalRecords: number;
}
