import { TestBed } from '@angular/core/testing';

import { ChallangeService } from './challange.service';

describe('ChallangeService', () => {
  let service: ChallangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChallangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
