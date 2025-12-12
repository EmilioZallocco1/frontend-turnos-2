import { TestBed } from '@angular/core/testing';

import { EspecialidadService } from './specialty.service';

describe('EspecialidadService', () => {
  let service: EspecialidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecialidadService);
  });

  it('should be created', () => {
    //@ts-ignore
    expect(service).toBeTruthy();
  });
});
