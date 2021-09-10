import { TestBed } from '@angular/core/testing';

import { KeycloakAuthGuard } from './keycloak-auth.guard';

describe('KeycloakAuthGuard', () => {
  let guard: KeycloakAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(KeycloakAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
