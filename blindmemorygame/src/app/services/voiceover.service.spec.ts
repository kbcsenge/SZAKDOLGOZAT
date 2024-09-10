import { TestBed } from '@angular/core/testing';

import { VoiceoverService } from './voiceover.service';

describe('VoiceoverService', () => {
  let service: VoiceoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
