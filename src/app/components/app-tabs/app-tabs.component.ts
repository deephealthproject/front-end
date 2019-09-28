import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-app-tabs',
  templateUrl: './app-tabs.component.html',
  styleUrls: ['./app-tabs.component.css']
})
export class AppTabsComponent implements OnInit {

  constructor(private _interactionService: InteractionService) { }

  tabs = this._interactionService.tabs;

  ngOnInit() {
    this._interactionService.showUserTab("Power User");
  }

  returnToUser() {
    this._interactionService.changeShowStateProject(false);
    this._interactionService.changeShowStatePowerUser(true);
  }

  returnToProject() {
    this._interactionService.changeShowStateProject(true);
    this._interactionService.changeShowStatePowerUser(false);
  }
}
