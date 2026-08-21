import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador customizado: garante que os valores "De" não sejam
 * maiores que os valores "Até" em cada uma das três faixas do filtro.
 * @param control - O controle de formulário que contém os campos a serem validados.
 * @returns - Retorna um objeto de erros de validação se houver faixas inválidas, ou null se todas as faixas forem válidas.
 */
export function faixaValidaValidator(control: AbstractControl): ValidationErrors | null {
  const grupo = control;
  const erros: Record<string, boolean> = {};

  const idDe = grupo.get('idLoteDe')?.value;
  const idAte = grupo.get('idLoteAte')?.value;
  if (idDe != null && idAte != null && idDe > idAte) {
    erros['idLoteFaixaInvalida'] = true;
  }

  const valorDe = grupo.get('valorLoteDe')?.value;
  const valorAte = grupo.get('valorLoteAte')?.value;
  if (valorDe != null && valorAte != null && valorDe > valorAte) {
    erros['valorLoteFaixaInvalida'] = true;
  }

  const dataDe: Date | null = grupo.get('dataEntradaDe')?.value;
  const dataAte: Date | null = grupo.get('dataEntradaAte')?.value;
  if (dataDe && dataAte && dataDe > dataAte) {
    erros['dataEntradaFaixaInvalida'] = true;
  }

  return Object.keys(erros).length > 0 ? erros : null;
}
