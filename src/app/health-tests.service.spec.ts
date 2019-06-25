import { TestBed } from '@angular/core/testing';

import { HealthTestsService } from './health-tests.service';

describe('HealthTestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HealthTestsService = TestBed.get(HealthTestsService);
    expect(service).toBeTruthy();
  });
});
