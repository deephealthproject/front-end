import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class TabObject {
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class InteractionService extends TabObject {

  private _projectStateSource = new Subject<boolean>();
  projectState$ = this._projectStateSource.asObservable();

  private _powerUserStateSource = new Subject<boolean>();
  powerUserState$ = this._powerUserStateSource.asObservable();

  tabs = Array<TabObject>();
  projectImagePathSource;
  projectImageURLSource;
  projectInputFiles;

  private _projectDivLeftShowStatusSource = new Subject<boolean>();
  projectDivLeftShowStatus$ = this._projectDivLeftShowStatusSource.asObservable();

  private _projectDivMiddleShowStatusSource = new Subject<boolean>();
  projectDivMiddleShowStatus$ = this._projectDivMiddleShowStatusSource.asObservable();

  private _projectDivNetworkStatisticsShowStatusSource = new Subject<boolean>();
  projectDivNetworkStatisticsShowStatus$ = this._projectDivNetworkStatisticsShowStatusSource.asObservable();

  private _projectDivUserScreenShowStatusSource = new Subject<boolean>();
  projectDivUserScreenShowStatus$ = this._projectDivUserScreenShowStatusSource.asObservable();

  private _projectConfigurationIsClickedSource = new Subject<boolean>();
  projectConfigurationIsClicked$ = this._projectConfigurationIsClickedSource.asObservable();

  private _projectNetworkStatisticsIsClickedSource = new Subject<boolean>();
  projectNetworkStatisticsIsClicked$ = this._projectNetworkStatisticsIsClickedSource.asObservable();

  private _projectUserScreenIsClickedSource = new Subject<boolean>();
  projectUserScreenIsClicked$ = this._projectUserScreenIsClickedSource.asObservable();

  constructor() {
    super();
  }

  resetImageData() {
    this.projectImagePathSource = null;
    this.projectImageURLSource = null;
    this.projectInputFiles = null;
  }

  resetProject() {
    this.changeShowStateProjectDivLeft(true);
    this.changeShowStateProjectDivMiddle(true);
    this.changeShowStateProjectDivNetwork(false);
    this.changeShowStateProjectDivUserScreen(false);

    this.changeStateProjectConfigurationIsClicked(true);
    this.changeStateProjectNetworkIsClicked(false);
    this.changeStateProjectUserScreenIsClicked(false);
  }

  changeShowStateProject(stare: boolean) {
    this._projectStateSource.next(stare);
  }

  changeShowStatePowerUser(stare: boolean) {
    this._powerUserStateSource.next(stare);
  }

  changeShowStateProjectDivMiddle(stare: boolean) {
    this._projectDivMiddleShowStatusSource.next(stare);
  }

  changeShowStateProjectDivUserScreen(stare: boolean) {
    this._projectDivUserScreenShowStatusSource.next(stare);
  }

  changeShowStateProjectDivNetwork(stare: boolean) {
    this._projectDivNetworkStatisticsShowStatusSource.next(stare);
  }

  changeShowStateProjectDivLeft(stare: boolean) {
    this._projectDivLeftShowStatusSource.next(stare);
  }

  changeStateProjectConfigurationIsClicked(stare: boolean) {
    this._projectConfigurationIsClickedSource.next(stare);
  }

  changeStateProjectUserScreenIsClicked(stare: boolean) {
    this._projectUserScreenIsClickedSource.next(stare);
  }

  changeStateProjectNetworkIsClicked(stare: boolean) {
    this._projectNetworkStatisticsIsClickedSource.next(stare);
  }

  showUserTab(userName: string) {
    let newTab = new TabObject();
    newTab.name = userName;
    newTab.type = "User";
    this.tabs.push(newTab);
  }

  showProjectTab(projectName: string) {
    if (this.tabs.length == 1) {
      let newTab = new TabObject();
      newTab.name = projectName;
      newTab.type = "Project";
      this.tabs.push(newTab);
    }
    else if (this.tabs[1].name != projectName) {
      this.tabs[1].name = projectName;
      this.resetImageData();
      this.resetProject();
    }
    else {
      console.log("The " + projectName + " tab is already open");
    }
  }

  closeProjectTab() {
    //tabs.length needs to be greater than 1 in order not to close the user tab in case you click it while you are in Power User
    if (this.tabs.length > 1) {
      this.tabs.pop();
      //In this case the last item in the list is the project tab.
    }
  }


}
