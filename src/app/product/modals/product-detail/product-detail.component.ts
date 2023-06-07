import {Component, Inject, OnInit} from '@angular/core';
import {Product} from "../../entity/product";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ApisCallerService} from "../../../apis-caller.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product | any;
  selectedImage:  any;
  images : any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private dialogRef: MatDialog, private service: ApisCallerService) {
    this.product = data;
    this.images = data.images;
    if(this.product.images.length>0) this.selectedImage = this.product.images[0];
  }

  ngOnInit(): void {
  }
  selectImageForProduct(image:[]):void{
    this.selectedImage = image;
  }
}
