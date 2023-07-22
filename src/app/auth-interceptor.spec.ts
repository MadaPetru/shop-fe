import {TestBed} from '@angular/core/testing';
import {AuthInterceptor} from "./auth-interceptor";
import {HttpHandler, HttpRequest} from "@angular/common/http";
import {CommonModule} from "@angular/common";

describe('AuthInterceptor', () => {
  let authInterceptor: AuthInterceptor;
  let httpHandler: HttpHandler;

  beforeEach(() => {
    const spyAuthInterceptor = jasmine.createSpyObj("AuthInterceptor", ['intercept']);
    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [{provide: AuthInterceptor, value: spyAuthInterceptor}
      ]
    });
    authInterceptor = TestBed.inject(AuthInterceptor);
    httpHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
  });

  it('should add Authorization header if jwt is present in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('test-jwt');
    const httpRequest = new HttpRequest('GET', '/test');
    const request = new HttpRequest('GET', '/test');
    let expectedRequest = request.clone({
      headers: request.headers.set("Authorization",
        "Bearer " + 'test-jwt')
    });

    authInterceptor.intercept(httpRequest, httpHandler);

    expect(httpHandler.handle).toHaveBeenCalledWith(expectedRequest);
  })
  ;

  it('should not add Authorization header if jwt is not present in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const httpRequest = new HttpRequest('GET', '/test');

    authInterceptor.intercept(httpRequest, httpHandler);

    expect(httpHandler.handle).toHaveBeenCalledWith(httpRequest);
  });

})
;
