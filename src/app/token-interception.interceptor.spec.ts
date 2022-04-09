import { TestBed } from '@angular/core/testing';

import { TokenInterceptionInterceptor } from './token-interception.interceptor';

describe('TokenInterceptionInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenInterceptionInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenInterceptionInterceptor = TestBed.inject(TokenInterceptionInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
