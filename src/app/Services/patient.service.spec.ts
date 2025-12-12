import { TestBed } from '@angular/core/testing';

import { PacienteService } from './patient.service';

describe('PacienteService', () => {
  let service: PacienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacienteService);
  });

  it('should be created', () => {
    //@ts-ignore
    expect(service).toBeTruthy();
  });
});
