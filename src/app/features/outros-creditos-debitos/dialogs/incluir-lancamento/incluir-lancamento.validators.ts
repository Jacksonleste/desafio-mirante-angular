import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador customizado (cross-field): garante que, se o usuário digitou um
 * número de conta, ele precisa ter clicado em buscar E a conta precisa ter
 * sido localizada (nomeTitular preenchido) antes de poder confirmar.
 * @param group - O grupo de controles de formulário que contém os campos a serem validados.
 * @returns - Retorna um objeto de erros de validação se a conta não for localizada, ou null se a validação passar.
 */
export function contaLocalizadaValidator(group: AbstractControl): ValidationErrors | null {
  const contaCorrente = group.get('contaCorrente')?.value;
  const nomeTitular = group.get('nomeTitular')?.value;

  if (contaCorrente && !nomeTitular) {
    return { contaNaoLocalizada: true };
  }
  return null;
}
