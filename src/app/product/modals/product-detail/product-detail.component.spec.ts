import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductDetailComponent} from './product-detail.component';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from "@angular/material/legacy-dialog";
import {Product} from "../../entity/product";

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: new Product()}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should set the image that user chosse to see", () => {
    component.selectImageForProduct([]);

    expect(component.selectedImage).toEqual([]);
  })
});
