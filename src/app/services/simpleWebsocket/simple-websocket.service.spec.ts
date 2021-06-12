import { TestBed } from '@angular/core/testing';

import { SimpleWebsocketService } from './simple-websocket.service';

describe('SimpleWebsocketService', () => {
  let service: SimpleWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
