import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';


@Component({
  selector: 'app-deep-health',
  templateUrl: './deep-health.component.html',
  styleUrls: ['./deep-health.component.css']
})
export class DeepHealthComponent implements OnInit {
  loginUserShowStatus = true;
  registerUserShowStatus = false;
  powerUserShowStatus = false;
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

    this._interactionService.loginUserState$.subscribe(
      state => {
        this.loginUserShowStatus = state;
      }
    );

    this._interactionService.registerUserState$.subscribe(
      state => {
        this.registerUserShowStatus = state;
      }
    );
  }

}
