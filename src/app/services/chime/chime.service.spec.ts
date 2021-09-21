import { TestBed } from '@angular/core/testing';

import { ChimeService } from './chime.service';

describe('ChimeService', () => {
  let service: ChimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
