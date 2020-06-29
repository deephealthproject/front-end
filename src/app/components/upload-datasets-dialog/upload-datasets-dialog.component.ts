import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

export interface UploadDatasetsData {
  dialogContent: string;
  dialogTitle: string;
  inputPlaceHolder: string;
  inputValue: string;
  isUrlLink: boolean;
  inputValuePath: string;
  inputPlaceHolderPath: string;
}

@Component({
  selector: 'app-upload-datasets-dialog',
  templateUrl: './upload-datasets-dialog.component.html',
  styleUrls: ['./upload-datasets-dialog.component.css']
})

export class UploadDatasetsDialogComponent {
  dialogContent: string;
  dialogTitle: string;
  inputPlaceHolder: string;
  inputValue: string;
  isUrlLink: boolean = false;
  inputValuePath: string;
  inputPlaceHolderPath: string;

  changeIsUrlLinkCheckedState() {
    this.isUrlLink = !this.isUrlLink;
    if(this.isUrlLink == true) {
      this.inputValuePath = null;
    }
  }

  constructor(public dialogRef: MatDialogRef<UploadDatasetsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UploadDatasetsData, public translate: TranslateService) {
    this.dialogTitle = data.dialogTitle;
    this.dialogContent = data.dialogContent;
    this.inputPlaceHolder = data.inputPlaceHolder;
    this.inputPlaceHolderPath = data.inputPlaceHolderPath;
  }

  save() {
    this.data.inputValue = this.inputValue;
    this.data.isUrlLink = this.isUrlLink;
    this.data.inputValuePath = this.inputValuePath;
    this.dialogRef.close(this.data);
  }
}