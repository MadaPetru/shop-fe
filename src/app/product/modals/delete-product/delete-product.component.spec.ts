import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeleteProductComponent} from './delete-product.component';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApisCallerService} from "../../../apis-caller.service";
import {HttpClientModule} from "@angular/common/http";
import {of, throwError} from "rxjs";

describe('DeleteProductModalComponent', () => {
  let component: DeleteProductComponent;
  let fixture: ComponentFixture<DeleteProductComponent>;
  let mockApiCallerService: ApisCallerService;
  let mockMatDialogRef: MatDialogRef<DeleteProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      declarations: [DeleteProductComponent],
      providers: [
        ApisCallerService, {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockApiCallerService = TestBed.inject(ApisCallerService);
    mockMatDialogRef = TestBed.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close', () => {
    component.close();

    expect(mockMatDialogRef.close).toHaveBeenCalledOnceWith();
  });
  it('should delete if successfully', () => {
    spyOn(mockApiCallerService, "deleteProduct").and.returnValue(of(true));
    let idProductToBeDeleted = '1';

    component.onDelete(idProductToBeDeleted);

    expect(mockMatDialogRef.close).toHaveBeenCalledOnceWith(true);
    expect(mockApiCallerService.deleteProduct).toHaveBeenCalledOnceWith(idProductToBeDeleted);
  });

  it('should not delete if error get from be', () => {
    let errorMessage = "Error message";
    spyOn(mockApiCallerService, "deleteProduct").and.returnValue(throwError(new Error(errorMessage)));
    spyOn(console, 'log');
    let idProductToBeDeleted = '1';

    component.onDelete(idProductToBeDeleted);

    expect(console.log).toHaveBeenCalledOnceWith(errorMessage);
  });

});
