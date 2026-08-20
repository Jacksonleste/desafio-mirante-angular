import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncluirLancamentoComponent } from './incluir-lancamento.component';

describe('IncluirLancamentoComponent', () => {
  let component: IncluirLancamentoComponent;
  let fixture: ComponentFixture<IncluirLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncluirLancamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncluirLancamentoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
