import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';
import { MatDialog } from '../../../../../node_modules/@angular/material';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-input-float',
  templateUrl: './input-float.component.html',
  styleUrls: ['./input-float.component.css']
})
export class InputFloatComponent implements PropertyInterface, OnInit {

  @Input() propertyData: any;
  @ViewChild('floatProperty') floatProperty: ElementRef;

  constructor(private _dataService: DataService, private _interactionService: InteractionService,
    public dialog: MatDialog, public translate: TranslateService) { }

  ngOnInit() {
    if (this.propertyData.name == "Learning rate") {
      this._interactionService.learningRateValue = this.propertyData.default_value;
      this._interactionService.learningRateName = this.propertyData.name;
    }
  }

  changeFloatPropertyValue(event) {
    if (event.target.value != this.propertyData.default_value) {
      this.floatProperty.nativeElement.style.color = "#3f51b5";
    } else {
      this.floatProperty.nativeElement.style.color = "black";
    }

    if (this.propertyData.name == "Learning rate") {
      if (event.target.value < 0.00001 || event.target.value > 0.01) {
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorMessageLearningrateLimits'));
        this._interactionService.disabledTrainButton = true;
      } else {
        this._interactionService.disabledTrainButton = false;
      }
      this._interactionService.learningRateValue = event.target.value;
    }
  }

}
