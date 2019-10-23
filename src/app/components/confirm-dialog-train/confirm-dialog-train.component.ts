import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

export interface TrainDialogData {
  dialogTitle: string;
  dialogContent: string;
  trainingTime: string;
  modelSelected;
  datasetSelected;
}

@Component({
  selector: 'app-confirm-dialog-train',
  templateUrl: './confirm-dialog-train.component.html',
  styleUrls: ['./confirm-dialog-train.component.css']
})
export class ConfirmDialogTrainComponent implements OnInit {
  dialogTitle: string;
  dialogContent: string;
  trainingTime: string;
  messageModel: string;
  messageDataset: string;
  selectedModel;
  selectedDataset;
  modelColor;
  datasetColor;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogTrainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrainDialogData,
    public translate: TranslateService) {
    this.dialogTitle = data.dialogTitle;
    this.dialogContent = data.dialogContent;
    this.trainingTime = data.trainingTime;
    this.selectedModel = data.modelSelected;
    this.selectedDataset = data.datasetSelected;

    if (!this.selectedModel) {
      this.messageModel = this.translate.instant('confirm-dialog-train.errorModel');
      this.modelColor = "red";
    }
    else
      this.messageModel = this.translate.instant('confirm-dialog-train.selectedModel') + this.selectedModel.name;

    if (!this.selectedDataset) {
      this.messageDataset = this.translate.instant('confirm-dialog-train.errorDataset');
      this.datasetColor = "red";
    }
    else
      this.messageDataset = this.translate.instant('confirm-dialog-train.selectedDataset') + this.selectedDataset.name;

  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.data);
  }

}
