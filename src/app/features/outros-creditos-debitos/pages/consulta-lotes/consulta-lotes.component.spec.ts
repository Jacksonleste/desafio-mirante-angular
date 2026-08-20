import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaLotesComponent } from './consulta-lotes.component';

describe('ConsultaLotesComponent', () => {
  let component: ConsultaLotesComponent;
  let fixture: ComponentFixture<ConsultaLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaLotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaLotesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });
});
