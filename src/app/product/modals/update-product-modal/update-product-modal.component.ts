import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {ApisCallerService} from "../../../apis-caller.service";
import {Subscription} from "rxjs";
import {NgForm} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {finalize} from "rxjs/operators";
import {UpdateProductRequest} from "../../dto/request/update-product-request";
import {Product} from "../../entity/product";
import {ProductResponse} from "../../dto/response/product-response";
import {ProductConverter} from "../../product-converter";

@Component({
  selector: 'app-update-product-modal',
  templateUrl: './update-product-modal.component.html',
  styleUrls: ['./update-product-modal.component.css']
})
export class UpdateProductModalComponent implements OnInit {

  public editProduct: Product | any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private dialogRef: MatDialogRef<UpdateProductModalComponent>, private http: HttpClient, private service: ApisCallerService) {
    this.editProduct = data;
  }

  @Input()
  requiredFileType: string | any;

  fileNames = ["No file uploaded yet."];
  uploadProgress: number | any;
  uploadSub: Subscription | any;

  ngOnInit(): void {
  }

  onEdit(form: NgForm) {
    let request: UpdateProductRequest = new UpdateProductRequest();
    request.fileNames = this.fileNames;
    request.name = form.value.name;
    request.price = form.value.price;
    request.quantity = form.value.quantity;
    request.id = this.editProduct.id;
    this.service.updateProduct(request).subscribe((response: ProductResponse) => {
        let entity = ProductConverter.convertToEntity(response);
        this.fileNames = ["No file uploaded yet."];
        form.reset();
        this.dialogRef.close(entity);
      },
      (error: Error) => {
        console.log(error);
      });
  }

  close() {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const numberOfFiles: number = event.target.files.length;
    this.initializeFileNames(numberOfFiles);
    this.addFileNamesToArray(numberOfFiles, event);
    let url = environment.url + '/images';
    if (numberOfFiles != 0) {
      const formData = new FormData()
      this.setFilesForTheApiCallToFormData(numberOfFiles, formData, files);
      const upload$ = this.http.post(url, formData)
        .pipe(
          finalize(() => this.reset())
        );
      this.uploadSub = upload$.subscribe();
    }
  }

  private setFilesForTheApiCallToFormData(numberOfFiles: number, formData: FormData, files: FileList) {
    for (let i = 0; i < numberOfFiles; i++) {
      // @ts-ignore
      formData.append("files[]", files.item(i));
    }
  }

  private addFileNamesToArray(numberOfFiles: number, event: any) {
    for (let i = 0; i < numberOfFiles; i++) {
      if (event.target.files[i]) this.fileNames.push(event.target.files[i].name);
    }
  }

  private initializeFileNames(numberOfFiles: number) {
    if (numberOfFiles != 0) this.fileNames = [];
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
