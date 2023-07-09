import {ImageService} from './image.service';

describe('ImageService', () => {
  it('should set files for the API call to FormData', () => {
    const formData = new FormData();
    const files = [
      new File(['file1'], 'file1.txt'),
      new File(['file2'], 'file2.txt'),
    ] as File[];

    let dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    const fileList = dataTransfer.files;
    ImageService.setFilesForTheApiCallToFormData(formData, fileList);

    expect(formData.has('files[]')).toBeTruthy();
    expect(formData.getAll('files[]')).toEqual(Array.from(dataTransfer.files));
  });

  it('should add file names to an array', () => {
    const event = {
      target: {
        files: [
          {name: 'file1.txt'},
          {name: 'file2.txt'},
        ],
      },
    };
    const fileNames: string[] = [];
    ImageService.addFileNamesToArray(event, fileNames);

    expect(fileNames).toEqual(['file1.txt', 'file2.txt']);
  });

  it('should initialize file names array', () => {
    const numberOfFiles = 2;
    let fileNames: string[] = ['file1.txt', 'file2.txt'];

    fileNames = ImageService.initializeFileNames(numberOfFiles, fileNames);

    expect(fileNames).toEqual([]);
  });
});
