import {Component, Inject} from '@angular/core';
import {ApisCallerService} from "../../../apis-caller.service";
import {Product} from "../../entity/product";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-product-modal',
  templateUrl: './delete-product.component.html'
})
export class DeleteProductComponent {

  deleteProduct: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private dialogRef: MatDialogRef<DeleteProductComponent>, private service: ApisCallerService) {
    this.deleteProduct = data;
  }


  onDelete(id: string) {
    this.service.deleteProduct(id).subscribe(
      (deleted: boolean) => {
        this.dialogRef.close(deleted);
      },
      (response: Error) => {
        console.log(response.message);
      });
  }

  close() {
    this.dialogRef.close();
  }

}
