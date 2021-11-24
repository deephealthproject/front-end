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
      this._interactionService.learningRateValue = this.propertyData.default_value;
      this._interactionService.learningRateName = this.propertyData.name;
      this._interactionService.learningRateAllowedValues = [];
      const defaultValueExist = (defaultValue) => defaultValue === this.propertyData.default_value;
      if (!this._interactionService.learningRateAllowedValues.some(defaultValueExist)) {
        this._interactionService.learningRateAllowedValues.push(this.propertyData.default_value);
      }
      const allowedValueExist = (allowedValue) => allowedValue === this.propertyData.allowed_value;
      if (!this._interactionService.learningRateAllowedValues.some(allowedValueExist)) {
        this._interactionService.learningRateAllowedValues.push(this.propertyData.allowed_value);
      }
    }
    this._interactionService.allowedValues = [];
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
        this._interactionService.disabledTrainButton = true;
        this._interactionService.disabledTrainLearningRateAllowed = true;
      }
      else {
        //match with allowed array
        if (this._interactionService.learningRateAllowedValues.length != 0) {
          this.propertyAllowedValues = this._interactionService.learningRateAllowedValues.join(",");
          this._interactionService.allowedValues = this.propertyAllowedValues.split(",");

          const allowedValueExist = (allowedValue) => allowedValue === event.target.value;
          if (this._interactionService.allowedValues.some(allowedValueExist)) {
            this._interactionService.disabledTrainButton = false;
            this._interactionService.disabledTrainLearningRateAllowed = false;
            this._interactionService.learningRateValue = event.target.value;
          } else {
            this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorValueNotInAllowedValuesMessage'));
            this._interactionService.disabledTrainButton = true;
            this._interactionService.disabledTrainLearningRateAllowed = true;
          }
        } else {
          this._interactionService.learningRateValue = event.target.value;
        }
      }
    }
  }

}
