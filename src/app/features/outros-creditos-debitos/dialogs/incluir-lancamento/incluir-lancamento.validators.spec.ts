import { FormBuilder } from '@angular/forms';
import { contaLocalizadaValidator } from './incluir-lancamento.validators';

describe('contaLocalizadaValidator', () => {
  const fb = new FormBuilder();

  it('deve retornar erro quando a conta foi digitada mas o titular não foi localizado', () => {
    const grupo = fb.group({ contaCorrente: ['04404'], nomeTitular: [''] });
    expect(contaLocalizadaValidator(grupo)).toEqual({ contaNaoLocalizada: true });
  });

  it('deve retornar null quando a conta foi localizada', () => {
    const grupo = fb.group({ contaCorrente: ['04404'], nomeTitular: ['José Carlos Ferreira'] });
    expect(contaLocalizadaValidator(grupo)).toBeNull();
  });

  it('deve retornar null quando nenhuma conta foi digitada ainda', () => {
    const grupo = fb.group({ contaCorrente: [''], nomeTitular: [''] });
    expect(contaLocalizadaValidator(grupo)).toBeNull();
  });
});
