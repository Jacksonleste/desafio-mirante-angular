export enum SituacaoLote {
  Aberto = 'Aberto',
  Enviado = 'Enviado',
  Confirmado = 'Confirmado',
}

export interface Lote {
  idLote: number;
  instituicaoResp: string;
  instituicao: string;
  dataEntrada: Date;
  valor: number;
  quantLancamentos: number;
  usuarioRegistro: string;
  usuarioAprovacao: string | null;
  situacaoLote: SituacaoLote;
  dataHoraSituacaoLote: Date;
}

export interface FiltroLotePesquisa {
  instituicaoResp?: string;
  instituicao?: string;
  situacaoLote?: SituacaoLote | 'Todas';
  idLoteDe?: number;
  idLoteAte?: number;
  valorLoteDe?: number;
  valorLoteAte?: number;
  dataEntradaDe?: Date;
  dataEntradaAte?: Date;
}
