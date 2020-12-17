import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { User, Dataset } from '../power-user/power-user.component';
import { InteractionService } from '../../services/interaction.service';

export interface UploadDatasetsData {
  dialogContent: string;
  dialogTitle: string;
  inputPlaceHolder: string;
  inputValue: string;
  isUrlLink: boolean;
  inputValuePath: string;
  inputPlaceHolderPath: string;
  datasetDisplayMode: Boolean;

  selectedUsername;
  userDropdown: User[];
  selectedDatasetName;
  datasetDropdownForUploadModel: Dataset[];
  modelData: string;
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

  datasetDisplayModeValue: boolean = true;
  selectedUsername;
  userDropdown: User[];
  selectedDatasetName;
  datasetDropdownForUploadModel: Dataset[];
  modelData: string;

  changeIsUrlLinkCheckedState() {
    this.isUrlLink = !this.isUrlLink;
    if(this.isUrlLink == true) {
      this.inputValuePath = null;
    }
  }

  constructor(public dialogRef: MatDialogRef<UploadDatasetsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UploadDatasetsData, public _interactionService: InteractionService,
    public translate: TranslateService) {
    this.dialogTitle = data.dialogTitle;
    this.dialogContent = data.dialogContent;
    this.inputPlaceHolder = data.inputPlaceHolder;
    this.inputPlaceHolderPath = data.inputPlaceHolderPath;
    this.selectedUsername = data.selectedUsername;
    this.userDropdown = [];
    this.selectedDatasetName = data.selectedDatasetName;
    this.datasetDropdownForUploadModel = [];

    if(this._interactionService.uploadModelIsClicked == false) {
      let userProject: User;
      data.userDropdown.forEach(user => {
        userProject = {id: user.id, username: user.username, first_name: user.first_name, last_name: user.last_name, email: user.email, permission: user.permission };
        this.userDropdown.push(userProject);
      });
      this.userDropdown = this.userDropdown.filter(item => item.username != this._interactionService.username);
    } else {
      let datasetProject: Dataset;
      data.datasetDropdownForUploadModel.forEach(dataset => {
        datasetProject = {id: dataset.id, name: dataset.name, path: dataset.path, task_id: dataset.task_id, color:dataset.color, owners:dataset.owners, datasetPublic: dataset.datasetPublic}
        this.datasetDropdownForUploadModel.push(datasetProject);
      })
    }
  }

  changeDatasetDisplayModeCheckedState() {
    if (this.datasetDisplayModeValue == true) {
      this._interactionService.projectDatasetDisplayMode = true;
    } else if (this.datasetDisplayModeValue == false) {
      this._interactionService.projectDatasetDisplayMode = false;
    }
  }

  save() {
    this.data.inputValue = this.inputValue;
    this.data.isUrlLink = this.isUrlLink;
    this.data.inputValuePath = this.inputValuePath;
    this.data.selectedUsername = this.selectedUsername;
    this.data.selectedDatasetName = this.selectedDatasetName;
    this.data.modelData = this._interactionService.projectImageURLSource;
    this.data.datasetDisplayMode = this._interactionService.projectDatasetDisplayMode;
    this.dialogRef.close(this.data);
  }
}