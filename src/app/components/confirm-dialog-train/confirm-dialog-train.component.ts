import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { InteractionService } from '../../services/interaction.service';

export interface TrainDialogData {
  dialogTitle: string;
  dialogDeletedItem: string;
  dialogContent: string;
  trainingTime: string;
  modelSelected;
  datasetSelected;
  weightSelected;
  process_type;
  inputPlaceHolder: string;
  inputValue: string;
  datasetImageData: string;
  dialogDeletedItemInputValue: string;
  deletedItemInputPlaceHolder: string;
}

@Component({
  selector: 'app-confirm-dialog-train',
  templateUrl: './confirm-dialog-train.component.html',
  styleUrls: ['./confirm-dialog-train.component.css']
})
export class ConfirmDialogTrainComponent implements OnInit {
  dialogTitle: string;
  dialogDeletedItem: string;
  dialogContent: string;
  trainingTime: string;
  messageModel: string;
  messageWeight: string;
  messageDataset: string;
  selectedModel;
  selectedWeight;
  selectedDataset;
  modelColor;
  colorDataset;
  weightColor;
  process_type: string;
  showMessageModel: boolean;
  showMessageWeight: boolean;
  showMessageDataset: boolean;
  showDatasetInputPath: boolean;
  inputPlaceHolder: string;
  inputValue: string;

  datasetImageData: string;
  dialogDeletedItemInputValue: string;
  deletedItemInputPlaceHolder: string;
  showDeleteInput: boolean = true;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogTrainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrainDialogData, private _interactionService: InteractionService,
    public translate: TranslateService) {
    this.dialogTitle = data.dialogTitle;
    this.dialogDeletedItem = data.dialogDeletedItem;
    this.dialogContent = data.dialogContent;
    this.trainingTime = data.trainingTime;
    this.selectedModel = data.modelSelected;
    this.selectedDataset = data.datasetSelected;
    this.selectedWeight = data.weightSelected;
    this.process_type = data.process_type;
    this.inputPlaceHolder = data.inputPlaceHolder;
    this.deletedItemInputPlaceHolder = data.deletedItemInputPlaceHolder;

    if (!this.selectedModel) {
      this.messageModel = this.translate.instant('confirm-dialog-train.errorModel');
      this.modelColor = "red";
    }
    else {
      this.messageModel = this.translate.instant('confirm-dialog-train.selectedModel') + this.selectedModel;
      this.modelColor = "black";
    }

    if (!this.selectedDataset) {
      this.messageDataset = this.translate.instant('confirm-dialog-train.errorDataset');
      this.colorDataset = "red";
    }
    else {
      this.messageDataset = this.translate.instant('confirm-dialog-train.selectedDataset') + this.selectedDataset;
      this.colorDataset = "black";
    }

    if (!this.selectedWeight) {
      // this.messageWeight = this.translate.instant('confirm-dialog-train.errorWeight');
      // this.weightColor = "red";
    }
    else {
      this.messageWeight = this.translate.instant('confirm-dialog-train.selectedWeight') + this.selectedWeight;
      this.weightColor = "black";
    }

    if (this.process_type == "inference") {
      this.showMessageModel = true;
      this.showMessageWeight = false;
      this.showMessageDataset = true;
      this.showDatasetInputPath = false;
      this._interactionService.showDeleteInput = false;
    }

    if (this.process_type == "training") {
      this.showMessageModel = true;
      this.showMessageWeight = true;
      this.showMessageDataset = true;
      this.showDatasetInputPath = false;
      this._interactionService.showDeleteInput = false;
    }

    if (this.process_type == "inferenceSingle") {
      this.showMessageModel = true;
      this.showMessageWeight = false;
      this.showMessageDataset = false;
      this.showDatasetInputPath = true;
      this._interactionService.showDeleteInput = false;
    }
  }

  ngOnInit() {
  }

  save() {
    this.data.inputValue = this.inputValue;
    this.data.datasetImageData = this._interactionService.projectImageURLSource;
    //this.data.datasetImageData = this.data.datasetImageData.replace("data:image/jpeg;base64,", "");
    this.data.dialogDeletedItemInputValue = this.dialogDeletedItemInputValue;
    this.dialogRef.close(this.data);
  }

}
