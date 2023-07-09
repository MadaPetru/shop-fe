import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateProductComponent} from './update-product.component';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ApisCallerService} from "../../../apis-caller.service";
import {of} from "rxjs";
import {ProductResponse} from "../../dto/response/product-response";
import {UpdateProductRequest} from "../../dto/request/update-product-request";

describe('UpdateProductModalComponent', () => {
  let component: UpdateProductComponent;
  let fixture: ComponentFixture<UpdateProductComponent>;
  let mockHttpClient: HttpClient;
  let mockApiCallerService: ApisCallerService;
  let mockMatDialogRef: MatDialogRef<UpdateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      declarations: [UpdateProductComponent],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: jasmine.createSpy('close')
        }
      }, ApisCallerService,
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockApiCallerService = TestBed.inject(ApisCallerService);
    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockHttpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.close();

    expect(mockMatDialogRef.close).toHaveBeenCalledOnceWith();
  });

  it('on file selected should not save images if there do not exist', () => {
    component.numberOfFiles = 0;
    let event = {
      target: {
        files: []
      }
    };
    spyOn(mockHttpClient, "post");

    component.onFileSelected(event);

    expect(mockHttpClient.post).not.toHaveBeenCalled();
  });

  it('on edit should call the api', () => {
    const request = {
      value: {
        price: 100,
        quantity: 1,
        name: 'Nike',
        fileNames: ['No file uploaded yet.']
      },
      reset: () => {
      }
    } as any;
    component.editProduct.id = 1;
    let expected = new UpdateProductRequest();
    expected.price = 100;
    expected.quantity = 1;
    expected.id = 1;
    expected.name = "Nike";
    expected.fileNames = ['No file uploaded yet.'];
    spyOn(mockApiCallerService, "updateProduct").and.returnValue(of(new ProductResponse()));

    component.onEdit(request)

    expect(mockApiCallerService.updateProduct).toHaveBeenCalledOnceWith(expected);
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

});
