import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroLotesComponent } from './filtro-lotes.component';

describe('FiltroLotesComponent', () => {
  let component: FiltroLotesComponent;
  let fixture: ComponentFixture<FiltroLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroLotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroLotesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
