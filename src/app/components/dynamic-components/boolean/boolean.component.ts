import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { PropertyInterface } from '../../property-interface';
import { InteractionService } from '../../../services/interaction.service';

@Component({
  selector: 'app-boolean',
  templateUrl: './boolean.component.html',
  styleUrls: ['./boolean.component.css']
})
export class BooleanComponent implements PropertyInterface, OnInit {

  @Input() propertyData: any;
  @ViewChild('booleanProperty', { static: true }) booleanProperty: ElementRef;

  booleanPropertyCheckedState: boolean = false;

  constructor(private _interactionService: InteractionService) { }

  ngOnInit() {
    this._interactionService.booleanPropertyName = this.propertyData.name;
  }

  changeBooleanPropertyCheckedState() {
    this.booleanPropertyCheckedState = !this.booleanPropertyCheckedState;

    if(this.booleanPropertyCheckedState){
      this._interactionService.booleanPropertyValue = true;
    } else {
      this._interactionService.booleanPropertyValue = false;
    }
  }

}
