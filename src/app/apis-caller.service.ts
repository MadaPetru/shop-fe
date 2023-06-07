import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Product} from "./product/entity/product";
import {Observable} from "rxjs";
import {CreateProductRequest} from "./product/dto/request/create-product-request";
import {UpdateProductRequest} from "./product/dto/request/update-product-request";
import {SearchProductsPageableRequest} from "./product/dto/request/search-products-pageable-request";
import {SearchPageableResponse} from "./product/dto/response/search-pageable-response";
import {ProductResponse} from "./product/dto/response/product-response";

@Injectable({
  providedIn: 'root'
})
export class ApisCallerService {

  constructor(private http: HttpClient) {
  }

  saveProduct(request: CreateProductRequest):Observable<ProductResponse> {
    return this.http.post<ProductResponse>(environment.url + '/products', request);
  }

  updateProduct(request: UpdateProductRequest):Observable<ProductResponse> {
    return this.http.put<ProductResponse>(environment.url + '/products', request);
  }

  findAllProducts(request: SearchProductsPageableRequest): Observable<SearchPageableResponse<Product>> {
    return this.http.post<any>(environment.url + '/products/search', request);
  }

  deleteProduct(id: string):Observable<boolean> {
   return  this.http.delete<boolean>(environment.url + '/products/' + id);
  }
}
