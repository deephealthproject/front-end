import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Project, Model, Weight } from '../components/power-user/power-user.component';
import { DataService } from 'src/app/services/data.service';

export class TabObject {
  name: string;
  type: string;
  id: number;
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

  projectDatasetPath;
  projectDatasetUrl;

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
  private _projectDivEditShowStatusSource = new Subject<boolean>();
  projectDivEditShowStatus$ = this._projectDivEditShowStatusSource.asObservable();
  private _projectDivOutputResultsShowStatusSource = new Subject<boolean>();
  projectDivOutputResultsShowStatus$ = this._projectDivOutputResultsShowStatusSource.asObservable();

  //project component -> right div -> which tab is clicked
  private _projectConfigurationIsClickedSource = new Subject<boolean>();
  projectConfigurationIsClicked$ = this._projectConfigurationIsClickedSource.asObservable();
  private _projectNetworkStatisticsIsClickedSource = new Subject<boolean>();
  projectNetworkStatisticsIsClicked$ = this._projectNetworkStatisticsIsClickedSource.asObservable();
  private _projectUserScreenIsClickedSource = new Subject<boolean>();
  projectUserScreenIsClicked$ = this._projectUserScreenIsClickedSource.asObservable();
  private _projectNotificationsIsClickedSource = new Subject<boolean>();
  projectNotificationsIsClicked$ = this._projectNotificationsIsClickedSource.asObservable();
  private _projectEditWeightsIsClickedSource = new Subject<boolean>();
  projectEditWeightsIsClicked$ = this._projectEditWeightsIsClickedSource.asObservable();
  private _projectOutputResultsIsClickedSource = new Subject<boolean>();
  projectOutputResultsIsClicked$ = this._projectOutputResultsIsClickedSource.asObservable();

  //project component -> image input 
  private _projectDivDetailsLeftSideShowStatusSource = new Subject<boolean>();
  projectDivDetailsLeftSideShowStatus$ = this._projectDivDetailsLeftSideShowStatusSource.asObservable();
  private _projectDisabledProcessImageButtonSource = new Subject<boolean>();
  projectDisabledProcessImage$ = this._projectDisabledProcessImageButtonSource.asObservable();

  //project component -> task radio buttons
  private _checkedTaskSource = new Subject<number>();
  checkedTask$ = this._checkedTaskSource.asObservable();

  private _changeWeightNameSource = new Subject<string>();
  _changeWeightNameSource$ = this._changeWeightNameSource.asObservable();

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
  private _selectedOptionDatasetSource = new Subject<string>();
  selectedOptionDataset$ = this._selectedOptionDatasetSource.asObservable();
  private _selectedOptionMetricSource = new Subject<string>();
  selectedOptionMetric$ = this._selectedOptionMetricSource.asObservable();
  private _selectedOptionLossSource = new Subject<string>();
  selectedOptionLoss$ = this._selectedOptionLossSource.asObservable();

  //project component -> div-details dropdown lists for selectors
  private _dropdownModelSource = new Subject<Array<string>>();
  dropdownModel$ = this._dropdownModelSource.asObservable();
  private _dropdownWeightsSource = new Subject<Array<string>>();
  dropdownWeights$ = this._dropdownWeightsSource.asObservable();
  private _dropdownDatasetSource = new Subject<Array<string>>();
  dropdownDataset$ = this._dropdownDatasetSource.asObservable();
  private _dropdownLossSource = new Subject<Array<string>>();
  dropdownLoss$ = this._dropdownLossSource.asObservable();
  private _dropdownMetricSource = new Subject<Array<string>>();
  dropdownMetric$ = this._dropdownMetricSource.asObservable();
  private _dropdownModelsSource = new Subject<Array<string>>();
  dropdownModels$ = this._dropdownModelsSource.asObservable();

  private _learningRateValueSource = new Subject<number>();
  learningRateValue$ = this._learningRateValueSource.asObservable();
  private _epochsValueSource = new Subject<number>();
  epochsValueSource$ = this._epochsValueSource.asObservable();
  private _batchSizeValueSource = new Subject<number>();
  batchSizeValueSource$ = this._batchSizeValueSource.asObservable();
  private _metricValueSource = new Subject<number>();
  metricValueSource$ = this._metricValueSource.asObservable();
  private _inputHeightValueSource = new Subject<number>();
  inputHeightValueSource$ = this._inputHeightValueSource.asObservable();
  private _inputWidthValueSource = new Subject<number>();
  inputWidthValueSource$ = this._inputWidthValueSource.asObservable();

  //project component -> dataset augmentations box
  private _trainingAugmentationsValueSource = new Subject<string>();
  trainingAugmentationsValueSource$ = this._trainingAugmentationsValueSource.asObservable();
  private _validationAugmentationsValueSource = new Subject<string>();
  validationAugmentationsValueSource$ = this._validationAugmentationsValueSource.asObservable();
  private _testAugmentationsValueSource = new Subject<string>();
  testAugmentationsValueSource$ = this._testAugmentationsValueSource.asObservable();

  //project component -> div-details re-Train toggle button, inference button, train button, stop button
  private _reTrainButtonCheckedStateSource = new Subject<boolean>();
  reTrainButtonCheckedState$ = this._reTrainButtonCheckedStateSource.asObservable();
  private _inferenceButtonStateSource = new Subject<boolean>();
  inferenceButtonState$ = this._inferenceButtonStateSource.asObservable();
  private _trainButtonStateSource = new Subject<boolean>();
  trainButtonState$ = this._trainButtonStateSource.asObservable();
  private _stopButtonStateSource = new Subject<boolean>();
  stopButtonState$ = this._stopButtonStateSource.asObservable();
  private _inferenceSingleButtonStateSource = new Subject<boolean>();
  inferenceSingleButtonState$ = this._inferenceSingleButtonStateSource.asObservable();

  //
  private _selectedModelIdSource = new Subject<boolean>();
  selectedModelId$ = this._selectedModelIdSource.asObservable();
  private _selectedDatasetIdSource = new Subject<boolean>();
  selectedDataId$ = this._selectedDatasetIdSource.asObservable();
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
  private weightsArray: Array<Weight> = [];
  private datasetResponseData;
  private imageUrlResponseData;
  private propertiesResponseData;

  formDataWeight: Weight;

  initialiseModelDropdown(taskId) {
    this._dataService.getModels(taskId).subscribe(data => {
      this.insertDataIntoModelDropdown(data);
    })
  }

  initialiseWeightDropdown(modelId) {
    this._dataService.getWeights(modelId).subscribe(data => {
      this.insertDataIntoWeightDropdown(data);
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
        case "Batch size":
          this._batchSizeValueSource.next(property.default);
          break;
        case "Metric":
          this._dropdownMetricSource.next(valuesArray);
          this._metricValueSource.next(property.default);
          break;
        case "Input height":
          this._inputHeightValueSource.next(property.default);
          break;
        case "Input width":
          this._inputWidthValueSource.next(property.default);
          break;
        // case "Training augmentations":
        //   this._trainingAugmentationsValueSource.next(property.default);
        //   break;
        // case "Validations augmentations":
        //   this._validationAugmentationsValueSource.next(property.default);
        //   break;
        // case "Test augmentations":
        //   this._testAugmentationsValueSource.next(property.default);
        //   break;
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

  insertDataIntoWeightDropdown(contentData) {
    let valuesArray: Array<string> = [];
    this.weightsArray = [];
    contentData.forEach(element => {
      valuesArray.push(element.name);
      this.weightsArray.push(element);
    });
    this._dropdownWeightsSource.next(valuesArray);
  }

  getModelsByTaskArray() {
    return this.modelsByTaskArray;
  }

  getPropertiesById() {
    return this.propertiesResponseData;
  }

  getDatasetResponseData() {
    return this.datasetResponseData;
  }

  getImageUrlResponseData() {
    return this.imageUrlResponseData;
  }

  initialiseDatasetDropdown(taskId) {
    this._dataService.getDatasets(taskId).subscribe(data => {
      this.insertDataIntoDatasetDropdown(data);
    })
  }

  insertDataIntoDatasetDropdown(contentData) {
    let valuesArray: Array<string> = [];
    this.datasetResponseData = [];
    contentData.forEach(element => {
      valuesArray.push(element.name);
      this.datasetResponseData.push(element);
    });
    this._dropdownDatasetSource.next(valuesArray);
  }

  resetImageData() {
    this.projectImagePathSource = null;
    this.projectImageURLSource = null;
    this.projectInputFiles = null;
  }

  changeCheckedTask(taskId: number) {
    this._checkedTaskSource.next(taskId);
  }

  changeWeightName(weightName: string) {
    this._changeWeightNameSource.next(weightName);
  }

  resetSelectedOptions() {
    this._selectedOptionModelSource.next(null);
    this._selectedOptionWeightSource.next(null);
    this._selectedOptionMetricSource.next(null);
    this._selectedOptionDatasetSource.next(null);
    this._selectedOptionLossSource.next(null);
    this._metricValueSource.next(null);
    this._epochsValueSource.next(null);
    this._inputHeightValueSource.next(null);
    this._inputWidthValueSource.next(null);
    this._batchSizeValueSource.next(null);
    this._dropdownLossSource.next(null);
    this._learningRateValueSource.next(null);
    this._trainingAugmentationsValueSource.next(null);
    this._validationAugmentationsValueSource.next(null);
    this._testAugmentationsValueSource.next(null);
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
    this._dropdownMetricSource.next(null);
    this._dropdownDatasetSource.next(null);
    this._dropdownLossSource.next(null);
  }

  resetProject() {
    this.changeShowStateProjectDivLeft(true);
    this.changeShowStateProjectDivMiddle(true);
    this.changeShowStateProjectDivNetwork(false);
    this.changeShowStateProjectDivUserScreen(false);
    this.changeShowStateProjectDivNotifications(false);
    this.changeShowStateProjectDivEditWeights(false);
    this.changeShowStateProjectDivOutputResults(false);

    this.changeShowStateProjectDivDetailsLeftSide(false);

    this.changeStateProjectConfigurationIsClicked(true);
    this.changeStateProjectNetworkIsClicked(false);
    this.changeStateProjectUserScreenIsClicked(false);
    this.changeStateProjectNotificationsIsClicked(false);
    this.changeStateProjectEditWeightsIsClicked(false);
    this.changeStateProjectOutputResultsIsClicked(false);

    this.changeStateDisableProcessImageButton(false);

    //this.changeCheckedTask(1);
    this.resetInputType(false);
    this.resetSelectedOptions();
    this.resetDropdowns();

    this.changeCheckedStateReTrainButton(false);
    this.changeStateInferenceButton(false);
    this.changeStateInferenceSingleButton(false);
    this.changeCheckedStateTrainButton(false);
    this.changeCheckedStateStopButton(false);
  }

  changeCheckedStateReTrainButton(state: boolean) {
    this._reTrainButtonCheckedStateSource.next(state);
    if (state == false) {
      let inference = document.getElementById("inference");
      inference.style.display = "block";
      let inferenceSingle = document.getElementById("inferenceSingle");
      inferenceSingle.style.display = "none";
      let learningRate = document.getElementById("learningRate");
      learningRate.style.display = "none";
      let loss = document.getElementById("loss");
      loss.style.display = "none";
      let useDropout = document.getElementById("useDropout");
      useDropout.style.display = "none";
      let dataAugmentationSection = document.getElementById("dataAugmentationSection");
      dataAugmentationSection.style.display = "none";
      let epochs = document.getElementById("epochs");
      epochs.style.display = "none";
      let batchSize = document.getElementById("batchSize");
      batchSize.style.display = "none";
      let inputHeight = document.getElementById("inputHeight");
      inputHeight.style.display = "none";
      let inputWidth = document.getElementById("inputWidth");
      inputWidth.style.display = "none";

      let trainingAugmentations = document.getElementById("trainingAugmentations");
      trainingAugmentations.style.display = "none";
      let validationAugmentations = document.getElementById("validationAugmentations");
      validationAugmentations.style.display = "none";
      let testAugmentations = document.getElementById("testAugmentations");
      testAugmentations.style.display = "block";
    }
  }

  changeStateInferenceButton(state: boolean) {
    this._inferenceButtonStateSource.next(state);
  }

  changeStateInferenceSingleButton(state: boolean) {
    this._inferenceSingleButtonStateSource.next(state);
  }

  changeCheckedStateTrainButton(state: boolean) {
    this._trainButtonStateSource.next(state);
  }

  changeCheckedStateStopButton(state: boolean) {
    if(state == true) {
      this._stopButtonStateSource.next(state);
    }
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
  changeShowStateProjectDivEditWeights(state: boolean) {
    this._projectDivEditShowStatusSource.next(state);
  }
  changeShowStateProjectDivOutputResults(state: boolean) {
    this._projectDivOutputResultsShowStatusSource.next(state);
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
  changeStateProjectEditWeightsIsClicked(state: boolean) {
    this._projectDivEditShowStatusSource.next(state);
  }
  changeStateProjectOutputResultsIsClicked(state: boolean) {
    this._projectOutputResultsIsClickedSource.next(state);
  }

  //project component -> image input
  changeShowStateProjectDivDetailsLeftSide(state: boolean) {
    this._projectDivDetailsLeftSideShowStatusSource.next(state);
  }
  changeStateDisableProcessImageButton(state: boolean) {
    this._projectDisabledProcessImageButtonSource.next(state);
  }

  changeSelectedModel(model) {
    this._selectedModelIdSource.next(model);
  }

  changeSelectedDatasetId(datasetId) {
    this._selectedDatasetIdSource.next(datasetId);
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

  showProjectIdTab(projectId: number) {
    if (this.tabs.length == 1) {
      let newTab = new TabObject();
      newTab.id = projectId;
      newTab.type = "Project";
      this.tabs.push(newTab);
    }
    else if (this.tabs[1].id != projectId) {
      this.tabs[1].id = projectId;
      this.resetImageData();
      this.resetProject();
    }
    else {
      console.log("The project tab with id " + projectId + " is already open");
    }
  }

  changeCurrentProject(project: Project) {
    this._currentProjectSource.next(project);
    this.initialiseModelDropdown(project.task_id);
    this.initialiseProperties();
    this.initialiseDatasetDropdown(project.task_id);
    this.changeCheckedTask(project.task_id);
    this.changeWeightName(project.weightName);
    this.changeCheckedStateStopButton(true);
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

  resetProjectsList(contentData) {
    this._projectsListSource.next(null);
    this._projectsListSource.next(contentData);
    return this._projectsListSource;
  }

  resetWeightsList(contentData) {
    this._dropdownWeightsSource.next(null);
    this._dropdownWeightsSource.next(contentData);
    return this._dropdownWeightsSource;
  }

  resetEditWeightsList(contentData) {
    this.formDataWeight=null;
    this.formDataWeight = contentData;
    return this.formDataWeight;
  }

  getProjectList() {
    return this._projectsListSource;
  }

}
