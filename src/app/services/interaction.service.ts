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
  //deepHealth component -> which component is shown
  private _projectStateSource = new Subject<boolean>();
  projectState$ = this._projectStateSource.asObservable();
  private _powerUserStateSource = new Subject<boolean>();
  powerUserState$ = this._powerUserStateSource.asObservable();

  tabs = Array<TabObject>();
  projectImagePathSource;
  projectImageURLSource;
  projectInputFiles;

  //project component -> which tab section is shown  
  private _projectDivLeftShowStatusSource = new Subject<boolean>();
  projectDivLeftShowStatus$ = this._projectDivLeftShowStatusSource.asObservable();
  private _projectDivMiddleShowStatusSource = new Subject<boolean>();
  projectDivMiddleShowStatus$ = this._projectDivMiddleShowStatusSource.asObservable();
  private _projectDivNetworkStatisticsShowStatusSource = new Subject<boolean>();
  projectDivNetworkStatisticsShowStatus$ = this._projectDivNetworkStatisticsShowStatusSource.asObservable();
  private _projectDivUserScreenShowStatusSource = new Subject<boolean>();
  projectDivUserScreenShowStatus$ = this._projectDivUserScreenShowStatusSource.asObservable();

  //project component -> right div -> which tab is clicked
  private _projectConfigurationIsClickedSource = new Subject<boolean>();
  projectConfigurationIsClicked$ = this._projectConfigurationIsClickedSource.asObservable();
  private _projectNetworkStatisticsIsClickedSource = new Subject<boolean>();
  projectNetworkStatisticsIsClicked$ = this._projectNetworkStatisticsIsClickedSource.asObservable();
  private _projectUserScreenIsClickedSource = new Subject<boolean>();
  projectUserScreenIsClicked$ = this._projectUserScreenIsClickedSource.asObservable();

  //project component -> image input 
  private _projectDivDetailsLeftSideShowStatusSource = new Subject<boolean>();
  projectDivDetailsLeftSideShowStatus$ = this._projectDivDetailsLeftSideShowStatusSource.asObservable();
  private _projectDisabledProcessImageButtonSource = new Subject<boolean>();
  projectDisabledProcessImage$ = this._projectDisabledProcessImageButtonSource.asObservable();

  //project component -> task radio buttons
  private _checkedStateClassificationSource = new Subject<boolean>();
  checkedStateClassification$ = this._checkedStateClassificationSource.asObservable();
  private _checkedStateSegmentationSource = new Subject<boolean>();
  checkedStateSegmentation$ = this._checkedStateSegmentationSource.asObservable();
  private _checkedStateGenerativeSource = new Subject<boolean>();
  checkedStateGenerative$ = this._checkedStateGenerativeSource.asObservable();
  private _checkedStateDetectionSource = new Subject<boolean>();
  checkedStateDetection$ = this._checkedStateDetectionSource.asObservable();

  //project component -> input type radio buttons
  private _checkedStateImageSource = new Subject<boolean>();
  checkedStateImage$ = this._checkedStateImageSource.asObservable();
  private _checkedStateTextSource = new Subject<boolean>();
  checkedStateText$ = this._checkedStateTextSource.asObservable();
  private _checkedStateVideoSource = new Subject<boolean>();
  checkedStateVideo$ = this._checkedStateVideoSource.asObservable();
  private _checkedState3DSource = new Subject<boolean>();
  checkedState3D$ = this._checkedState3DSource.asObservable();

  //project component -> currently selected value of selectors
  private _selectedOptionAlgorithmSource = new Subject<string>();
  selectedOptionAlgorithm$ = this._selectedOptionAlgorithmSource.asObservable();
  private _selectedOptionPreTrainingSource = new Subject<string>();
  selectedOptionPreTraining$ = this._selectedOptionPreTrainingSource.asObservable();
  private _selectedOptionFineTuningSource = new Subject<string>();
  selectedOptionFineTuning$ = this._selectedOptionFineTuningSource.asObservable();
  private _selectedOptionInputSizeSource = new Subject<string>();
  selectedOptionInputSize$ = this._selectedOptionInputSizeSource.asObservable();
  private _selectedOptionLossSource = new Subject<string>();
  selectedOptionLoss$ = this._selectedOptionLossSource.asObservable();

  //project component -> div-details dropdown lists for selectors
  private _dropdownAlgorithmSource = new Subject<Array<string>>();
  dropdownAlgorithm$ = this._dropdownAlgorithmSource.asObservable();
  private _dropdownPreTrainingSource = new Subject<Array<string>>();
  dropdownPreTraining$ = this._dropdownPreTrainingSource.asObservable();
  private _dropdownFineTuningSource = new Subject<Array<string>>();
  dropdownFineTuning$ = this._dropdownFineTuningSource.asObservable();
  private _dropdownLossSource = new Subject<Array<string>>();
  dropdownLoss$ = this._dropdownLossSource.asObservable();
  private _dropdownInputSizeSource = new Subject<Array<string>>();
  dropdownInputSize$ = this._dropdownInputSizeSource.asObservable();

  //
  private _reTrainButtonCheckedStateSource = new Subject<boolean>();
  reTrainButtonCheckedState$ = this._reTrainButtonCheckedStateSource.asObservable();

  constructor() {
    super();
  }

  resetImageData() {
    this.projectImagePathSource = null;
    this.projectImageURLSource = null;
    this.projectInputFiles = null;
  }

  resetTask(state: boolean) {
    this._checkedStateClassificationSource.next(state);
    this._checkedStateDetectionSource.next(state);
    this._checkedStateSegmentationSource.next(state);
    this._checkedStateGenerativeSource.next(state);
  }

  resetSelectedOptions() {
    this._selectedOptionAlgorithmSource.next(null);
    this._selectedOptionFineTuningSource.next(null);
    this._selectedOptionInputSizeSource.next(null);
    this._selectedOptionPreTrainingSource.next(null);
  }

  resetInputType(state: boolean) {
    this._checkedState3DSource.next(state);
    this._checkedStateTextSource.next(state);
    this._checkedStateVideoSource.next(state);
    this._checkedStateImageSource.next(state);
  }

  resetDropdowns() {
    this._dropdownAlgorithmSource.next(null);
    this._dropdownFineTuningSource.next(null);
    this._dropdownInputSizeSource.next(null);
    this._dropdownPreTrainingSource.next(null);
  }

  resetProject() {
    this.changeShowStateProjectDivLeft(true);
    this.changeShowStateProjectDivMiddle(true);
    this.changeShowStateProjectDivNetwork(false);
    this.changeShowStateProjectDivUserScreen(false);

    this.changeShowStateProjectDivDetailsLeftSide(false);

    this.changeStateProjectConfigurationIsClicked(true);
    this.changeStateProjectNetworkIsClicked(false);
    this.changeStateProjectUserScreenIsClicked(false);

    this.changeStateDisableProcessImageButton(false);

    this.resetTask(false);
    this.resetInputType(false);
    this.resetSelectedOptions();
    this.resetDropdowns();

    this.changeCheckedStateReTrainButton(false);
  }

  changeCheckedStateReTrainButton(stare: boolean) {
    this._reTrainButtonCheckedStateSource.next(stare);
    if (stare == false) {
      let learningRate = document.getElementById("learningRate");
      learningRate.style.display = "none";
      let loss = document.getElementById("loss");
      loss.style.display = "none";
      let useDropout = document.getElementById("useDropout");
      useDropout.style.display = "none";
    }
  }

  //deepHealth component -> which component is shown
  changeShowStateProject(stare: boolean) {
    this._projectStateSource.next(stare);
  }
  changeShowStatePowerUser(stare: boolean) {
    this._powerUserStateSource.next(stare);
  }

  //project component -> which tab section is shown  
  changeShowStateProjectDivLeft(stare: boolean) {
    this._projectDivLeftShowStatusSource.next(stare);
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

  //project component -> right div -> which tab is clicked
  changeStateProjectConfigurationIsClicked(stare: boolean) {
    this._projectConfigurationIsClickedSource.next(stare);
  }
  changeStateProjectUserScreenIsClicked(stare: boolean) {
    this._projectUserScreenIsClickedSource.next(stare);
  }
  changeStateProjectNetworkIsClicked(stare: boolean) {
    this._projectNetworkStatisticsIsClickedSource.next(stare);
  }

  //project component -> image input
  changeShowStateProjectDivDetailsLeftSide(stare: boolean) {
    this._projectDivDetailsLeftSideShowStatusSource.next(stare);
  }
  changeStateDisableProcessImageButton(stare: boolean) {
    this._projectDisabledProcessImageButtonSource.next(stare);
  }

  //app tabs -> which tab to show/close
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
