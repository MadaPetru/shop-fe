import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApisCallerService} from "../../../apis-caller.service";
import {Product} from "../../entity/product";

@Component({
  selector: 'app-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.css']
})
export class DeleteProductModalComponent implements OnInit {

  deleteProduct: Product | any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private dialogRef: MatDialogRef<DeleteProductModalComponent>, private service: ApisCallerService) {
    this.deleteProduct = data;
  }


  ngOnInit(): void {
  }

  onDelete(id: string) {
    this.service.deleteProduct(id).subscribe(
      (deleted: boolean) => {
        this.dialogRef.close(deleted);
      },
      (response: Error) => {
        console.log("error");
      });
  }

  close() {
    this.dialogRef.close();
  }

}
