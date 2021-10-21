import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'app-input-integer',
  templateUrl: './input-integer.component.html',
  styleUrls: ['./input-integer.component.css']
})
export class InputIntegerComponent implements PropertyInterface, OnInit {

  @Input() propertyData: any;
  @ViewChild('integerProperty', { static: true }) integerProperty: ElementRef;
  propertyAllowedValues = null;

  constructor(public _dataService: DataService, public _interactionService: InteractionService,
    public dialog: MatDialog, public translate: TranslateService) { }

  ngOnInit() {
    if (this.propertyData.name == "Epochs") {
      this.initialiseEpochAllowedValues(this.propertyData);
    }
    else if (this.propertyData.name == "Batch size") {
      this.initialiseBatchSizeAllowedValues(this.propertyData);
    }
    else if (this.propertyData.name == "Input width") {
      this.initialiseInputWidthAllowedValues(this.propertyData);
    }
    else if (this.propertyData.name == "Input height") {
      this.initialiseInputHeightAllowedProperties(this.propertyData);
    }
    this._interactionService.allowedValues = [];
  }

  initialiseEpochAllowedValues(propertyData) {
    this._interactionService.epochValue = propertyData.default_value;
    this._interactionService.epochName = propertyData.name;
    this._interactionService.epochAllowedValues = [];
    const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
    if (!this._interactionService.epochAllowedValues.some(defaultValueExist)) {
      this._interactionService.epochAllowedValues.push(propertyData.default_value);
    }
    const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
    if (!this._interactionService.epochAllowedValues.some(allowedValueExist)) {
      this._interactionService.epochAllowedValues.push(propertyData.allowed_value);
    }
  }

  initialiseBatchSizeAllowedValues(propertyData) {
    this._interactionService.batchSizeValue = propertyData.default_value;
    this._interactionService.batchSizeName = propertyData.name;
    this._interactionService.batchSizeAllowedValues = [];
    const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
    if (!this._interactionService.batchSizeAllowedValues.some(defaultValueExist)) {
      this._interactionService.batchSizeAllowedValues.push(propertyData.default_value);
    }
    const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
    if (!this._interactionService.batchSizeAllowedValues.some(allowedValueExist)) {
      this._interactionService.batchSizeAllowedValues.push(propertyData.allowed_value);
    }
  }

  initialiseInputWidthAllowedValues(propertyData) {
    this._interactionService.inputWidthValue = propertyData.default_value;
    this._interactionService.inputWidthName = propertyData.name;
    this._interactionService.inputWidthAllowedValues = [];
    const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
    if (!this._interactionService.inputWidthAllowedValues.some(defaultValueExist)) {
      this._interactionService.inputWidthAllowedValues.push(propertyData.default_value);
    }
    const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
    if (!this._interactionService.inputWidthAllowedValues.some(allowedValueExist)) {
      this._interactionService.inputWidthAllowedValues.push(propertyData.allowed_value);
    }
  }

  initialiseInputHeightAllowedProperties(propertyData) {
    this._interactionService.inputHeightValue = propertyData.default_value;
    this._interactionService.inputHeightName = propertyData.name;
    this._interactionService.inputHeightAllowedValues = [];
    const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
    if (!this._interactionService.inputHeightAllowedValues.some(defaultValueExist)) {
      this._interactionService.inputHeightAllowedValues.push(propertyData.default_value);
    }
    const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
    if (!this._interactionService.inputHeightAllowedValues.some(allowedValueExist)) {
      this._interactionService.inputHeightAllowedValues.push(propertyData.allowed_value);
    }
  }

  changeIntegerPropertyValue(event) {
    this._interactionService.allowedValues = [];
    if (event.target.value != this.propertyData.default_value) {
      this.integerProperty.nativeElement.style.color = "#3f51b5";
    } else {
      this.integerProperty.nativeElement.style.color = "black";
    }

    if (this.propertyData.name == "Epochs") {
      //lower and upper limits
      if (event.target.value < 1 || event.target.value > 300) {
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorUpperLimitEpochsMessage'));
        this._interactionService.disabledTrainButton = true;
      } else {
        //match with allowed array
        if (this._interactionService.epochAllowedValues.length != 0) {
          this.propertyAllowedValues = this._interactionService.epochAllowedValues.join(",");
          this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

          const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
          if (this._interactionService.allowedValues.some(allowedValueExist)) {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.epochValue = event.target.value;
          } else {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
          }
        } else {
          this._interactionService.epochValue = event.target.value;
        }
      }
    }

    else if (this.propertyData.name == "Batch size") {
      if (this._interactionService.batchSizeAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.batchSizeAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
        if (this._interactionService.allowedValues.some(allowedValueExist)) {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.batchSizeValue = event.target.value;
        } else {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
        }
      } else {
        this._interactionService.batchSizeValue = event.target.value;
      }
    }

    else if (this.propertyData.name == "Input width") {
      if (this._interactionService.inputWidthAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.inputWidthAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
        if (this._interactionService.allowedValues.some(allowedValueExist)) {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.inputWidthValue = event.target.value;
        } else {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
        }
      } else {
        this._interactionService.inputWidthValue = event.target.value;
      }
    }

    else if (this.propertyData.name == "Input height") {
      if (this._interactionService.inputHeightAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.inputHeightAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");
        const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
        if (this._interactionService.allowedValues.some(allowedValueExist)) {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.inputHeightValue = event.target.value;
        } else {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
        }
      } else {
        this._interactionService.inputHeightValue = event.target.value;
      }
    }
  }

}