import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";
import {finalize} from "rxjs/operators";
import {ApisCallerService} from "../../../apis-caller.service";
import {CreateProductRequest} from "../../dto/request/create-product-request";
import {Product} from "../../entity/product";
import {ProductConverter} from "../../product-converter";
import {ProductResponse} from "../../dto/response/product-response";

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateProductComponent>, private http: HttpClient, private service: ApisCallerService) {

  }

  @Input()
  requiredFileType: string | any;

  fileNames = ["No file uploaded yet."];
  uploadProgress: number | any;
  uploadSub: Subscription | any;
  productSaved: Product = new Product();

  ngOnInit(): void {
  }

  onAdd(form: NgForm) {
    let request: CreateProductRequest = new CreateProductRequest();
    request.fileNames = this.fileNames;
    request.name = form.value.name;
    request.price = form.value.price;
    request.quantity = form.value.quantity;
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

  close() {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const numberOfFiles: number = event.target.files.length;
    this.initializeFileNames(numberOfFiles);
    this.addFileNamesToArray(numberOfFiles, event);
    console.log(this.fileNames);
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
