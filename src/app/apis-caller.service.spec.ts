import {TestBed} from '@angular/core/testing';

import {ApisCallerService} from './apis-caller.service';
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('ApisCallerService', () => {
  let service: ApisCallerService;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  let request: any;

  beforeEach(() => {
    const spyHttpClient = jasmine.createSpyObj('HttpClient', ['post', 'put', 'delete']);
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{provide: HttpClient, useValue: spyHttpClient}]
    });
    service = TestBed.inject(ApisCallerService);
    mockHttpClient = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create product should call save api', () => {
    service.saveProduct(request);

    expect(mockHttpClient.post).toHaveBeenCalled();
  });

  it('edit product should call update api', () => {
    service.updateProduct(request);

    expect(mockHttpClient.put).toHaveBeenCalled();
  });

  it('delete product should call delete api', () => {
    service.deleteProduct(request);

    expect(mockHttpClient.delete).toHaveBeenCalled();
  });

  it('get products pageable should call get api', () => {
    service.findAllProducts(request);

    expect(mockHttpClient.post).toHaveBeenCalled();
  });
});
