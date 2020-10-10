import { TestBed } from '@angular/core/testing';

import { ScriptSelectionService } from './script-selection.service';

describe('ScriptSelectionService', () => {
  let service: ScriptSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
