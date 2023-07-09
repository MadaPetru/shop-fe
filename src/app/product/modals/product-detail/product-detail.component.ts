import {Component, Inject} from '@angular/core';
import {Product} from "../../entity/product";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {

  product: any;
  selectedImage: any;
  images: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Product) {
    this.product = data;
    this.images = data.images;
    if (this.product.images.length > 0) this.selectedImage = this.product.images[0];
  }

  selectImageForProduct(image: []): void {
    this.selectedImage = image;
  }
}
