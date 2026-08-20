import { FormBuilder } from '@angular/forms';
import { faixaValidaValidator } from './filtro-lotes.validators';

describe('faixaValidaValidator', () => {
  const fb = new FormBuilder();

  function criarGrupo(valores: Partial<Record<string, unknown>> = {}) {
    return fb.group({
      idLoteDe: [valores['idLoteDe'] ?? null],
      idLoteAte: [valores['idLoteAte'] ?? null],
      valorLoteDe: [valores['valorLoteDe'] ?? null],
      valorLoteAte: [valores['valorLoteAte'] ?? null],
      dataEntradaDe: [valores['dataEntradaDe'] ?? null],
      dataEntradaAte: [valores['dataEntradaAte'] ?? null],
    });
  }

  it('deve retornar null quando nenhuma faixa está invertida', () => {
    const grupo = criarGrupo({ idLoteDe: 1, idLoteAte: 10 });
    expect(faixaValidaValidator(grupo)).toBeNull();
  });

  it('deve retornar erro idLoteFaixaInvalida quando De > Até', () => {
    const grupo = criarGrupo({ idLoteDe: 10, idLoteAte: 1 });
    expect(faixaValidaValidator(grupo)).toEqual({ idLoteFaixaInvalida: true });
  });

  it('deve retornar null quando os campos de faixa estão vazios', () => {
    expect(faixaValidaValidator(criarGrupo())).toBeNull();
  });
});
