import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  public static BASE_URL_IMAGES = environment.url + '/images';

  public static setFilesForTheApiCallToFormData(formData: FormData, files: FileList) {
    let numberOfFiles = files.length
    for (let i = 0; i < numberOfFiles; i++) {
      // @ts-ignore
      formData.append("files[]", files.item(i));
    }
  }

  public static addFileNamesToArray(event: any, fileNames: any) {
    let numberOfFiles = event.target.files.length;
    for (let i = 0; i < numberOfFiles; i++) {
      if (event.target.files[i]) fileNames.push(event.target.files[i].name);
    }
  }

  public static initializeFileNames(numberOfFiles: number, fileNames: any) {
    if (numberOfFiles != 0) fileNames = [];
    return fileNames;
  }
}
