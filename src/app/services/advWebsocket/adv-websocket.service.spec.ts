import { TestBed } from '@angular/core/testing';

import { AdvWebsocketService } from './adv-websocket.service';

describe('AdvWebsocketService', () => {
  let service: AdvWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
