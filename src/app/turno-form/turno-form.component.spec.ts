import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoFormComponent } from './turno-form.component';

describe('TurnoFormComponent', () => {
  let component: TurnoFormComponent;
  let fixture: ComponentFixture<TurnoFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnoFormComponent]
    });
    fixture = TestBed.createComponent(TurnoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
