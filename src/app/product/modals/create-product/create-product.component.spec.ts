import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateProductComponent} from './create-product.component';
import {MatDialogRef} from "@angular/material/dialog";
import {ApisCallerService} from "../../../apis-caller.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {CreateProductRequest} from "../../dto/request/create-product-request";
import {of} from "rxjs";
import {ProductResponse} from "../../dto/response/product-response";

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let mockHttpClient: HttpClient;
  let mockApiCallerService: ApisCallerService;
  let mockMatDialogRef: MatDialogRef<CreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      declarations: [CreateProductComponent],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: jasmine.createSpy('close')
        }
      }, ApisCallerService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    mockApiCallerService = TestBed.inject(ApisCallerService);
    mockHttpClient = TestBed.inject(HttpClient);
    mockMatDialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on add should call create product api', () => {
    const request = {
      value: {
        id: '1',
        price: 100,
        quantity: 1,
        name: 'Nike',
        fileNames: ['No file uploaded yet.']
      },
      reset: () => {
      }
    } as any;
    let expected = new CreateProductRequest();
    expected.price = 100;
    expected.quantity = 1;
    expected.name = "Nike";
    expected.fileNames = ['No file uploaded yet.'];
    spyOn(mockApiCallerService, "saveProduct").and.returnValue(of(new ProductResponse()));

    component.onAdd(request)

    expect(mockApiCallerService.saveProduct).toHaveBeenCalledOnceWith(expected);
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  it('should close modal', () => {
    component.close();

    expect(mockMatDialogRef.close).toHaveBeenCalledOnceWith();
  });

  it('on file selected should not create the image because there are no files', () => {
    let event = {
      target: {
        files: []
      }
    };
    spyOn(mockApiCallerService, "saveProduct").and.returnValue(of(new ProductResponse()));
    spyOn(mockHttpClient, "post");

    component.onFileSelected(event)

    expect(mockHttpClient.post).not.toHaveBeenCalled();
  });
});
