import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';

@Component({
  selector: 'app-input-float',
  templateUrl: './input-float.component.html',
  styleUrls: ['./input-float.component.css']
})
export class InputFloatComponent implements PropertyInterface, OnInit {
  
  @Input() propertyData: any;
  @ViewChild('floatProperty') floatProperty: ElementRef;

  constructor(private _interactionService: InteractionService) { }

  ngOnInit() {
    if(this.propertyData.name == "Learning rate") {
    this._interactionService.learningRateValue = this.propertyData.default_value;
    this._interactionService.learningRateName = this.propertyData.name;
    }
  }
  

  changeFloatPropertyValue(event) {
    if(event.target.value != this.propertyData.default_value) {
      this.floatProperty.nativeElement.style.color = "#3f51b5";
    } else {
      this.floatProperty.nativeElement.style.color = "black";
    }

    if(this.propertyData.name == "Learning rate") {
      this._interactionService.learningRateValue = event.target.value;
    } 
  }

}
