import {TestBed} from '@angular/core/testing';

import {PaginationTransferService} from './pagination-transfer.service';

describe('PaginationTransferService', () => {
  let service: PaginationTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set request', () => {
    let request = {};

    service.setRequest(request);

    expect(service.createdSearchRequest).not.toBeGreaterThan(0);
  });
});
