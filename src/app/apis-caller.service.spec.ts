import { TestBed } from '@angular/core/testing';

import { ApisCallerService } from './apis-caller.service';

describe('ApisCallerService', () => {
  let service: ApisCallerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApisCallerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
