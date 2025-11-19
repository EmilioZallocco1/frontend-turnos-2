import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObraSocialFormComponent } from './obra-social-form.component';

describe('ObraSocialFormComponent', () => {
  let component: ObraSocialFormComponent;
  let fixture: ComponentFixture<ObraSocialFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObraSocialFormComponent]
    });
    fixture = TestBed.createComponent(ObraSocialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
