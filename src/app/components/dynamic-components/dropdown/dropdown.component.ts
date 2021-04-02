import { Component, Input, OnInit } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements PropertyInterface, OnInit {

  @Input() propertyData: any;

  constructor(private _interactionService: InteractionService) { }

  ngOnInit() {
    if (this.propertyData.name == "Metric") {
      this._interactionService.metricValue = this.propertyData.selectedOption;
    } else if (this.propertyData.name == "Loss function") {
      this._interactionService.lossFunctionValue = this.propertyData.selectedOption;
    }
  }

  changeSelectedPropertyValue(event) {
    if (this.propertyData.name == "Metric") {
      this._interactionService.metricValue = event.value;
    } else if (this.propertyData.name == "Loss function") {
      this._interactionService.lossFunctionValue = event.value;
    }
  }
}
