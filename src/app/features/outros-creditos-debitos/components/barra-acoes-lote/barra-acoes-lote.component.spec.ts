import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraAcoesLoteComponent } from './barra-acoes-lote.component';

describe('BarraAcoesLoteComponent', () => {
  let component: BarraAcoesLoteComponent;
  let fixture: ComponentFixture<BarraAcoesLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraAcoesLoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraAcoesLoteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
