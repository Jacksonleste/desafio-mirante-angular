export interface Lancamento {
  idLancamento: number;
  idLote: number;

  // Conta Corrente
  contaCorrente: string;
  nomeTitular?: string;
  valor: number;
  historico: string;
  estorno: boolean;
  documento: string;
  descricao?: string;
  situacaoConta: 'Pendente';

  // Documento CSC
  pa: string;
  idEvento?: string;
  complHistorico: string;
  idDocCsc?: string;
  situacaoCsc: 'Aguardando Processamento CCO';
}
