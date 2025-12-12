import { TestBed } from '@angular/core/testing';

import { MedicoService } from './doctor.service';

describe('MedicoService', () => {
  let service: MedicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicoService);
  });

  it('should be created', () => {
    //@ts-ignore
    expect(service).toBeTruthy();
  });
});
