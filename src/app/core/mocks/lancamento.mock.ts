import { Lancamento } from '../models/lancamento.model';
import { LOTES_MOCK } from './lote.mock';
import { CONTAS_CORRENTE_MOCK } from './conta-corrente.mock';
import { HISTORICO_OPTIONS, PA_OPTIONS } from './select-options.mock';

/**
 * Mesmo gerador pseudo-aleatório com seed fixa (LCG simples) usado em `lote.mock.ts`, duplicado
 * aqui de propósito com uma seed diferente (7) — assim os lançamentos têm sua própria sequência
 * determinística, independente da usada para gerar os lotes.
 * @param seed valor inicial que determina toda a sequência gerada
 * @returns função que produz o próximo número pseudo-aleatório entre 0 e 1 a cada chamada
 */
function criarGeradorSeed(seed: number) {
  let estado = seed;
  return () => {
    estado = (estado * 1103515245 + 12345) & 0x7fffffff;
    return estado / 0x7fffffff;
  };
}

const aleatorio = criarGeradorSeed(7);

/** Sorteia um item da lista usando o gerador seedado, em vez de `Math.random()`. */
function escolher<T>(lista: readonly T[]): T {
  return lista[Math.floor(aleatorio() * lista.length)];
}

/** Sorteia um número dentro do intervalo `[min, max]`, arredondado a 2 casas — usado para o valor do lançamento. */
function numeroEntre(min: number, max: number): number {
  return Math.round((min + aleatorio() * (max - min)) * 100) / 100;
}

/** Contador incremental compartilhado por todos os lançamentos gerados, pra garantir IDs únicos. */
let proximoId = 1;

/**
 * Lançamentos fictícios derivados dos lotes mock: cada lote gera exatamente `quantLancamentos`
 * lançamentos, então a contagem bate com o que a tela de lotes mostra. Alguns campos simulam
 * variação real do domínio — 10% de chance de ser estorno, 50% de ter `idEvento`, 40% de ter
 * `idDocCsc` — pra exercitar os casos opcionais do formulário sem precisar de dados reais.
 */
export const LANCAMENTOS_MOCK: Lancamento[] = LOTES_MOCK.flatMap((lote) =>
  Array.from({ length: lote.quantLancamentos }, () => {
    const conta = escolher(CONTAS_CORRENTE_MOCK);
    const id = proximoId++;

    return {
      idLancamento: id,
      idLote: lote.idLote,
      contaCorrente: conta.numero,
      nomeTitular: conta.titular,
      valor: numeroEntre(80, Math.max(lote.valor / lote.quantLancamentos, 100)),
      historico: escolher(HISTORICO_OPTIONS),
      estorno: aleatorio() < 0.1,
      documento: `DOC-2026-${String(id).padStart(4, '0')}`,
      descricao: 'Lançamento gerado automaticamente para simulação de dados.',
      situacaoConta: 'Pendente' as const,
      pa: escolher(PA_OPTIONS),
      idEvento: aleatorio() < 0.5 ? '102' : undefined,
      complHistorico: 'Lançamento vinculado ao processamento do lote correspondente.',
      idDocCsc: aleatorio() < 0.4 ? `CSC-${80000 + id}` : undefined,
      situacaoCsc: 'Aguardando Processamento CCO' as const,
    };
  })
);
