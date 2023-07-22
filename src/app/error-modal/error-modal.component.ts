import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ErrorModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.errorMessage = data.errorMessage;
  }

  ngOnInit(): void {
    this.dialogRef.updatePosition({
      top: '0.5%',
      left: '42.7%'
    })
  }

  errorMessage: string = '';

  closeModal() {
    this.dialogRef.close();
  }
}
