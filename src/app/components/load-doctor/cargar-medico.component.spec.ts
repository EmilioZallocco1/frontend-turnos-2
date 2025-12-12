import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarMedicoComponent } from './cargar-medico.component';

describe('CargarMedicoComponent', () => {
  let component: CargarMedicoComponent;
  let fixture: ComponentFixture<CargarMedicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargarMedicoComponent]
    });
    fixture = TestBed.createComponent(CargarMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
