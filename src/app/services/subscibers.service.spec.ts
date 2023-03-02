import { TestBed } from '@angular/core/testing';

import { SubscibersService } from './subscibers.service';

describe('SubscibersService', () => {
  let service: SubscibersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscibersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
