import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Project, Model } from '../components/power-user/power-user.component';
import { DataService } from 'src/app/services/data.service';

export class TabObject {
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class InteractionService extends TabObject {

  constructor(private _dataService: DataService) {
    super();
  }

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
  private _projectDivNotificationsShowStatusSource = new Subject<boolean>();
  projectDivNotificationsShowStatus$ = this._projectDivNotificationsShowStatusSource.asObservable();

  //project component -> right div -> which tab is clicked
  private _projectConfigurationIsClickedSource = new Subject<boolean>();
  projectConfigurationIsClicked$ = this._projectConfigurationIsClickedSource.asObservable();
  private _projectNetworkStatisticsIsClickedSource = new Subject<boolean>();
  projectNetworkStatisticsIsClicked$ = this._projectNetworkStatisticsIsClickedSource.asObservable();
  private _projectUserScreenIsClickedSource = new Subject<boolean>();
  projectUserScreenIsClicked$ = this._projectUserScreenIsClickedSource.asObservable();
  private _projectNotificationsIsClickedSource = new Subject<boolean>();
  projectNotificationsIsClicked$ = this._projectNotificationsIsClickedSource.asObservable();

  //project component -> image input 
  private _projectDivDetailsLeftSideShowStatusSource = new Subject<boolean>();
  projectDivDetailsLeftSideShowStatus$ = this._projectDivDetailsLeftSideShowStatusSource.asObservable();
  private _projectDisabledProcessImageButtonSource = new Subject<boolean>();
  projectDisabledProcessImage$ = this._projectDisabledProcessImageButtonSource.asObservable();

  //project component -> task radio buttons
  private _checkedTaskSource = new Subject<number>();
  checkedTask$ = this._checkedTaskSource.asObservable();

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
  private _selectedOptionModelSource = new Subject<string>();
  selectedOptionModel$ = this._selectedOptionModelSource.asObservable();
  private _selectedOptionWeightSource = new Subject<string>();
  selectedOptionWeightSource$ = this._selectedOptionWeightSource.asObservable();
  private _selectedOptionPreTrainingSource = new Subject<string>();
  selectedOptionPreTraining$ = this._selectedOptionPreTrainingSource.asObservable();
  private _selectedOptionFineTuningSource = new Subject<string>();
  selectedOptionFineTuning$ = this._selectedOptionFineTuningSource.asObservable();
  private _selectedOptionInputSizeSource = new Subject<string>();
  selectedOptionInputSize$ = this._selectedOptionInputSizeSource.asObservable();
  private _selectedOptionLossSource = new Subject<string>();
  selectedOptionLoss$ = this._selectedOptionLossSource.asObservable();

  //project component -> div-details dropdown lists for selectors
  private _dropdownModelSource = new Subject<Array<string>>();
  dropdownModel$ = this._dropdownModelSource.asObservable();
  private _dropdownWeightsSource = new Subject<Array<string>>();
  dropdownWeights$ = this._dropdownWeightsSource.asObservable();
  private _dropdownPreTrainingSource = new Subject<Array<string>>();
  dropdownPreTraining$ = this._dropdownPreTrainingSource.asObservable();
  private _dropdownFineTuningSource = new Subject<Array<string>>();
  dropdownFineTuning$ = this._dropdownFineTuningSource.asObservable();
  private _dropdownLossSource = new Subject<Array<string>>();
  dropdownLoss$ = this._dropdownLossSource.asObservable();
  private _dropdownInputSizeSource = new Subject<Array<string>>();
  dropdownInputSize$ = this._dropdownInputSizeSource.asObservable();
  private _dropdownModelsSource = new Subject<Array<string>>();
  dropdownModels$ = this._dropdownModelsSource.asObservable();

  private _learningRateValueSource = new Subject<number>();
  learningRateValue$ = this._learningRateValueSource.asObservable();
  private _epochsValueSource = new Subject<number>();
  epochsValueSource$ = this._epochsValueSource.asObservable();

  //project component -> div-details re-Train toggle button, inference button, train button
  private _reTrainButtonCheckedStateSource = new Subject<boolean>();
  reTrainButtonCheckedState$ = this._reTrainButtonCheckedStateSource.asObservable();
  private _inferenceButtonStateSource = new Subject<boolean>();
  inferenceButtonState$ = this._inferenceButtonStateSource.asObservable();
  private _trainButtonStateSource = new Subject<boolean>();
  trainButtonState$ = this._trainButtonStateSource.asObservable();

  //
  private _selectedModelIdSource = new Subject<boolean>();
  selectedModelId$ = this._selectedModelIdSource.asObservable();
  private _selectedFineTuningIdSource = new Subject<boolean>();
  selectedDataId$ = this._selectedFineTuningIdSource.asObservable();
  private _datasetResponseSource = new Subject<string>();
  datasetResponse = this._datasetResponseSource.asObservable();

  //app-tabs -> unreadNotifications
  private _unreadNotificationsNumberSource = new Subject<number>();
  unreadNotificationsNumber$ = this._unreadNotificationsNumberSource.asObservable();

  unreadNotificationsNumber: number = 0;

  //
  private _currentProjectSource = new Subject<Project>();
  currentProject$ = this._currentProjectSource.asObservable();
  private _projectsListSource = new Subject<Array<Project>>();
  projectsList$ = this._projectsListSource.asObservable();

  private modelsByTaskArray: Array<Model> = [];
  private finetuningResponseData;
  private propertiesResponseData;

  initialiseModelDropdown(taskId) {
    this._dataService.getModels(taskId).subscribe(data => {
      this.insertDataIntoModelDropdown(data);
    })
  }

  initialiseProperties() {
    this._dataService.properties().subscribe(data => {
      if (data.body != undefined) {
        this.propertiesResponseData = data.body;
        this.fillProperties();
      }
      else {
        this.propertiesResponseData = data;
        this.fillProperties();
      }
    })
  }

  fillProperties() {
    let valuesArray: Array<string> = [];
    this.propertiesResponseData.forEach(property => {
      if (property.values != null) {
        valuesArray = property.values.split(",");
      }
      switch (property.name) {
        case "Learning rate":
          this._learningRateValueSource.next(property.default);
          break;
        case "Loss function":
          this._dropdownLossSource.next(valuesArray);
          this._selectedOptionLossSource.next(property.default);
          break;
        case "Epochs":
          this._epochsValueSource.next(property.default);
          break;
      }
    });
  }

  insertDataIntoModelDropdown(contentData) {
    let valuesArray: Array<string> = [];
    this.modelsByTaskArray = [];
    contentData.forEach(element => {
      valuesArray.push(element.name);
      this.modelsByTaskArray.push(element);
    });
    this._dropdownModelSource.next(valuesArray);
  }

  getModelsByTaskArray() {
    return this.modelsByTaskArray;
  }

  getFineTuningResponseData() {
    return this.finetuningResponseData;
  }


  initialiseFineTuningDropdown() {
    this._dataService.getDatasets().subscribe(data => {
      this.insertDataIntoFineTuningDropdown(data);
    })
  }

  insertDataIntoFineTuningDropdown(contentData) {
    let valuesArray: Array<string> = [];
    this.finetuningResponseData = [];
    contentData.forEach(element => {
      valuesArray.push(element.name);
      this.finetuningResponseData.push(element);
    });
    this._dropdownFineTuningSource.next(valuesArray);
  }

  resetImageData() {
    this.projectImagePathSource = null;
    this.projectImageURLSource = null;
    this.projectInputFiles = null;
  }

  changeCheckedTask(taskId: number) {
    this._checkedTaskSource.next(taskId);
  }

  resetSelectedOptions() {
    this._selectedOptionModelSource.next(null);
    this._selectedOptionWeightSource.next(null);
    // this._selectedOptionInputSizeSource.next(null);
    this._selectedOptionPreTrainingSource.next(null);
    this._selectedOptionFineTuningSource.next(null);
  }

  resetInputType(state: boolean) {
    this._checkedState3DSource.next(state);
    this._checkedStateTextSource.next(state);
    this._checkedStateVideoSource.next(state);
    this._checkedStateImageSource.next(state);
  }

  resetDropdowns() {
    this._dropdownModelSource.next(null);
    this._dropdownWeightsSource.next(null);
    this._dropdownInputSizeSource.next(null);
    this._dropdownPreTrainingSource.next(null);
    this._dropdownFineTuningSource.next(null);
  }

  resetProject() {
    this.changeShowStateProjectDivLeft(true);
    this.changeShowStateProjectDivMiddle(true);
    this.changeShowStateProjectDivNetwork(false);
    this.changeShowStateProjectDivUserScreen(false);
    this.changeShowStateProjectDivNotifications(false);

    this.changeShowStateProjectDivDetailsLeftSide(false);

    this.changeStateProjectConfigurationIsClicked(true);
    this.changeStateProjectNetworkIsClicked(false);
    this.changeStateProjectUserScreenIsClicked(false);
    this.changeStateProjectNotificationsIsClicked(false);

    this.changeStateDisableProcessImageButton(false);

    //this.changeCheckedTask(false);
    this.resetInputType(false);
    this.resetSelectedOptions();
    //this.resetDropdowns();

    this.changeCheckedStateReTrainButton(false);
    this.changeStateInferenceButton(false);
    this.changeCheckedStateTrainButton(false);
  }

  changeCheckedStateReTrainButton(state: boolean) {
    this._reTrainButtonCheckedStateSource.next(state);
    if (state == false) {
      //   let learningRate = document.getElementById("learningRate");
      //   learningRate.style.display = "none";
      //   let loss = document.getElementById("loss");
      //   loss.style.display = "none";
      //   let useDropout = document.getElementById("useDropout");
      //   useDropout.style.display = "none";
      let dataAugmentationSection = document.getElementById("dataAugmentationSection");
      dataAugmentationSection.style.display = "none";
      //   let optimizer = document.getElementById("optimizer");
      //   optimizer.style.display = "none";
      //   let epochs = document.getElementById("epochs");
      //   epochs.style.display = "none";
    }
  }

  changeStateInferenceButton(state: boolean) {
    this._inferenceButtonStateSource.next(state);
  }
  changeCheckedStateTrainButton(state: boolean) {
    this._trainButtonStateSource.next(state);
  }

  //deepHealth component -> which component is shown
  changeShowStateProject(state: boolean) {
    this._projectStateSource.next(state);
  }
  changeShowStatePowerUser(state: boolean) {
    this._powerUserStateSource.next(state);
  }

  //project component -> which tab section is shown  
  changeShowStateProjectDivLeft(state: boolean) {
    this._projectDivLeftShowStatusSource.next(state);
  }
  changeShowStateProjectDivMiddle(state: boolean) {
    this._projectDivMiddleShowStatusSource.next(state);
  }
  changeShowStateProjectDivUserScreen(state: boolean) {
    this._projectDivUserScreenShowStatusSource.next(state);
  }
  changeShowStateProjectDivNetwork(state: boolean) {
    this._projectDivNetworkStatisticsShowStatusSource.next(state);
  }
  changeShowStateProjectDivNotifications(state: boolean) {
    this._projectDivNotificationsShowStatusSource.next(state);
  }

  //project component -> right div -> which tab is clicked
  changeStateProjectConfigurationIsClicked(state: boolean) {
    this._projectConfigurationIsClickedSource.next(state);
  }
  changeStateProjectUserScreenIsClicked(state: boolean) {
    this._projectUserScreenIsClickedSource.next(state);
  }
  changeStateProjectNetworkIsClicked(state: boolean) {
    this._projectNetworkStatisticsIsClickedSource.next(state);
  }
  changeStateProjectNotificationsIsClicked(state: boolean) {
    this._projectNotificationsIsClickedSource.next(state);
  }

  //project component -> image input
  changeShowStateProjectDivDetailsLeftSide(state: boolean) {
    this._projectDivDetailsLeftSideShowStatusSource.next(state);
  }
  changeStateDisableProcessImageButton(state: boolean) {
    this._projectDisabledProcessImageButtonSource.next(state);
  }

  //
  changeSelectedModel(model) {
    this._selectedModelIdSource.next(model);
  }

  changeSelectedFineTuningId(datasetId) {
    this._selectedFineTuningIdSource.next(datasetId);
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

  changeCurrentProject(project: Project) {
    this._currentProjectSource.next(project);
    this.initialiseModelDropdown(project.task_id);
    this.initialiseProperties();
    this.initialiseFineTuningDropdown();
    this.changeCheckedTask(project.task_id);
    
  }

  closeProjectTab() {
    //tabs.length needs to be greater than 1 in order not to close the user tab in case you click it while you are in Power User
    if (this.tabs.length > 1) {
      this.tabs.pop();
      //In this case the last item in the list is the project tab.
    }
  }

  increaseNotificationsNumber() {
    this.unreadNotificationsNumber++;
    this._unreadNotificationsNumberSource.next(this.unreadNotificationsNumber);
  }
  decreaseNotificationsNumber() {
    this.unreadNotificationsNumber--;
    this._unreadNotificationsNumberSource.next(this.unreadNotificationsNumber);
  }

  //projects functions
  resetProjectsList(contentData) {
    this._projectsListSource.next(null);
    this._projectsListSource.next(contentData);
    return this._projectsListSource;
  }

  // addNewProject() {
  //   this._projectsListSource.
  // }

  getProjectList() {
    return this._projectsListSource;
  }

}
