import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';


@Component({
  selector: 'app-deep-health',
  templateUrl: './deep-health.component.html',
  styleUrls: ['./deep-health.component.css']
})
export class DeepHealthComponent implements OnInit {
  powerUserShowStatus = true;
  projectShowStatus = false;

  constructor(private _interactionService: InteractionService) { }

  ngOnInit() {
    this._interactionService.powerUserState$.subscribe(
      state => {
        this.powerUserShowStatus = state;
      }
    );

    this._interactionService.projectState$.subscribe(
      state => {
        this.projectShowStatus = state;
      }
    );
  }

}
