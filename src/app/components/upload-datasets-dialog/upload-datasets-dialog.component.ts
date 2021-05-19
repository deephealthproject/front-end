import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { User, Dataset, Model } from '../power-user/power-user.component';
import { InteractionService } from '../../services/interaction.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

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
  selectedModelName;
  datasetDropdownForUploadModelWeight: Dataset[];
  modelDropdownForUploadModelWeight: Model[];
  modelWeightFormData;

  inputValueLayersToRemove: string;
  inputValueClasses: string;

  selectedColorTypeImage: string;
  selectedColorTypeGroundTruth: string;
}

@Component({
  selector: 'app-upload-datasets-dialog',
  templateUrl: './upload-datasets-dialog.component.html',
  styleUrls: ['./upload-datasets-dialog.component.css']
})

export class UploadDatasetsDialogComponent implements OnInit {
  dialogContent: string;
  dialogTitle: string;
  inputPlaceHolder: string;
  inputValue: string;
  isUrlLink: boolean = false;
  inputValuePath: string;
  inputPlaceHolderPath: string;

  datasetDisplayModeValue: Boolean = true;
  selectedUsername;
  userDropdown: User[];
  selectedDatasetName;
  selectedModelName
  datasetDropdownForUploadModelWeight: Dataset[];
  modelDropdownForUploadModelWeight: Model[];
  modelWeightFormData;

  inputValueLayersToRemove: string;
  inputValueClasses: string;

  requiredModelControl = new FormControl('', [Validators.required]);
  requiredColorTypeImageControl = new FormControl('', [Validators.required]);
  colorTypeList = [];
  selectedColorTypeImage;
  selectedColorTypeGroundTruth;

  changeIsUrlLinkCheckedState() {
    this.isUrlLink = !this.isUrlLink;
    if(this.isUrlLink == true) {
      this.inputValuePath = null;
    }
  }

  constructor(public dialogRef: MatDialogRef<UploadDatasetsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UploadDatasetsData, public _interactionService: InteractionService, public _dataService: DataService,
    public translate: TranslateService,
    private formBuilder: FormBuilder) {
    this.dialogTitle = data.dialogTitle;
    this.dialogContent = data.dialogContent;
    this.inputPlaceHolder = data.inputPlaceHolder;
    this.inputPlaceHolderPath = data.inputPlaceHolderPath;
    this.datasetDisplayModeValue = data.datasetDisplayMode;
    this.selectedUsername = data.selectedUsername;
    this.userDropdown = [];
    this.selectedDatasetName = data.selectedDatasetName;
    this.selectedModelName = data.selectedModelName;
    this.datasetDropdownForUploadModelWeight = [];
    this.modelDropdownForUploadModelWeight = [];
    this.selectedColorTypeImage = data.selectedColorTypeImage;
    this.selectedColorTypeGroundTruth = data.selectedColorTypeGroundTruth;

    if(this._interactionService.uploadModelIsClicked == false) {
      let userProject: User;
      data.userDropdown.forEach(user => {
        userProject = {id: user.id, username: user.username, first_name: user.first_name, last_name: user.last_name, email: user.email, permission: user.permission };
        this.userDropdown.push(userProject);
      });
      this.userDropdown = this.userDropdown.filter(item => item.username != this._interactionService.username);
    } else {
      let datasetProject: Dataset;
      data.datasetDropdownForUploadModelWeight.forEach(dataset => {
        datasetProject = {id: dataset.id, name: dataset.name, path: dataset.path, task_id: dataset.task_id, color:dataset.color, users:dataset.users, datasetPublic: dataset.datasetPublic, ctype: dataset.ctype, ctype_gt: dataset.ctype_gt, classes: dataset.classes }
        this.datasetDropdownForUploadModelWeight.push(datasetProject);
      })
      let modelProject: Model;
      data.modelDropdownForUploadModelWeight.forEach(model => {
        modelProject = {id: model.id, name: model.name, task_id: model.task_id, color: model.color, location: model.location, weightsList: model.weightsList, propertiesList: model.propertiesList }
        this.modelDropdownForUploadModelWeight.push(modelProject);
      })
    }
  }

  ngOnInit() {
    this._interactionService.uploadForm = this.formBuilder.group({
      name: [''],
      onnx_data: [null]
    });
    this.datasetDisplayModeValue = true;
    this.initialiseColorTypeList();
  }

  initialiseColorTypeList() {
    this.colorTypeList = [];
    this.colorTypeList.push("NONE");
    this.colorTypeList.push("GRAY");
    this.colorTypeList.push("RGB");
    this.colorTypeList.push("RGBA");
    this.colorTypeList.push("BGR");
    this.colorTypeList.push("HSV");
    this.colorTypeList.push("YCBCR");
  }

  changeDatasetDisplayModeCheckedState() {
    if (this.datasetDisplayModeValue == true) {
      this._interactionService.projectDatasetDisplayMode = true;
    } else if (this.datasetDisplayModeValue == false) {
      this._interactionService.projectDatasetDisplayMode = false;
    }
  } 

  onFileSelect(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this._interactionService.uploadForm.patchValue({
      onnx_data: file
    });
    this._interactionService.uploadForm.get('onnx_data').updateValueAndValidity();
    console.log(this._interactionService.uploadForm.value);
  }

  save() {
    this.data.inputValue = this.inputValue;
    this.data.isUrlLink = this.isUrlLink;
    this.data.inputValuePath = this.inputValuePath;
    this.data.selectedUsername = this.selectedUsername;
    this.data.selectedDatasetName = this.selectedDatasetName;
    this.data.selectedModelName = this.selectedModelName;
    this.data.modelWeightFormData = this._interactionService.uploadForm.value;
    this.data.datasetDisplayMode = this._interactionService.projectDatasetDisplayMode;
    this.data.inputValueLayersToRemove = this.inputValueLayersToRemove;
    this.data.inputValueClasses = this.inputValueClasses;
    this.data.selectedColorTypeImage = this.selectedColorTypeImage;
    this.data.selectedColorTypeGroundTruth = this.selectedColorTypeGroundTruth;
    this.dialogRef.close(this.data);
  }
}