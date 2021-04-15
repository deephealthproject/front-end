import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';

@Component({
  selector: 'app-input-integer',
  templateUrl: './input-integer.component.html',
  styleUrls: ['./input-integer.component.css']
})
export class InputIntegerComponent implements PropertyInterface, OnInit {

  @Input() propertyData: any;
  @ViewChild('integerProperty') integerProperty: ElementRef;

  constructor(private _interactionService: InteractionService) { }

  ngOnInit() {
    if (this.propertyData.name == "Epochs") {
      this._interactionService.epochValue = this.propertyData.default_value;
      this._interactionService.epochName = this.propertyData.name;
    } else if (this.propertyData.name == "Batch size") {
      this._interactionService.batchSizeValue = this.propertyData.default_value;
      this._interactionService.batchSizeName = this.propertyData.name;
    } else if (this.propertyData.name == "Input width") {
      this._interactionService.inputWidthValue = this.propertyData.default_value;
      this._interactionService.inputWidthName = this.propertyData.name;
    } else if (this.propertyData.name == "Input height") {
      this._interactionService.inputHeightValue = this.propertyData.default_value;
      this._interactionService.inputHeightName = this.propertyData.name;
    }
  }

  changeIntegerPropertyValue(event) {
    if (event.target.value != this.propertyData.default_value) {
      this.integerProperty.nativeElement.style.color = "#3f51b5";
    } else {
      this.integerProperty.nativeElement.style.color = "black";
    }

    if (this.propertyData.name == "Epochs") {
      this._interactionService.epochValue = event.target.value;
    } else if (this.propertyData.name == "Batch size") {
      this._interactionService.batchSizeValue = event.target.value;
    } else if (this.propertyData.name == "Input width") {
      this._interactionService.inputWidthValue = event.target.value;
    } else if (this.propertyData.name == "Input height") {
      this._interactionService.inputHeightValue = event.target.value;
    }
  }
}
