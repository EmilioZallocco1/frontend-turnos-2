import { TestBed } from '@angular/core/testing';

import { ObraSocialServiceService } from './obra-social-service.service';

describe('ObraSocialServiceService', () => {
  let service: ObraSocialServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObraSocialServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
