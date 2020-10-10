import { TestBed } from '@angular/core/testing';

import { SelectorsService } from './selectors.service';

describe('SelectorsService', () => {
  let service: SelectorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
