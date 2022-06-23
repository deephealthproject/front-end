import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-input-float',
  templateUrl: './input-float.component.html',
  styleUrls: ['./input-float.component.css']
})
export class InputFloatComponent implements PropertyInterface, OnInit {

  @Input() propertyData: any;
  @ViewChild('floatProperty', { static: true }) floatProperty: ElementRef;
  propertyAllowedValues = null;

  constructor(private _dataService: DataService, public _interactionService: InteractionService,
    public dialog: MatDialog, public translate: TranslateService) { }

  ngOnInit() {
    if (this.propertyData.name == "Learning rate") {
      this.initialiseLearningRateAllowedValues(this.propertyData);
    }
    this._interactionService.allowedValues = [];
    this._interactionService.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this._interactionService.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');
  }

  initialiseLearningRateAllowedValues(propertyData) {
    this._interactionService.learningRateValue = propertyData.default_value;
    this._interactionService.learningRateName = propertyData.name;
    this._interactionService.learningRateAllowedValues = [];
    let learningRateArray = [];

    if (propertyData.allowed_value != null) {
      if (propertyData.allowed_value.length != 0) {
        const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
        if (!this._interactionService.learningRateAllowedValues.some(defaultValueExist)) {
          this._interactionService.learningRateAllowedValues.push(propertyData.default_value);
        }
        const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
        if (!this._interactionService.learningRateAllowedValues.some(allowedValueExist)) {
          this._interactionService.learningRateAllowedValues.push(propertyData.allowed_value);
        }
      }
      this._interactionService.learningRateAllowedValues.forEach(val => {
        if (val != propertyData.default_value) {
          learningRateArray.push(val);
        }
      })
      this._interactionService.learningRateValues = learningRateArray.join(',').replace(/,/g, '; ');
    }
  }

  changeFloatPropertyValue(event) {
    this._interactionService.allowedValues = [];
    if (event.target.value != this.propertyData.default_value) {
      this.floatProperty.nativeElement.style.color = "#3f51b5";
    } else {
      this.floatProperty.nativeElement.style.color = "black";
    }

    if (this.propertyData.name == "Learning rate") {
      //lower and upper limits
      if (event.target.value < 0.00001 || event.target.value > 0.01) {
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorMessageLearningrateLimits'));
        this.learningRateIncorrectValues();
      }
      else {
        //match with allowed array
        if (this._interactionService.learningRateAllowedValues.length != 0) {
          this.propertyAllowedValues = this._interactionService.learningRateAllowedValues.join(",");
          this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

          if (this._interactionService.allowedValues[1].charAt(0) == ">") {
            if (event.target.value <= this._interactionService.allowedValues[1].charAt(2)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this.learningRateIncorrectValues();
            } else {
              this.learningRateOkValues(event);
            }
          } else if (this._interactionService.allowedValues[1].substring(0, 2) == ">=") {
            if (event.target.value <= this._interactionService.allowedValues[1].charAt(3)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this.learningRateIncorrectValues();
            } else {
              this.learningRateOkValues(event);
            }
          } else if (this._interactionService.allowedValues[1].charAt(0) == "<" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {
            //"<10;>0".charAt("<10;>0".length-2)
            if (event.target.value < this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<") + 1, this._interactionService.allowedValues[1].indexOf(";"))
              && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this.learningRateIncorrectValues();
            } else {
              this.learningRateOkValues(event);
            }
          } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" && this._interactionService.allowedValues[1].charAt(this._interactionService.allowedValues[1].length - 2) == ">") {
            //"<10;>0".charAt("<10;>0".length-2)
            if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
              && event.target.value > this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">") + 1, this._interactionService.allowedValues[1].length)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this.learningRateIncorrectValues();
            } else {
              this.learningRateOkValues(event);
            }
          } else if (this._interactionService.allowedValues[1].substring(0, 2) == "<=" &&
            this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(";") + 1,
              this._interactionService.allowedValues[1].length - this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length).length) == ">=") {

            if (event.target.value <= this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf("<=") + 2, this._interactionService.allowedValues[1].indexOf(";"))
              && this._interactionService.allowedValues[1].substring(this._interactionService.allowedValues[1].indexOf(">=") + 2, this._interactionService.allowedValues[1].length)) {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this.learningRateIncorrectValues();
            } else {
              this.learningRateOkValues(event);
            }
          } else {
            const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
            if (this._interactionService.allowedValues.some(allowedValueExist)) {
              this.learningRateOkValues(event);
            } else {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
              this.learningRateIncorrectValues();
            }
          }
        } else {
          if (event.target.value <= 0) {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorPositiveAllowedValuesMessage'));
            this.learningRateIncorrectValues();
          } else {
            this.learningRateOkValues(event);
          }
        }
      }
    }
  }

  learningRateOkValues(event) {
    this._interactionService.disabledTrainButton = false;
    this._interactionService.disabledTrainLearningRateAllowed = false;
    this._interactionService.learningRateValue = event.target.value;
  }

  learningRateIncorrectValues() {
    this._interactionService.disabledTrainButton = true;
    this._interactionService.disabledTrainLearningRateAllowed = true;
  }
}


