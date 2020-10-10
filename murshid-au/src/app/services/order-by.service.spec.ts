import { TestBed } from '@angular/core/testing';

import { OrderByService } from './order-by.service';

describe('OrderByService', () => {
  let service: OrderByService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderByService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
