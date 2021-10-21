import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface DialogCreateAllowedPropertiesData {
  inputAllowedValue: string;
  inputDefaultValue: string;
  dialogTitle: string;
  allowedValuesList;
  showIntegerInput: Boolean;
  showFloatInput: Boolean;
  showTextInput: Boolean;
  propertyName: string;
}

@Component({
  selector: 'app-create-allowed-properties-dialog',
  templateUrl: './create-allowed-properties-dialog.component.html',
  styleUrls: ['./create-allowed-properties-dialog.component.css']
})
export class CreateAllowedPropertiesDialogComponent implements OnInit {
  inputAllowedValue: string;
  inputDefaultValue: string;
  dialogTitle: string;
  allowedValuesList = [];
  showIntegerInput: Boolean;
  showFloatInput: Boolean;
  showTextInput: Boolean;
  propertyName: string;

  constructor(public dialogRef: MatDialogRef<CreateAllowedPropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogCreateAllowedPropertiesData, private snackBar: MatSnackBar,
    public translate: TranslateService) {
    this.dialogTitle = data.dialogTitle;
    this.showIntegerInput = data.showIntegerInput;
    this.showFloatInput = data.showFloatInput;
    this.showTextInput = data.showTextInput;
    this.propertyName = data.propertyName;
  }

  ngOnInit() {
    this.allowedValuesList = [];
  }

  addAllowedValue(allowedValue) {
    if (this.showFloatInput == true) {
      if (allowedValue >= 0.00001 && allowedValue <= 0.01) {
        this.allowedValuesList.push(allowedValue);
        this.inputAllowedValue = null;
      } else {
        this.openSnackBarBadRequest(this.translate.instant('project.errorMessageLearningrateLimits'));
        this.inputAllowedValue = null;
      }
    } else if (this.showIntegerInput == true && this.propertyName == "Epochs") {
      if (allowedValue >= 1 && allowedValue <= 300) {
        this.allowedValuesList.push(allowedValue);
        this.inputAllowedValue = null;
      } else {
        this.openSnackBarBadRequest(this.translate.instant('project.errorUpperLimitEpochsMessage'));
        this.inputAllowedValue = null;
      }
    } else {
      if (allowedValue < 0) {
        this.openSnackBarBadRequest(this.translate.instant('create-allowed-properties-dialog.errorAddedNegativeAllowedValue'));
        this.inputAllowedValue = null
      } else {
        this.allowedValuesList.push(allowedValue);
        this.inputAllowedValue = null;
      }
    }
  }

  deleteAllowedValue(allowedValue) {
    this.allowedValuesList = this.allowedValuesList.filter(item => item != allowedValue);
  }

  openSnackBarBadRequest(message) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['bad-request-custom-class'];
    config.duration = 20000;
    this.snackBar.open(message, "close", config);
  }

  save() {
    this.data.inputAllowedValue = this.inputAllowedValue;
    this.data.inputDefaultValue = this.inputDefaultValue;
    this.data.allowedValuesList = this.allowedValuesList;
    this.dialogRef.close(this.data);
  }

}
