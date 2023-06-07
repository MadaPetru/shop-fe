import {Component, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {ApisCallerService} from "../apis-caller.service";
import {SearchProductsPageableRequest} from "../product/dto/request/search-products-pageable-request";
import {PaginationTransferService} from "./service/pagination-transfer.service";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  /** The total number of records */
  @Input()
  collectionSize = 0;

  /** The number of records to display */
  @Input()
  @Output()
  pageSize = 10;

  /** Current page */
  @Input()
  @Output()
  currentPage = 1;

  /** The number of buttons to show either side of the current page */
  @Input()
  maxSize = 3;

  /** Display the First/Last buttons */
  @Input()
  firstLastButtons = true;

  /** Display the Next/Previous buttons */
  @Input()
  nextPreviousButtons = true;

  /** Display small pagination buttons */
  @Input()
  small = false;

  @Input()
  totalPages: number = 0;
  pages: any[] = [];

  constructor(private service: ApisCallerService, private paginationTransferService: PaginationTransferService) {
  }

  ngOnInit(): void {
    this.pages = new Array(this.totalPages);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.pages = new Array(this.totalPages);
  }

  selectPageNumber(pageNumber: number) {
    if (pageNumber == this.currentPage) return;
    this.currentPage = pageNumber;
    let request = new SearchProductsPageableRequest();
    request.pageable.page = this.currentPage - 1;
    request.pageable.size = this.pageSize;
    this.paginationTransferService.setRequest(request);
  }

  next() {
    const nextPage = this.currentPage + 1;
    nextPage <= this.pages.length && this.selectPageNumber(nextPage);
  }

  previous() {
    const previousPage = this.currentPage - 1;
    previousPage >= 1 && this.selectPageNumber(previousPage);
  }

  searchWithDifferentPageSize(): void {
    let request = new SearchProductsPageableRequest();
    request.pageable.page = this.currentPage - 1;
    request.pageable.size = this.pageSize;
    this.paginationTransferService.setRequest(request);
  }
}
