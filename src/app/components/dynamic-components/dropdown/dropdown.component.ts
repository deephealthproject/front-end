import { Component, Input, OnInit } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements PropertyInterface, OnInit {

  @Input() propertyData: any;
  propertyAllowedValues = null;

  constructor(public _interactionService: InteractionService, public translate: TranslateService) { }

  ngOnInit() {
    if (this.propertyData.name == "Metric") {
      this.initialiseMetricAllowedValues(this.propertyData);
    }

    else if (this.propertyData.name == "Loss function") {
      this.initialiseLossFunctionAllowedValues(this.propertyData);
    }
    this._interactionService.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this._interactionService.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');
  }

  initialiseLossFunctionAllowedValues(propertyData) {
    this._interactionService.lossFunctionValue = propertyData.selectedOption;
    this._interactionService.lossFunctionName = propertyData.name;
    this._interactionService.lossFunctionAllowedValues = [];
    let values = [];

    const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
    if (!this._interactionService.lossFunctionAllowedValues.some(defaultValueExist)) {
      this._interactionService.lossFunctionAllowedValues.push(propertyData.default_value);
    }
    const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
    if (!this._interactionService.lossFunctionAllowedValues.some(allowedValueExist)) {
      this._interactionService.lossFunctionAllowedValues.push(propertyData.allowed_value);
    }
    propertyData.allowed_value.forEach(value => {
        values.push(value);
    })
    this._interactionService.propertyItemData.allowedValuesLoss = values.join(',').replace(/,/g, '; ');
  }

  initialiseMetricAllowedValues(propertyData) {
    this._interactionService.metricValue = propertyData.selectedOption;
    this._interactionService.metricName = propertyData.name;
    this._interactionService.metricAllowedValues = [];
    let values = [];
    
    const defaultValueExist = (defaultValue) => defaultValue === propertyData.default_value;
    if (!this._interactionService.metricAllowedValues.some(defaultValueExist)) {
      this._interactionService.metricAllowedValues.push(propertyData.default_value);
    }
    const allowedValueExist = (allowedValue) => allowedValue === propertyData.allowed_value;
    if (!this._interactionService.metricAllowedValues.some(allowedValueExist)) {
      this._interactionService.metricAllowedValues.push(propertyData.allowed_value);
    }
    propertyData.allowed_value.forEach(value => {
        values.push(value);
    })
    this._interactionService.propertyItemData.allowedValuesMetric = values.join(',').replace(/,/g, '; ');
  }

  changeSelectedPropertyValue(event) {
    if (this.propertyData.name == "Metric") {
      if (this._interactionService.metricAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.metricAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        const allowedValueExist = (allowedValue) => allowedValue === event.value;
        if (this._interactionService.allowedValues.some(allowedValueExist)) {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.disabledTrainMetricAllowed = false;
          this._interactionService.metricValue = event.value;
        } else {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
          this._interactionService.disabledTrainMetricAllowed = true;
        }
      } else {
        this._interactionService.metricValue = event.value;
      }
    }

    else if (this.propertyData.name == "Loss function") {
      if (this._interactionService.lossFunctionAllowedValues.length != 0) {
        this.propertyAllowedValues = this._interactionService.lossFunctionAllowedValues.join(",");
        this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

        const allowedValueExist = (allowedValue) => allowedValue === event.value;
        if (this._interactionService.allowedValues.some(allowedValueExist)) {
          this._interactionService.disabledTrainButton = false;
          this._interactionService.disabledTrainLossFunctionAllowed = false;
          this._interactionService.lossFunctionValue = event.value;
        } else {
          this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
          this._interactionService.disabledTrainButton = true;
          this._interactionService.disabledTrainLossFunctionAllowed = true;
        }
      } else {
        this._interactionService.lossFunctionValue = event.value;
      }
    }
  }
}
