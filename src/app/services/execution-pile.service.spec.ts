import { TestBed } from '@angular/core/testing';

import { ExecutionPileService } from './execution-pile.service';

describe('ExecutionPileService', () => {
  let service: ExecutionPileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionPileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
