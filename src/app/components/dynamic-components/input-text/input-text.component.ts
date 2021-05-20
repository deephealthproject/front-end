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
      this._interactionService.trainingAugmentationsValue = this.propertyData.default_value;
      this._interactionService.trainingAugmentationsName = this.propertyData.name;
    } else if (this.propertyData.name == "Validation augmentations") {
      this._interactionService.validationAugmentationsValue = this.propertyData.default_value;
      this._interactionService.validationAugmentationsName = this.propertyData.name;
    } else if (this.propertyData.name == "Test augmentations") {
      this._interactionService.testAugmentationsValue = this.propertyData.default_value;
      this._interactionService.testAugmentationsName = this.propertyData.name;
    }
  }

  changeTextPropertyValue(event) {
    if (event.target.value != this.propertyData.default_value) {
      this.textProperty.nativeElement.style.color = "#3f51b5";
    } else {
      this.textProperty.nativeElement.style.color = "black";
    }

    if (this.propertyData.name == "Training augmentations") {
      this._interactionService.trainingAugmentationsValue = event.target.value;
    } else if (this.propertyData.name == "Validation augmentations") {
      this._interactionService.validationAugmentationsValue = event.target.value;
    } else if (this.propertyData.name == "Test augmentations") {
      this._interactionService.testAugmentationsValue = event.target.value;
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
