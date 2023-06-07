import { TestBed } from '@angular/core/testing';

import { PaginationTransferService } from './pagination-transfer.service';

describe('PaginationTransferService', () => {
  let service: PaginationTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
