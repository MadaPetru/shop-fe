import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CreateProductComponent} from "../product/modals/create-product/create-product.component";
import {HttpClient} from "@angular/common/http";
import {Product} from "../product/entity/product";
import {ApisCallerService} from "../apis-caller.service";
import {UpdateProductModalComponent} from "../product/modals/update-product-modal/update-product-modal.component";
import {DeleteProductModalComponent} from "../product/modals/delete-product-modal/delete-product-modal.component";
import {ProductDetailComponent} from "../product/modals/product-detail/product-detail.component";
import {SearchProductsPageableRequest} from "../product/dto/request/search-products-pageable-request";
import {PageableRequest} from "../common/dto/request/pageable-request";
import {PaginationTransferService} from "../pagination/service/pagination-transfer.service";
import {SearchPageableResponse} from "../product/dto/response/search-pageable-response";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private dialogRef: MatDialog, private http: HttpClient, private service: ApisCallerService, private paginationTransferService: PaginationTransferService) {
    this.searchProductsFromPagination();
  }

  products: Product[] = [];
  searchProductPageableRequest: SearchProductsPageableRequest = new SearchProductsPageableRequest();
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  isProduction: boolean = false;

  ngOnInit(): void {
    this.isProduction = environment.production;
    this.searchProductPageableRequest = this.buildDefaultSearchProductsPageableRequest();
    this.searchProductsPageable(this.searchProductPageableRequest);
  }

  searchProductsPageable(request: SearchProductsPageableRequest) {
    if (this.searchProductsRequestIsValid(request)) {
      this.service.findAllProducts(request).subscribe(
        (response: SearchPageableResponse<Product>) => {
          this.copyValuesFromResponse(response);
        }
      );
    }
  }

  openCreateModel(): void {

    let createProductMatDialogRef = this.dialogRef.open(CreateProductComponent);
    createProductMatDialogRef.afterClosed().subscribe((response: Product) => {
      if (response != null) {
        this.createProduct(response);
      }
    });
  }

  openEditModal(product: Product): void {

    let updateProductMatDialogRef = this.dialogRef.open(UpdateProductModalComponent, {
      data: {
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        id: product.id
      }
    });
    updateProductMatDialogRef.afterClosed().subscribe((response: Product) => {
      if (response != null) {
        this.updateProduct(product, response);
      }
    });


  }

  openDeleteModal(product: Product): void {
    let deleteModalDialogRef = this.dialogRef.open(DeleteProductModalComponent, {
      data: {
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        id: product.id,
      }
    });
    deleteModalDialogRef.afterClosed().subscribe((deletedSuccessfully: boolean) => {
      if (deletedSuccessfully) {
        this.deleteProduct(product);
      }
    });
  }

  getProductDetails(product: Product): void {
    const config = new MatDialogConfig();
    config.data = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      id: product.id,
      images: product.images
    }
    this.dialogRef.open(ProductDetailComponent, config)
  }

  private updateProduct(product: Product, response: Product) {
    let indexProductToBeUpdated = this.products.indexOf(product);
    this.products[indexProductToBeUpdated] = response;
  }

  private deleteProduct(product: Product) {
    this.totalElements--;
    let lastPageOfElements = this.getLastPageOfElements();
    if (this.isNoNeedToDeletePageAfterDeletionOfProduct(lastPageOfElements)) {
      this.removeProductFromTheList(product);
    } else {
      if (this.isNeedToDeletePageAfterDeletionOfProduct()) {
        this.updateSearchProductPageableRequestAfterOnePageMinus();
      }
      this.searchProductsPageable(this.searchProductPageableRequest);
    }
  }

  private createProduct(response: Product) {
    this.totalElements++;
    let lastPageOfElements = this.getLastPageOfElements();
    if (this.isNewPageNeededAfterCreationOfProduct()) {
      this.searchProductsPageable(this.searchProductPageableRequest);
      return;
    }
    if (this.isNotNeededNewPageAfterCreationOfProduct(lastPageOfElements)) {
      this.products.push(response);
    }
  }


  private copyValuesFromResponse(response: SearchPageableResponse<Product>) {
    this.products = response.content;
    this.totalElements = response.totalElements;
    this.totalPages = response.totalPages;
    this.currentPage = response.pageable.pageNumber;
    this.pageSize = response.pageable.pageSize;
  }

  private removeProductFromTheList(product: Product) {
    let indexStartOfProducts = this.products.indexOf(product);
    let deleteCountFromStartIndex = 1;
    this.products.splice(indexStartOfProducts, deleteCountFromStartIndex);
  }

  private updateSearchProductPageableRequestAfterOnePageMinus() {
    this.currentPage--;
    if (this.currentPage < 0) this.currentPage = 0;
    this.searchProductPageableRequest.pageable.page = this.currentPage;
  }

  private isNeedToDeletePageAfterDeletionOfProduct() {
    return this.totalElements % this.pageSize == 0;
  }

  private isNoNeedToDeletePageAfterDeletionOfProduct(lastPageOfElements: number) {
    return lastPageOfElements == this.currentPage && this.totalElements % this.pageSize != 0;
  }

  private buildDefaultSearchProductsPageableRequest() {
    let pageRequest = new PageableRequest();
    pageRequest.page = this.currentPage;
    pageRequest.size = this.pageSize;
    pageRequest.sortDirection = "ASC";
    let request = new SearchProductsPageableRequest();
    request.pageable = pageRequest;
    return request;
  }

  private searchProductsFromPagination() {
    this.paginationTransferService.createdSearchRequest.subscribe((searchProductsPageableRequest: SearchProductsPageableRequest) => {
      this.searchProductPageableRequest = this.getSearchProductPageableRequestAfterValidations(searchProductsPageableRequest);
      this.searchProductsPageable(this.searchProductPageableRequest);
    });
  }

  private getSearchProductPageableRequestAfterValidations(searchProductsPageableRequest: SearchProductsPageableRequest) {
    let maxPageAfterSearch = this.getLastPageOfElementsForSearchRequest(searchProductsPageableRequest);
    let currentPage = this.currentPage;
    if (currentPage > maxPageAfterSearch) {
      searchProductsPageableRequest.pageable.page = maxPageAfterSearch;
    }
    return searchProductsPageableRequest;
  }

  private searchProductsRequestIsValid(request: SearchProductsPageableRequest) {
    let valid: boolean = true;
    if (request == null || (request.pageable.page == 0 && request.pageable.size == 0)) valid = false;
    return valid;
  }

  private isNotNeededNewPageAfterCreationOfProduct(lastPageOfElements: number) {
    return lastPageOfElements == this.currentPage && this.totalElements % this.pageSize != 1;
  }

  private isNewPageNeededAfterCreationOfProduct() {
    return this.totalElements % this.pageSize == 1;
  }

  private getLastPageOfElements() {
    let lastPageOfElements = Math.floor(this.totalElements / this.pageSize);
    if (this.totalElements % this.pageSize == 0) lastPageOfElements--;
    return lastPageOfElements;
  }

  private getLastPageOfElementsForSearchRequest(request: SearchProductsPageableRequest) {
    let lastPageOfElements = Math.floor(this.totalElements / request.pageable.size);
    if (this.totalElements % request.pageable.size == 0) lastPageOfElements--;
    return lastPageOfElements;
  }
}