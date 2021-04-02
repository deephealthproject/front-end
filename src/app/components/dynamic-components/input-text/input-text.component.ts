import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})
export class InputTextComponent implements PropertyInterface, OnInit {
  
  @Input() propertyData: any;
  @ViewChild('textProperty') textProperty: ElementRef;

  constructor(private _interactionService: InteractionService) { }

  ngOnInit() {
    if (this.propertyData.name == "Training augmentations") {
      this._interactionService.trainingAugmentations = this.propertyData.allowed_value;
    } else if (this.propertyData.name == "Validation augmentations") {
      this._interactionService.validationAugmentations = this.propertyData.allowed_value;
    } else if (this.propertyData.name == "Test augmentations") {
      this._interactionService.testAugmentations = this.propertyData.allowed_value;
    }
  }

  changeTextPropertyValue(event) {
    if (event.target.value != this.propertyData.allowed_value) {
      this.textProperty.nativeElement.style.color = "#3f51b5";
    } else {
      this.textProperty.nativeElement.style.color = "black";
    }

    if (this.propertyData.name == "Training augmentations") {
      this._interactionService.trainingAugmentations = event.target.value;
    } else if (this.propertyData.name == "Validation augmentations") {
      this._interactionService.validationAugmentations = event.target.value;
    } else if (this.propertyData.name == "Test augmentations") {
      this._interactionService.testAugmentations = event.target.value;
    }
  }
}
