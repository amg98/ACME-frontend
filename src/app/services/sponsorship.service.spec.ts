import { TestBed } from '@angular/core/testing';

import { SponsorshipService } from './sponsorship.service';

describe('SponsorshipService', () => {
  let service: SponsorshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SponsorshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
