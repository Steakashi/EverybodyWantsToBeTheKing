import { TestBed } from '@angular/core/testing';

import { LobbyQueriesService } from './lobby-queries.service';

describe('LobbyService', () => {
  let service: LobbyQueriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LobbyQueriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
