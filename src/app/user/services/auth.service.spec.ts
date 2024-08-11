import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
  });

  // const httpTesting = TestBed.inject(HttpTestingController);

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a login method', () => {
    expect(service.login).toBeDefined();
  });
});
