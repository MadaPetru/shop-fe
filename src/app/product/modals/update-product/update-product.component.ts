import {Component, Inject, Input} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApisCallerService} from "../../../apis-caller.service";
import {NgForm} from "@angular/forms";
import {finalize} from "rxjs/operators";
import {UpdateProductRequest} from "../../dto/request/update-product-request";
import {Product} from "../../entity/product";
import {ProductResponse} from "../../dto/response/product-response";
import {ProductConverter} from "../../product-converter";
import {ImageService} from "../../../image/service/image.service";
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-product-modal',
  templateUrl: './update-product.component.html'
})
export class UpdateProductComponent {

  public editProduct: Product;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private dialogRef: MatDialogRef<UpdateProductComponent>, private http: HttpClient, private service: ApisCallerService) {
    this.editProduct = data;
  }

  @Input()
  requiredFileType: any;

  fileNames = ["No file uploaded yet."];
  uploadProgress: any;
  uploadSub: any;
  files: any;
  numberOfFiles: any;

  onEdit(form: NgForm) {
    let request = this.buildUpdateRequest(form);
    this.updateApiCall(request, form);
  }

  close() {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    this.files = event.target.files;
    this.numberOfFiles = event.target.files.length;
    this.fileNames = ImageService.initializeFileNames(this.numberOfFiles, this.fileNames);
    ImageService.addFileNamesToArray(event, this.fileNames);
    this.saveImageFromSelectedFiles();

  }

  private updateApiCall(request: UpdateProductRequest, form: NgForm) {
    this.service.updateProduct(request).subscribe((response: ProductResponse) => {
        let entity = ProductConverter.convertToEntity(response);
        this.fileNames = ["No file uploaded yet."];
        form.reset();
        this.dialogRef.close(entity);
      },
      (error: Error) => {
        console.log(error.message);
      });
  }

  private buildUpdateRequest(form: NgForm) {
    let request: UpdateProductRequest = new UpdateProductRequest();
    request.fileNames = this.fileNames;
    request.name = form.value.name;
    request.price = form.value.price;
    request.quantity = form.value.quantity;
    request.id = this.editProduct.id;
    return request;
  }

  private saveImageFromSelectedFiles() {
    if (this.numberOfFiles != 0) {
      const formData = new FormData()
      ImageService.setFilesForTheApiCallToFormData(formData, this.files);
      const upload$ = this.http.post(ImageService.BASE_URL_IMAGES, formData)
        .pipe(
          finalize(() => this.reset())
        );
      this.uploadSub = upload$.subscribe();
    }
  }

  private reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
