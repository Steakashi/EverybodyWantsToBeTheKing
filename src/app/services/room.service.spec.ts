import { TestBed } from '@angular/core/testing';

import { Room } from './room.service';

describe('RoomService', () => {
  let service: Room;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Room);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
