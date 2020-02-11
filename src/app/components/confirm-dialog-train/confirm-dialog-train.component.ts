import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

export interface TrainDialogData {
  dialogTitle: string;
  dialogContent: string;
  trainingTime: string;
  modelSelected;
  pretrainingSelected;
  finetuningSelected;
  weightSelected;
  process_type;
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
  messagePreTraining: string;
  messageWeight: string;
  messageFineTuning: string;
  selectedModel;
  selectedPreTraining;
  selectedWeight;
  selectedFineTuning;
  modelColor;
  colorPreTraining;
  colorFineTuning;
  weightColor;
  process_type: string;
  showMessageModel: boolean;
  showMessageWeight: boolean;
  showMessagePreTraining: boolean;
  showMessageFineTuning: boolean;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogTrainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrainDialogData,
    public translate: TranslateService) {
    this.dialogTitle = data.dialogTitle;
    this.dialogContent = data.dialogContent;
    this.trainingTime = data.trainingTime;
    this.selectedModel = data.modelSelected;
    this.selectedPreTraining = data.pretrainingSelected;
    this.selectedFineTuning = data.finetuningSelected;
    this.selectedWeight = data.weightSelected;
    this.process_type = data.process_type;

    if (!this.selectedModel) {
      this.messageModel = this.translate.instant('confirm-dialog-train.errorModel');
      this.modelColor = "red";
    }
    else {
      this.messageModel = this.translate.instant('confirm-dialog-train.selectedModel') + this.selectedModel;
      this.modelColor = "black";
    }

    if (!this.selectedPreTraining) {
      this.messagePreTraining = this.translate.instant('confirm-dialog-train.errorPreTraining');
      this.colorPreTraining = "red";
    }
    else {
      this.messagePreTraining = this.translate.instant('confirm-dialog-train.selectedPreTraining') + this.selectedPreTraining;
      this.colorPreTraining = "black";
    }


    if (!this.selectedFineTuning) {
      this.messageFineTuning = this.translate.instant('confirm-dialog-train.errorFineTuning');
      this.colorFineTuning = "red";
    }
    else {
      this.messageFineTuning = this.translate.instant('confirm-dialog-train.selectedFineTuning') + this.selectedFineTuning;
      this.colorFineTuning = "black";
    }

    if (!this.selectedWeight) {
      this.messageWeight = this.translate.instant('confirm-dialog-train.errorWeight');
      this.weightColor = "red";
    }
    else {
      this.messageWeight = this.translate.instant('confirm-dialog-train.selectedWeight') + this.selectedWeight;
      this.weightColor = "black";
    }


    if (this.process_type == "inference") {
      this.showMessageModel = true;
      this.showMessageWeight = false;
      this.showMessagePreTraining = false;
      this.showMessageFineTuning = true;
    }

    if (this.process_type == "train") {
      this.showMessageModel = true;
      this.showMessageWeight = false;
      this.showMessagePreTraining = true;
      this.showMessageFineTuning = false;
    }
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.data);
  }

}
