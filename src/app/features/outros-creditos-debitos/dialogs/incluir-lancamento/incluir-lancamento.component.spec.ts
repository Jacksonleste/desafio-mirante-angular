import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncluirLancamentoComponent } from './incluir-lancamento.component';

describe('IncluirLancamentoComponent - validação do formulário', () => {
  let component: IncluirLancamentoComponent;
  let fixture: ComponentFixture<IncluirLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [IncluirLancamentoComponent] }).compileComponents();
    fixture = TestBed.createComponent(IncluirLancamentoComponent);
    component = fixture.componentInstance;
    component.idLote = 1;
    fixture.detectChanges();
  });

  it('deve iniciar inválido, com os campos obrigatórios vazios', () => {
    expect(component.form.valid).toBe(false);
  });

  it('deve ficar válido quando os campos obrigatórios são preenchidos', () => {
    component.form.controls.contaCorrente.patchValue({
      contaCorrente: '04404',
      nomeTitular: 'José Carlos Ferreira',
      valor: 100,
      historico: 'Lançamento Manual',
      documento: 'DOC-TESTE',
    });
    component.form.controls.documentoCsc.patchValue({
      pa: 'Cooperativa',
      complHistorico: 'Teste',
    });

    expect(component.form.valid).toBe(true);
  });
});
