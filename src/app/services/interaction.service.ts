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

  constructor() {
    super();
  }

  resetImageData() {
    this.projectImagePathSource = null;
    this.projectImageURLSource = null;
    this.projectInputFiles = null;
  }

  changeShowStateProject(stare: boolean) {
    this._projectStateSource.next(stare);
  }

  changeShowStatePowerUser(stare: boolean) {
    this._powerUserStateSource.next(stare);
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
