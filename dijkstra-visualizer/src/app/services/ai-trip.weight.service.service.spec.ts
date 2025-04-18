import { TestBed } from '@angular/core/testing';

import { AiTripWeightServiceService } from './ai-trip.weight.service.service';

describe('AiTripWeightServiceService', () => {
  let service: AiTripWeightServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiTripWeightServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
