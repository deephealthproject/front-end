import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  inputPlaceHolder: string;
  inputValue: string;
  dialogTitle: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  inputPlaceHolder: string;
  inputValue: string;
  dialogTitle: string;


  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData, 
    public translate: TranslateService) {
    this.dialogTitle = data.dialogTitle;
    this.inputPlaceHolder = data.inputPlaceHolder;
  }

  save() {
    this.data.inputValue = this.inputValue;
    this.dialogRef.close(this.data);
  }

}
