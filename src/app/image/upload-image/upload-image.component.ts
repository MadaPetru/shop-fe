import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {Subscription} from "rxjs";
import {finalize} from "rxjs/operators";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  @Input()
  requiredFileType: string | any;

  fileNames = ["No file uploaded yet."];
  uploadProgress: number | any;
  uploadSub: Subscription | any;

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
      const upload$ = this.http.post(url, formData, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          finalize(() => this.reset())
        );

      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          // @ts-ignore
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      })
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

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
