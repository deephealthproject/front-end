import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-app-tabs',
  templateUrl: './app-tabs.component.html',
  styleUrls: ['./app-tabs.component.css']
})
export class AppTabsComponent implements OnInit {

  constructor(private _interactionService: InteractionService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'notification',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/notifications-24px.svg')
    );
  }

  tabs = this._interactionService.tabs;
  unreadNotifications = this._interactionService.unreadNotificationsNumber;

  initialiseUnreadNotificationsNumber() {
    this._interactionService.unreadNotificationsNumber$.subscribe(
      number => {
        this.unreadNotifications = number;
      }
    )
  }

  ngOnInit() {
    this._interactionService.showUserTab("Power User");
    this.initialiseUnreadNotificationsNumber();
  }

  returnToUser() {
    this._interactionService.changeShowStateProject(false);
    this._interactionService.changeShowStatePowerUser(true);
  }

  returnToProject() {
    this._interactionService.changeShowStateProject(true);
    this._interactionService.changeShowStatePowerUser(false);
  }

  openNotifications() {
    this._interactionService.changeShowStatePowerUser(false);
    this._interactionService.changeShowStateProject(true);

    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivUserScreen(false);
    this._interactionService.changeShowStateProjectDivNotifications(true);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectUserScreenIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(true);
  }
}
