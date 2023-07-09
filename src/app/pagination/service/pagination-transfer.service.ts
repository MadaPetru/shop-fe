import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SearchProductsPageableRequest} from "../../product/dto/request/search-products-pageable-request";

@Injectable({
  providedIn: 'root'
})
export class PaginationTransferService {
  private searchRequest$ = new BehaviorSubject<SearchProductsPageableRequest>(new SearchProductsPageableRequest());
  createdSearchRequest = this.searchRequest$.asObservable();

  setRequest(searchRequest: any) {
    this.searchRequest$.next(searchRequest);
  }
}
