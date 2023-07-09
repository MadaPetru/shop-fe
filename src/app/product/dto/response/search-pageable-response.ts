import {PageableResponse} from "../../../common/dto/request/pageable-response";

export class SearchPageableResponse<T>{
  content : T[] = [];
  last: boolean = false;
  totalPages: number = 0;
  totalElements: number = 0;
  size: number = 0;
  number: number = 0;
  first: boolean = true;
  numberOfElements: number = 0;
  empty: boolean = false;
  pageable: PageableResponse = new PageableResponse();
}
