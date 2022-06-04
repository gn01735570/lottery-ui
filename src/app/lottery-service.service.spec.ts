import { TestBed } from '@angular/core/testing';

import { LotteryServiceService } from './lottery-service.service';

describe('LotteryServiceService', () => {
  let service: LotteryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotteryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
