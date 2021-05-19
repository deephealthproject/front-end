import { AppConfigService } from './config.service';
import { TestBed } from '@angular/core/testing';

describe('AppConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    expect(service).toBeTruthy();
  });
});