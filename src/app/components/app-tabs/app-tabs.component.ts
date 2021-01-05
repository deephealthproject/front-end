import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../../services/interaction.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-tabs',
  templateUrl: './app-tabs.component.html',
  styleUrls: ['./app-tabs.component.css']
})
export class AppTabsComponent implements OnInit {

  constructor(private _interactionService: InteractionService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
    private router: Router) {
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
    this._interactionService.showUserTab("Home Page");
    this.initialiseUnreadNotificationsNumber();
  }

  returnToUser() {
    this.router.navigate(['/power-user']);
  }

  returnToProject() {
    this.router.navigate(['/project']);
  }

  openNotifications() {
    this._interactionService.changeShowStatePowerUser(false);
    this._interactionService.changeShowStateProject(true);

    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(true);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(true);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);
  }
}
