import { TestBed } from '@angular/core/testing';

import { TrafficModelService } from './traffic-model.service';

describe('TrafficModelService', () => {
  let service: TrafficModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrafficModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
