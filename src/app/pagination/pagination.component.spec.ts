import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PaginationComponent} from './pagination.component';
import {ApisCallerService} from "../apis-caller.service";
import {PaginationTransferService} from "./service/pagination-transfer.service";
import {HttpClientModule} from "@angular/common/http";
import {SearchProductsPageableRequest} from "../product/dto/request/search-products-pageable-request";

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let mockPaginationTransferService: PaginationTransferService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      providers: [
        ApisCallerService, PaginationTransferService
      ],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    mockPaginationTransferService = TestBed.inject(PaginationTransferService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set for ngOnChanges', () => {
    component.pages = [1, 2, 3, 4];
    let changes: any = new Object(1);
    changes.currentPage = 1;
    component.ngOnChanges(changes)

    expect(component.pages.length).toEqual(0);
  });

  it('select same page number that user is current in should do nothing', () => {
    component.currentPage = 1;
    spyOn(mockPaginationTransferService, "setRequest");

    component.selectPageNumber(1);

    expect(mockPaginationTransferService.setRequest).not.toHaveBeenCalled();
  });

  it('select same other page number that user is current in should make the api call', () => {
    component.currentPage = 20;
    component.pageSize = 100;
    let expectedRequest = new SearchProductsPageableRequest();
    expectedRequest.pageable.size = 100;
    expectedRequest.pageable.page = 22;//In be the page number request is made with -1
    expectedRequest.pageable.sortProperty = 'id';
    expectedRequest.pageable.sortDirection = 'ASC';
    spyOn(mockPaginationTransferService, "setRequest");

    let pageNumberSelected = 23;
    component.selectPageNumber(pageNumberSelected);

    expect(mockPaginationTransferService.setRequest).toHaveBeenCalledOnceWith(expectedRequest);
  });

  it('next page button available if is not the last page', () => {
    component.currentPage = 1;
    component.pages = [1, 2];
    spyOn(component, "selectPageNumber");

    component.next();

    let nextPageNumber = 2;
    expect(component.selectPageNumber).toHaveBeenCalledOnceWith(nextPageNumber);
  });

  it('next page button not available if is the last page', () => {
    component.currentPage = 2;
    component.pages = [1, 2];
    spyOn(component, "selectPageNumber");

    component.next();

    expect(component.selectPageNumber).not.toHaveBeenCalled();
  });

  it('previous page button available if is not the first page', () => {
    component.currentPage = 2;
    spyOn(component, "selectPageNumber");

    component.previous();

    let nextPageNumber = 1;
    expect(component.selectPageNumber).toHaveBeenCalledOnceWith(nextPageNumber);
  });

  it('previous page button not available if is the first page', () => {
    component.currentPage = 1;
    spyOn(component, "selectPageNumber");

    component.previous();

    expect(component.selectPageNumber).not.toHaveBeenCalled();
  });

  it('search with different page size should call the transfer service', () => {
    component.currentPage = 1;
    component.pageSize = 100;
    let expectedRequest = new SearchProductsPageableRequest();
    expectedRequest.pageable.size = 100;
    expectedRequest.pageable.page = 0;
    expectedRequest.pageable.sortDirection = 'ASC';
    expectedRequest.pageable.sortProperty = 'id';
    spyOn(mockPaginationTransferService, "setRequest");

    component.searchWithDifferentPageSize();

    expect(mockPaginationTransferService.setRequest).toHaveBeenCalledOnceWith(expectedRequest);
  });
});
