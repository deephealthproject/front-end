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
    this._interactionService.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this._interactionService.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');
  }

  initialiseEpochAllowedValues(propertyData) {
    this._interactionService.epochValue = propertyData.default_value;
    this._interactionService.epochName = propertyData.name;
    this._interactionService.epochAllowedValues = [];
    let epochArray = [];

    if (propertyData.allowed_value != null) {
      if (propertyData.allowed_value.length != 0) {
        const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
        if (!this._interactionService.epochAllowedValues.some(defaultValueExist)) {
          this._interactionService.epochAllowedValues.push(propertyData.default_value);
        }
        const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
        if (!this._interactionService.epochAllowedValues.some(allowedValueExist)) {
          this._interactionService.epochAllowedValues.push(propertyData.allowed_value);
        } else {
          this._interactionService.epochAllowedValues = [];
        }
      }
      this._interactionService.epochAllowedValues.forEach(val => {
        if (val != propertyData.default_value) {
          epochArray.push(val);
        }
      })
      this._interactionService.epochValues = epochArray.join(',').replace(/,/g, '; ');
    }
  }

  initialiseBatchSizeAllowedValues(propertyData) {
    this._interactionService.batchSizeValue = propertyData.default_value;
    this._interactionService.batchSizeName = propertyData.name;
    this._interactionService.batchSizeAllowedValues = [];
    this._interactionService.batchSizeValues = null;
    let batchSizeArray = [];

    if (propertyData.allowed_value != null) {
      if (propertyData.allowed_value.length != 0) {
        const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
        if (!this._interactionService.batchSizeAllowedValues.some(defaultValueExist)) {
          this._interactionService.batchSizeAllowedValues.push(propertyData.default_value);
        }
        const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
        if (!this._interactionService.batchSizeAllowedValues.some(allowedValueExist)) {
          this._interactionService.batchSizeAllowedValues.push(propertyData.allowed_value);
        } else {
          this._interactionService.batchSizeAllowedValues = [];
        }
      }
      this._interactionService.batchSizeAllowedValues.forEach(val => {
        if (val != propertyData.default_value) {
          batchSizeArray.push(val);
        }
      })
      this._interactionService.batchSizeValues = batchSizeArray.join(',').replace(/,/g, '; ');
    }
  }

  initialiseInputWidthAllowedValues(propertyData) {
    this._interactionService.inputWidthValue = propertyData.default_value;
    this._interactionService.inputWidthName = propertyData.name;
    this._interactionService.inputWidthAllowedValues = [];
    this._interactionService.inputWidthValues = null;
    let inputWidthArray = [];

    if (propertyData.allowed_value != null) {
      if (propertyData.allowed_value.length != 0) {
        const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
        if (!this._interactionService.inputWidthAllowedValues.some(defaultValueExist)) {
          this._interactionService.inputWidthAllowedValues.push(propertyData.default_value);
        }
        const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
        if (!this._interactionService.inputWidthAllowedValues.some(allowedValueExist)) {
          this._interactionService.inputWidthAllowedValues.push(propertyData.allowed_value);
        }
      }
      this._interactionService.inputWidthAllowedValues.forEach(val => {
        if (val != propertyData.default_value) {
          inputWidthArray.push(val);
        }
      })
      this._interactionService.inputWidthValues = inputWidthArray.join(',').replace(/,/g, '; ');
    }
  }

  initialiseInputHeightAllowedProperties(propertyData) {
    this._interactionService.inputHeightValue = propertyData.default_value;
    this._interactionService.inputHeightName = propertyData.name;
    this._interactionService.inputHeightAllowedValues = [];
    let inputHeightArray = [];

    if (propertyData.allowed_value != null) {
      if (propertyData.allowed_value.length != 0) {
        const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
        if (!this._interactionService.inputHeightAllowedValues.some(defaultValueExist)) {
          this._interactionService.inputHeightAllowedValues.push(propertyData.default_value);
        }
        const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
        if (!this._interactionService.inputHeightAllowedValues.some(allowedValueExist)) {
          this._interactionService.inputHeightAllowedValues.push(propertyData.allowed_value);
        }
      }
      this._interactionService.inputHeightAllowedValues.forEach(val => {
        if (val != propertyData.default_value) {
          inputHeightArray.push(val);
        }
      })
      this._interactionService.inputHeightValues = inputHeightArray.join(',').replace(/,/g, '; ');
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
        this._interactionService.disabledTrainEpochsAllowed = true;
      } else {
        //match with allowed array    
        if (this._interactionService.epochAllowedValues.length != 0) {
          this.propertyAllowedValues = this._interactionService.epochAllowedValues.join(",");
          this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

          if (this._interactionService.allowedValues[1].charAt(0) == ">") {
            if (event.target.value <= this._interactionService.allowedValues[1].charAt(2)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this._interactionService.disabledTrainButton = true;
              this._interactionService.disabledTrainEpochsAllowed = true;
            } else {
              this._interactionService.disabledTrainButton = false;
              this._interactionService.disabledTrainEpochsAllowed = false;
              this._interactionService.epochValue = event.target.value;
            }
          } else if (this._interactionService.allowedValues[1].substring(0, 2) == ">=") {
            if (event.target.value <= this._interactionService.allowedValues[1].charAt(3)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this._interactionService.disabledTrainButton = true;
              this._interactionService.disabledTrainEpochsAllowed = true;
            } else {
              this._interactionService.disabledTrainButton = false;
              this._interactionService.disabledTrainEpochsAllowed = false;
              this._interactionService.epochValue = event.target.value;
            }
          } else if (this._interactionService.allowedValues[1].charAt(0) == "<" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {

            if (event.target.value < this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<") + 1, this._interactionService.allowedValues[1].indexOf(";"))
              && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this._interactionService.disabledTrainButton = true;
              this._interactionService.disabledTrainEpochsAllowed = true;
            } else {
              this._interactionService.disabledTrainButton = false;
              this._interactionService.disabledTrainEpochsAllowed = false;
              this._interactionService.epochValue = event.target.value;
            }
          } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {

            if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
              && event.target.value > this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this._interactionService.disabledTrainButton = true;
              this._interactionService.disabledTrainEpochsAllowed = true;
            } else {
              this._interactionService.disabledTrainButton = false;
              this._interactionService.disabledTrainEpochsAllowed = false;
              this._interactionService.epochValue = event.target.value;
            }
          } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" &&
            this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(";") + 1,
              this._interactionService.allowedValues[1].length - this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length).length) == ">=") {

            if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
              && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this._interactionService.disabledTrainButton = true;
              this._interactionService.disabledTrainEpochsAllowed = true;
            } else {
              this._interactionService.disabledTrainButton = false;
              this._interactionService.disabledTrainEpochsAllowed = false;
              this._interactionService.epochValue = event.target.value;
            }
          } else {
            const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
            if (this._interactionService.allowedValues.some(allowedValueExist)) {
              this._interactionService.disabledTrainButton = false;
              this._interactionService.disabledTrainEpochsAllowed = false;
              this._interactionService.epochValue = event.target.value;
            } else {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this._interactionService.disabledTrainButton = true;
              this._interactionService.disabledTrainEpochsAllowed = true;
            }
          }
        } else {
          if (event.target.value <= 0) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorPositiveAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainEpochsAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainEpochsAllowed = false;
            this._interactionService.epochValue = event.target.value;
          }
        }
      }
    }

    else if (this.propertyData.name == "Batch size") {
      if (this._interactionService.batchSizeAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.batchSizeAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        if (this._interactionService.allowedValues[1].charAt(0) == ">") {
          if (event.target.value <= this._interactionService.allowedValues[1].charAt(2)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainBatchSizeAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainBatchSizeAllowed = false;
            this._interactionService.batchSizeValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].substring(0, 2) == ">=") {
          if (event.target.value <= this._interactionService.allowedValues[1].charAt(3)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainBatchSizeAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainBatchSizeAllowed = false;
            this._interactionService.batchSizeValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].charAt(0) == "<" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {
          //"<10;>0".charAt("<10;>0".length-2)
          if (event.target.value < this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<") + 1, this._interactionService.allowedValues[1].indexOf(";"))
            && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainBatchSizeAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainBatchSizeAllowed = false;
            this._interactionService.batchSizeValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {
          //"<10;>0".charAt("<10;>0".length-2)
          if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
            && event.target.value > this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainBatchSizeAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainBatchSizeAllowed = false;
            this._interactionService.batchSizeValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" &&
          this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(";") + 1,
            this._interactionService.allowedValues[1].length - this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length).length) == ">=") {

          if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
            && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainBatchSizeAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainBatchSizeAllowed = false;
            this._interactionService.batchSizeValue = event.target.value;
          }
        } else {
          const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
          if (this._interactionService.allowedValues.some(allowedValueExist)) {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainBatchSizeAllowed = false;
            this._interactionService.batchSizeValue = event.target.value;
          } else {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainBatchSizeAllowed = true;
          }
        }
      } else {
        if (event.target.value <= 0) {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorPositiveAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
          this._interactionService.disabledTrainBatchSizeAllowed = true;
        } else {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.disabledTrainBatchSizeAllowed = false;
          this._interactionService.batchSizeValue = event.target.value;
        }
      }
    }

    else if (this.propertyData.name == "Input width") {
      if (this._interactionService.inputWidthAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.inputWidthAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        if (this._interactionService.allowedValues[1].charAt(0) == ">") {
          if (event.target.value <= this._interactionService.allowedValues[1].charAt(2)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputWidthAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputWidthAllowed = false;
            this._interactionService.inputWidthValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].substring(0, 2) == ">=") {
          if (event.target.value <= this._interactionService.allowedValues[1].charAt(3)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputWidthAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputWidthAllowed = false;
            this._interactionService.inputWidthValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].charAt(0) == "<" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {
          //"<10;>0".charAt("<10;>0".length-2)
          if (event.target.value < this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<") + 1, this._interactionService.allowedValues[1].indexOf(";"))
            && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputWidthAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputWidthAllowed = false;
            this._interactionService.inputWidthValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {
          //"<10;>0".charAt("<10;>0".length-2)
          if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
            && event.target.value > this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputWidthAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputWidthAllowed = false;
            this._interactionService.inputWidthValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" &&
          this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(";") + 1,
            this._interactionService.allowedValues[1].length - this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length).length) == ">=") {

          if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
            && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputWidthAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputWidthAllowed = false;
            this._interactionService.inputWidthValue = event.target.value;
          }
        } else {
          const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
          if (this._interactionService.allowedValues.some(allowedValueExist)) {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputWidthAllowed = false;
            this._interactionService.epochValue = event.target.value;
          } else {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputWidthAllowed = true;
          }
        }
      } else {
        if (event.target.value <= 0) {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorPositiveAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
          this._interactionService.disabledTrainInputWidthAllowed = true;
        } else {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.disabledTrainInputWidthAllowed = false;
          this._interactionService.inputWidthValue = event.target.value;
        }
      }
    }

    else if (this.propertyData.name == "Input height") {
      if (this._interactionService.inputHeightAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.inputHeightAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        if (this._interactionService.allowedValues[1].charAt(0) == ">") {
          if (event.target.value <= this._interactionService.allowedValues[1].charAt(2)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputHeightAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputHeightAllowed = false;
            this._interactionService.inputHeightValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].substring(0, 2) == ">=") {
          if (event.target.value <= this._interactionService.allowedValues[1].charAt(3)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputHeightAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputHeightAllowed = false;
            this._interactionService.inputHeightValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].charAt(0) == "<" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {
          //"<10;>0".charAt("<10;>0".length-2)
          if (event.target.value < this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<") + 1, this._interactionService.allowedValues[1].indexOf(";"))
            && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputHeightAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputHeightAllowed = false;
            this._interactionService.inputHeightValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {
          //"<10;>0".charAt("<10;>0".length-2)
          if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
            && event.target.value > this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputHeightAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputHeightAllowed = false;
            this._interactionService.inputHeightValue = event.target.value;
          }
        } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" &&
          this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(";") + 1,
            this._interactionService.allowedValues[1].length - this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length).length) == ">=") {

          if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
            && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length)) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputHeightAllowed = true;
          } else {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputHeightAllowed = false;
            this._interactionService.inputHeightValue = event.target.value;
          }
        } else {
          const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
          if (this._interactionService.allowedValues.some(allowedValueExist)) {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainInputHeightAllowed = false;
            this._interactionService.inputHeightValue = event.target.value;
          } else {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainInputHeightAllowed = true;
          }
        }
      } else {
        if (event.target.value <= 0) {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorPositiveAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
          this._interactionService.disabledTrainInputHeightAllowed = true;
        } else {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.disabledTrainInputHeightAllowed = false;
          this._interactionService.inputHeightValue = event.target.value;
        }
      }
    }
  }
}