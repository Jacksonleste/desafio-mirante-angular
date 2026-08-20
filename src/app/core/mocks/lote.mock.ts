import { Lote, SituacaoLote } from '../models/lote.model';

/** Nomes de instituições fictícias, sorteados tanto para a instituição respondente quanto para a instituição do lote. */
const INSTITUICOES = [
  '0001 - COOPERATIVA CENTRAL',
  '0002 - SICOOB CENTRAL',
  '0003 - SICOOB VALE',
  '0004 - SICOOB NORTE',
  '0005 - SICOOB SUL',
];

/** Logins fictícios (no padrão usuário + matrícula do sistema real) usados como usuário de registro/aprovação. */
const USUARIOS = [
  'jsilva0001_30', 'mferreira0002_15', 'amoraes0001_22', 'pgomes0001_18',
  'rteixeira0004_11', 'lcardoso0001_09', 'fbarros0002_44', 'gsantos0001_30',
];

/** Situações sorteáveis para os lotes mock — cobrem os três valores do enum `SituacaoLote`. */
const SITUACOES: SituacaoLote[] = [SituacaoLote.Aberto, SituacaoLote.Enviado, SituacaoLote.Confirmado];

/**
 * Gerador pseudo-aleatório com seed fixa (LCG simples). Preferido a `Math.random()` aqui porque
 * garante os mesmos dados mock a cada execução e a cada teste — sem isso, testes que dependem de
 * valores específicos do mock ficariam "flaky".
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

/** Instância compartilhada do gerador seedado usada por todo este arquivo (seed 42, arbitrária). */
const aleatorio = criarGeradorSeed(42);

/** Sorteia um item da lista usando o gerador seedado, em vez de `Math.random()`. */
function escolher<T>(lista: readonly T[]): T {
  return lista[Math.floor(aleatorio() * lista.length)];
}

/** Sorteia um número dentro do intervalo `[min, max]`, arredondado a 2 casas — usado para valores monetários. */
function numeroEntre(min: number, max: number): number {
  return Math.round((min + aleatorio() * (max - min)) * 100) / 100;
}

/**
 * Sorteia uma data até `diasAtras` dias antes de uma data-âncora fixa (não `new Date()` atual),
 * pra que o conjunto de dados mock não mude conforme os dias passam.
 */
function dataEntre(diasAtras: number): Date {
  const hoje = new Date('2026-08-19');
  const dias = Math.floor(aleatorio() * diasAtras);
  const data = new Date(hoje);
  data.setDate(data.getDate() - dias);
  return data;
}

/** Quantidade de lotes gerados para o mock — arbitrária, só precisa ser grande o suficiente pra exercitar a paginação. */
const TOTAL_LOTES = 32;

/**
 * Lotes fictícios gerados na carga do módulo. Algumas regras de negócio são simuladas de propósito:
 * lotes "Aberto" têm 15% de chance de não ter nenhum lançamento ainda, e só recebem `usuarioAprovacao`
 * quando saem do estado "Aberto" (refletindo que a aprovação ainda não ocorreu).
 */
export const LOTES_MOCK: Lote[] = Array.from({ length: TOTAL_LOTES }, (_, i) => {
  const idLote = i + 1;
  const situacaoLote = escolher(SITUACOES);
  const loteVazio = situacaoLote === SituacaoLote.Aberto && aleatorio() < 0.15;
  const quantLancamentos = loteVazio ? 0 : Math.floor(numeroEntre(1, 5));
  const dataEntrada = dataEntre(45);
  const dataHoraSituacaoLote = new Date(
    dataEntrada.getTime() + Math.floor(aleatorio() * 3) * 86400000 + Math.floor(aleatorio() * 24) * 3600000
  );

  return {
    idLote,
    instituicaoResp: escolher(INSTITUICOES),
    instituicao: escolher(INSTITUICOES),
    dataEntrada,
    valor: numeroEntre(150, 45000),
    quantLancamentos,
    usuarioRegistro: escolher(USUARIOS),
    usuarioAprovacao: situacaoLote === SituacaoLote.Aberto ? null : escolher(USUARIOS),
    situacaoLote,
    dataHoraSituacaoLote,
  };
});
