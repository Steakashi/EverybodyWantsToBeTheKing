import { TestBed } from '@angular/core/testing';

import { LobbyResponsesService } from './lobby-responses.service';

describe('ResponsesService', () => {
  let service: LobbyResponsesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LobbyResponsesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
