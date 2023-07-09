import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MainPageComponent} from './main-page.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {ApisCallerService} from "../apis-caller.service";
import {PaginationTransferService} from "../pagination/service/pagination-transfer.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {SearchProductsPageableRequest} from "../product/dto/request/search-products-pageable-request";
import {SearchPageableResponse} from "../product/dto/response/search-pageable-response";
import {Product} from "../product/entity/product";
import {of, throwError} from "rxjs";
import {CreateProductComponent} from "../product/modals/create-product/create-product.component";
import {UpdateProductComponent} from "../product/modals/update-product/update-product.component";
import {DeleteProductComponent} from "../product/modals/delete-product/delete-product.component";
import {ProductDetailComponent} from "../product/modals/product-detail/product-detail.component";
import any = jasmine.any;


describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let mockDialog: MatDialog;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;
  let mockService: ApisCallerService;
  let firstPageOfFe = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainPageComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        PaginationTransferService,
        ApisCallerService,
        MatDialog,
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    mockDialog = TestBed.inject(MatDialog);
    mockService = TestBed.inject(ApisCallerService);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('search products with pageable should not be called for invalid request with negative page', () => {
    let mockInvalidRequest = new SearchProductsPageableRequest();
    mockInvalidRequest.pageable.page = -1;
    spyOn(mockService, "findAllProducts");

    component.searchProductsPageable(mockInvalidRequest);

    expect(mockService.findAllProducts).not.toHaveBeenCalled();
  });

  it('search products with pageable should not be called for invalid request with negative size', () => {
    let mockInvalidRequest = new SearchProductsPageableRequest();
    mockInvalidRequest.pageable.size = -1;
    spyOn(mockService, "findAllProducts");

    component.searchProductsPageable(mockInvalidRequest);

    expect(mockService.findAllProducts).not.toHaveBeenCalled();
  });

  it('search products with pageable should not be called for invalid request with null request', () => {
    let mockInvalidRequest: any = null;
    spyOn(mockService, "findAllProducts");

    component.searchProductsPageable(mockInvalidRequest);

    expect(mockService.findAllProducts).not.toHaveBeenCalled();
  });

  it('search products with pageable should call findAllProducts for valid request', () => {
    let mockRequest = new SearchProductsPageableRequest();
    mockRequest.pageable.size = 1;
    mockRequest.pageable.page = 1;
    let expectedRequest = mockRequest;
    let mockResponse = new SearchPageableResponse<Product>();
    mockResponse.totalElements = 1;
    spyOn(mockService, "findAllProducts").and.returnValue(of(mockResponse));

    component.searchProductsPageable(mockRequest);

    expect(mockService.findAllProducts).toHaveBeenCalledOnceWith(expectedRequest);
    expect(component.totalElements).toEqual(mockResponse.totalElements);
  });

  it('search products with pageable should call findAllProducts for valid request and handler for error response', () => {
    let mockRequest = new SearchProductsPageableRequest();
    mockRequest.pageable.size = 1;
    mockRequest.pageable.page = 1;
    let expectedRequest = mockRequest;
    let expectedErrorResponse = new Error("Error message");
    spyOn(mockService, "findAllProducts").and.returnValue(throwError(expectedErrorResponse));

    component.searchProductsPageable(mockRequest);

    expect(mockService.findAllProducts).toHaveBeenCalledOnceWith(expectedRequest);
  });

  it('open create modal and after close it do not save the entity', () => {
    spyOn(mockDialog, "open").and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(null));

    component.openCreateModal();

    expect(mockDialog.open).toHaveBeenCalledOnceWith(CreateProductComponent);
    expect(mockDialogRef.afterClosed).toHaveBeenCalledOnceWith();
  });

  it('open create modal and after close it do save the entity and no need for new page and is not on the last page', () => {
    spyOn(mockDialog, "open").and.returnValue(mockDialogRef);
    let mockEntityToBeSaved = new Product();
    component.totalElements = 9;
    component.pageSize = 10;
    component.currentPage = 0;
    for (let index = 1; index <= component.totalElements; index++) {
      component.products.push(new Product());
    }
    mockDialogRef.afterClosed.and.returnValue(of(mockEntityToBeSaved));
    spyOn(mockService, "findAllProducts");

    component.openCreateModal();

    expect(mockDialog.open).toHaveBeenCalledOnceWith(CreateProductComponent);
    expect(mockDialogRef.afterClosed).toHaveBeenCalledOnceWith();
    expect(mockService.findAllProducts).not.toHaveBeenCalled();
    let numberOfNewCreatedProducts = 10;
    expect(component.products.length).toEqual(numberOfNewCreatedProducts);
  });

  it('open create modal and after close it do save the entity and need for new page', () => {
    spyOn(mockDialog, "open").and.returnValue(mockDialogRef);
    let mockEntityToBeSaved = new Product();
    component.totalElements = 10;
    component.pageSize = 10;
    component.currentPage = 0;
    for (let index = 1; index <= component.totalElements; index++) {
      component.products.push(new Product());
    }
    mockDialogRef.afterClosed.and.returnValue(of(mockEntityToBeSaved));
    let mockResponse = new SearchPageableResponse<Product>();
    mockResponse.totalElements = 11;
    mockResponse.content = component.products;
    mockResponse.content.push(mockEntityToBeSaved);
    spyOn(mockService, "findAllProducts").and.returnValue(of(mockResponse));

    component.openCreateModal();

    expect(mockDialog.open).toHaveBeenCalledOnceWith(CreateProductComponent);
    expect(mockDialogRef.afterClosed).toHaveBeenCalledOnceWith();
    expect(mockService.findAllProducts).toHaveBeenCalledOnceWith(any(SearchProductsPageableRequest));
    let numberOfNewCreatedProducts = 11;
    expect(component.products.length).toEqual(numberOfNewCreatedProducts);
  });

  it('open edit modal and after close it do not update the entity', () => {
    spyOn(mockDialog, "open").and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(null));
    let entityToBeUpdated = new Product();

    component.openEditModal(entityToBeUpdated);

    expect(mockDialog.open).toHaveBeenCalledOnceWith(UpdateProductComponent, {
      data: {
        name: entityToBeUpdated.name,
        price: entityToBeUpdated.price,
        quantity: entityToBeUpdated.quantity,
        id: entityToBeUpdated.id
      }
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalledOnceWith();
  });

  it('open edit modal and after close it do update the entity', () => {
    spyOn(mockDialog, "open").and.returnValue(mockDialogRef);
    let mockEntityUpdatedResponse = new Product();
    mockEntityUpdatedResponse.id = 1;
    mockEntityUpdatedResponse.name = "Adidas";
    mockEntityUpdatedResponse.price = 100;
    mockEntityUpdatedResponse.quantity = 1;
    mockDialogRef.afterClosed.and.returnValue(of(mockEntityUpdatedResponse));
    let entityToBeUpdated = new Product();
    entityToBeUpdated.id = 1;
    component.products = [entityToBeUpdated];

    component.openEditModal(entityToBeUpdated);

    expect(mockDialog.open).toHaveBeenCalledOnceWith(UpdateProductComponent, {
      data: {
        name: entityToBeUpdated.name,
        price: entityToBeUpdated.price,
        quantity: entityToBeUpdated.quantity,
        id: entityToBeUpdated.id
      }
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalledOnceWith();
    expect(component.products[0]).toEqual(mockEntityUpdatedResponse);
  });
  it('open delete modal and after close it do not delete the entity', () => {
    spyOn(mockDialog, "open").and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(false));
    let entityToBeDeleted = new Product();

    component.openDeleteModal(entityToBeDeleted);

    expect(mockDialog.open).toHaveBeenCalledOnceWith(DeleteProductComponent, {
      data: {
        name: entityToBeDeleted.name,
        price: entityToBeDeleted.price,
        quantity: entityToBeDeleted.quantity,
        id: entityToBeDeleted.id
      }
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalledOnceWith();
  });

  it('open delete modal and after close it do delete the entity', () => {
    spyOn(mockDialog, "open").and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(true));
    let entityToBeDeleted = new Product();
    entityToBeDeleted.name = "Adibas";
    entityToBeDeleted.quantity = 10;
    component.totalElements = 15;

    setFirstPageForFeAndSizeOfTen();
    setProductsForModal(entityToBeDeleted);

    component.openDeleteModal(entityToBeDeleted);

    expect(mockDialog.open).toHaveBeenCalledOnceWith(DeleteProductComponent, {
      data: {
        name: entityToBeDeleted.name,
        price: entityToBeDeleted.price,
        quantity: entityToBeDeleted.quantity,
        id: entityToBeDeleted.id
      }
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalledOnceWith();
    let expectedNumberOfProductsAfterDeletion = 14;
    expect(component.totalElements).toEqual(expectedNumberOfProductsAfterDeletion);
  });

  it('open delete modal and after close it do delete the entity and remake the view of products', () => {
    spyOn(mockDialog, "open").and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(true));
    let entityToBeDeleted = new Product();
    entityToBeDeleted.name = "Adibas";
    entityToBeDeleted.quantity = 10;
    component.totalElements = 11;
    setFirstPageForFeAndSizeOfTen();
    setProductsForModal(entityToBeDeleted);

    component.openDeleteModal(entityToBeDeleted);

    expect(mockDialog.open).toHaveBeenCalledOnceWith(DeleteProductComponent, {
      data: {
        name: entityToBeDeleted.name,
        price: entityToBeDeleted.price,
        quantity: entityToBeDeleted.quantity,
        id: entityToBeDeleted.id
      }
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalledOnceWith();
    let expectedNumberOfProductsAfterDeletion = 10;
    expect(component.totalElements).toEqual(expectedNumberOfProductsAfterDeletion);
  });

  it('open product details modal', () => {
    spyOn(mockDialog, "open").and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(false));
    let entityProductDetails = new Product();
    const config = new MatDialogConfig();
    config.data = {
      name: entityProductDetails.name,
      price: entityProductDetails.price,
      quantity: entityProductDetails.quantity,
      id: entityProductDetails.id,
      images: entityProductDetails.images
    };

    component.getProductDetails(entityProductDetails);

    expect(mockDialog.open).toHaveBeenCalledOnceWith(ProductDetailComponent, config);
  });

  function setProductsForModal(entityToBeDeleted: Product) {
    for (let index = 1; index <= component.totalElements; index++) {
      entityToBeDeleted.id = index;
      component.products = [entityToBeDeleted];
    }
  }

  function setFirstPageForFeAndSizeOfTen() {
    component.currentPage = firstPageOfFe;
    component.pageSize = 10;
  }

});
