import { TestBed } from '@angular/core/testing';

import { ACompleteService } from './autocomplete.service';

describe('ACompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ACompleteService = TestBed.get(ACompleteService);
    expect(service).toBeTruthy();
  });
});
