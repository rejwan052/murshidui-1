import { TestBed } from '@angular/core/testing';

import { UseNastaliqService } from './use-nastaliq.service';

describe('UseNastaliqService', () => {
  let service: UseNastaliqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UseNastaliqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
