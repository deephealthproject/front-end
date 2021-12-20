import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})
export class InputTextComponent implements PropertyInterface, OnInit {

  @Input() propertyData: any;
  @ViewChild('textProperty', { static: true }) textProperty: ElementRef;
  propertyAllowedValues = null;

  constructor(public _interactionService: InteractionService, public dialog: MatDialog, public translate: TranslateService) { }

  ngOnInit() {
    if (this.propertyData.name == "Training augmentations") {
      this.initialiseTrainingAugmentationsAllowedValues(this.propertyData);
    }
    else if (this.propertyData.name == "Validation augmentations") {
      this.initialiseValidationAugmentationsAllowedValues(this.propertyData);
    }
    else if (this.propertyData.name == "Test augmentations") {
      this.initialiseTestAugmentationsAllowedValues(this.propertyData);
    }
    this._interactionService.allowedValues = [];
    this._interactionService.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this._interactionService.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');
  }

  initialiseTrainingAugmentationsAllowedValues(propertyData) {
    this._interactionService.trainingAugmentationsValue = propertyData.default_value;
    this._interactionService.trainingAugmentationsName = propertyData.name;
    this._interactionService.trainingAugmentationsAllowedValues = [];

    if (propertyData.allowed_value != null) {
      if (propertyData.allowed_value.length != 0) {
        const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
        if (!this._interactionService.trainingAugmentationsAllowedValues.some(defaultValueExist)) {
          this._interactionService.trainingAugmentationsAllowedValues.push(propertyData.default_value);
        }
        const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
        if (!this._interactionService.trainingAugmentationsAllowedValues.some(allowedValueExist)) {
          this._interactionService.trainingAugmentationsAllowedValues.push(propertyData.allowed_value);
        }
      }
    }
  }

  initialiseValidationAugmentationsAllowedValues(propertyData) {
    this._interactionService.validationAugmentationsValue = propertyData.default_value;
    this._interactionService.validationAugmentationsName = propertyData.name;
    this._interactionService.validationAugmentationsAllowedValues = [];

    if (propertyData.allowed_value != null) {
      if (propertyData.allowed_value.length != 0) {
        const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
        if (!this._interactionService.validationAugmentationsAllowedValues.some(defaultValueExist)) {
          this._interactionService.validationAugmentationsAllowedValues.push(propertyData.default_value);
        }
        const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
        if (!this._interactionService.validationAugmentationsAllowedValues.some(allowedValueExist)) {
          this._interactionService.validationAugmentationsAllowedValues.push(propertyData.allowed_value);
        }
      }
    }
  }

  initialiseTestAugmentationsAllowedValues(propertyData) {
    this._interactionService.testAugmentationsValue = propertyData.default_value;
    this._interactionService.testAugmentationsName = propertyData.name;
    this._interactionService.testAugmentationsAllowedValues = [];

    if (propertyData.allowed_value != null) {
      if (propertyData.allowed_value.length != 0) {
        const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
        if (!this._interactionService.testAugmentationsAllowedValues.some(defaultValueExist)) {
          this._interactionService.testAugmentationsAllowedValues.push(propertyData.default_value);
        }
        const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
        if (!this._interactionService.testAugmentationsAllowedValues.some(allowedValueExist)) {
          this._interactionService.testAugmentationsAllowedValues.push(propertyData.allowed_value);
        }
      }
    }
  }

  changeTextPropertyValue(event) {
    this._interactionService.allowedValues = [];
    if (event.target.value != this.propertyData.default_value) {
      this.textProperty.nativeElement.style.color = "#3f51b5";
    } else {
      this.textProperty.nativeElement.style.color = "black";
    }

    if (this.propertyData.name == "Training augmentations") {
      if (this._interactionService.trainingAugmentationsAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.trainingAugmentationsAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
        if (this._interactionService.allowedValues.some(allowedValueExist)) {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.disabledTrainAugm = false;
          this._interactionService.trainingAugmentationsValue = event.target.value;
        } else {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
          this._interactionService.disabledTrainAugm = true;
        }
      } else {
        this._interactionService.trainingAugmentationsValue = event.target.value;
      }
    }

    else if (this.propertyData.name == "Validation augmentations") {
      if (this._interactionService.validationAugmentationsAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.validationAugmentationsAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
        if (this._interactionService.allowedValues.some(allowedValueExist)) {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.disabledTrainValidationAugm = false;
          this._interactionService.validationAugmentationsValue = event.target.value;
        } else {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
          this._interactionService.disabledTrainValidationAugm = true;
        }
      } else {
        this._interactionService.validationAugmentationsValue = event.target.value;
      }
    }

    else if (this.propertyData.name == "Test augmentations") {
      if (this._interactionService.testAugmentationsAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.testAugmentationsAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
        if (this._interactionService.allowedValues.some(allowedValueExist)) {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.disabledTrainTestAugm = false;
          this._interactionService.testAugmentationsValue = event.target.value;
        } else {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
          this._interactionService.disabledTrainTestAugm = true;
        }
      } else {
        this._interactionService.testAugmentationsValue = event.target.value;
      }
    }
  }

  updateAngleXValue(event) {
    this._interactionService.angleXValue = event.value;
    var updatedTrainingAugmentationsValue;
    updatedTrainingAugmentationsValue = "SequentialAugmentationContainer\n    AugRotate angle=[" + this._interactionService.angleXValue + "," + this._interactionService.angleYValue + "] center=(" + this._interactionService.centerXValue + "," + this._interactionService.centerYValue + ") scale=" + this._interactionService.scaleValue + " interp=\"linear\"\n\nend";
    if (this.propertyData.name == "Training augmentations") {
      this.propertyData.default_value = updatedTrainingAugmentationsValue;
      this._interactionService.trainingAugmentationsValue = updatedTrainingAugmentationsValue;
    }
  }

  updateAngleYValue(event) {
    this._interactionService.angleYValue = event.value;
    var updatedTrainingAugmentationsValue;
    updatedTrainingAugmentationsValue = "SequentialAugmentationContainer\n    AugRotate angle=[" + this._interactionService.angleXValue + "," + this._interactionService.angleYValue + "] center=(" + this._interactionService.centerXValue + "," + this._interactionService.centerYValue + ") scale=" + this._interactionService.scaleValue + " interp=\"linear\"\n\nend";
    if (this.propertyData.name == "Training augmentations") {
      this.propertyData.default_value = updatedTrainingAugmentationsValue;
      this._interactionService.trainingAugmentationsValue = updatedTrainingAugmentationsValue;
    }
  }

  updateCenterXValue(event) {
    this._interactionService.centerXValue = event.value;
    var updatedTrainingAugmentationsValue;
    updatedTrainingAugmentationsValue = "SequentialAugmentationContainer\n    AugRotate angle=[" + this._interactionService.angleXValue + "," + this._interactionService.angleYValue + "] center=(" + this._interactionService.centerXValue + "," + this._interactionService.centerYValue + ") scale=" + this._interactionService.scaleValue + " interp=\"linear\"\n\nend";
    if (this.propertyData.name == "Training augmentations") {
      this.propertyData.default_value = updatedTrainingAugmentationsValue;
      this._interactionService.trainingAugmentationsValue = updatedTrainingAugmentationsValue;
    }
  }

  updateCenterYValue(event) {
    this._interactionService.centerYValue = event.value;
    var updatedTrainingAugmentationsValue;
    updatedTrainingAugmentationsValue = "SequentialAugmentationContainer\n    AugRotate angle=[" + this._interactionService.angleXValue + "," + this._interactionService.angleYValue + "] center=(" + this._interactionService.centerXValue + "," + this._interactionService.centerYValue + ") scale=" + this._interactionService.scaleValue + " interp=\"linear\"\n\nend";
    if (this.propertyData.name == "Training augmentations") {
      this.propertyData.default_value = updatedTrainingAugmentationsValue;
      this._interactionService.trainingAugmentationsValue = updatedTrainingAugmentationsValue;
    }
  }

  updateScaleValue(event) {
    this._interactionService.scaleValue = event.value;
    var updatedTrainingAugmentationsValue;
    updatedTrainingAugmentationsValue = "SequentialAugmentationContainer\n    AugRotate angle=[" + this._interactionService.angleXValue + "," + this._interactionService.angleYValue + "] center=(" + this._interactionService.centerXValue + "," + this._interactionService.centerYValue + ") scale=" + this._interactionService.scaleValue + " interp=\"linear\"\n\nend";
    if (this.propertyData.name == "Training augmentations") {
      this.propertyData.default_value = updatedTrainingAugmentationsValue;
      this._interactionService.trainingAugmentationsValue = updatedTrainingAugmentationsValue;
    }
  }
}
