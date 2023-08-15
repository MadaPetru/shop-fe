import {Component, Input} from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {finalize} from "rxjs/operators";
import {ApisCallerService} from "../../../apis-caller.service";
import {CreateProductRequest} from "../../dto/request/create-product-request";
import {ProductConverter} from "../../product-converter";
import {ProductResponse} from "../../dto/response/product-response";
import {ImageService} from "../../../image/service/image.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html'
})
export class CreateProductComponent {

  constructor(private dialogRef: MatDialogRef<CreateProductComponent>, private http: HttpClient, private service: ApisCallerService) {

  }

  @Input()
  requiredFileType: any;

  fileNames = ["No file uploaded yet."];
  uploadProgress: any;
  uploadSub: any;
  productSaved: any;
  files: any;
  numberOfFiles: any;

  onAdd(form: NgForm) {
    let request = this.buildCreateRequest(form);
    this.createProductApiCall(request, form);
  }

  close() {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    this.files = event.target.files;
    this.numberOfFiles = event.target.files.length;
    this.fileNames = ImageService.initializeFileNames(this.numberOfFiles, this.fileNames);
    ImageService.addFileNamesToArray(event, this.fileNames);
    this.createImageApiCall();
  }

  private createImageApiCall() {
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

  private createProductApiCall(request: CreateProductRequest, form: NgForm) {
    this.service.saveProduct(request).subscribe((response: ProductResponse) => {
        this.productSaved = ProductConverter.convertToEntity(response);
        this.fileNames = ["No file uploaded yet."];
        form.reset();
        this.dialogRef.close(this.productSaved);
      },
      (error: Error) => {
        console.log(error);
      });
  }

  private buildCreateRequest(form: NgForm) {
    let request: CreateProductRequest = new CreateProductRequest();
    request.fileNames = this.fileNames;
    request.name = form.value.name;
    request.price = form.value.price;
    request.quantity = form.value.quantity;
    return request;
  }

  private reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
