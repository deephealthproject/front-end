import { Injectable, ViewChild, ComponentFactoryResolver, Input, Directive } from '@angular/core';
import { Subject } from 'rxjs';
import { Project, Model, Weight, User } from '../components/power-user/power-user.component';
import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { FormGroup } from '../../../node_modules/@angular/forms';
import { ProgressSpinnerDialogComponent } from '../components/progress-spinner-dialog/progress-spinner-dialog.component';
import { CreateAllowedPropertiesDialogComponent } from '../components/create-allowed-properties-dialog/create-allowed-properties-dialog.component';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { PropertyItem } from '../components/property-item';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export class TabObject {
  name: string;
  type: string;
  id: number;
}

export class ProcessingObject {
  projectId;
  processId;
  process_type;
  process_status: string;
  process_data: Array<ProcessData>;
  unread: boolean;
  showStopButton: boolean;
  showDisabledButton: boolean;
  color;
  training_id;
  process_created_date;
  process_updated_date;
}

export class ProcessData {
  epoch;
  inputWidth;
  inputHeight;
  loss;
  metric;
  test_accuracy;
  validation_accuracy;
}

export class PropertyItemClass {
  defaultType: string;
  allowedType: string;
  defaultValue: any;
  allowedValuesMetric: any;
  allowedValuesLoss: any;
}

@Directive()
@Injectable({
  providedIn: 'root'
})
export class InteractionService extends TabObject {

  constructor(private _dataService: DataService, private _authService: AuthService, private snackBar: MatSnackBar,
    public dialog: MatDialog, public translate: TranslateService, private componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  //deepHealth component -> which component is shown
  private _projectStateSource = new Subject<boolean>();
  projectState$ = this._projectStateSource.asObservable();
  private _powerUserStateSource = new Subject<boolean>();
  powerUserState$ = this._powerUserStateSource.asObservable();

  private _loginUserStateSource = new Subject<boolean>();
  loginUserState$ = this._loginUserStateSource.asObservable();
  private _registerUserStateSource = new Subject<boolean>();
  registerUserState$ = this._registerUserStateSource.asObservable();

  tabs = Array<TabObject>();

  projectImagePathSource;
  projectImageURLSource;
  projectInputFiles;

  localFilePath: string;
  projectDatasetDisplayMode = true;

  modelData: string;
  uploadModelIsClicked: Boolean;
  divSendEmail: Boolean = false;
  divResetPassword: Boolean = true;
  uploadForm: FormGroup;

  //project component -> which tab section is shown  
  private _projectDivLeftShowStatusSource = new Subject<boolean>();
  projectDivLeftShowStatus$ = this._projectDivLeftShowStatusSource.asObservable();
  private _projectDivMiddleShowStatusSource = new Subject<boolean>();
  projectDivMiddleShowStatus$ = this._projectDivMiddleShowStatusSource.asObservable();
  private _projectDivNetworkStatisticsShowStatusSource = new Subject<boolean>();
  projectDivNetworkStatisticsShowStatus$ = this._projectDivNetworkStatisticsShowStatusSource.asObservable();
  private _projectDivNotificationsShowStatusSource = new Subject<boolean>();
  projectDivNotificationsShowStatus$ = this._projectDivNotificationsShowStatusSource.asObservable();
  private _projectDivEditWeightsShowStatusSource = new Subject<boolean>();
  projectDivEditWeightsShowStatus$ = this._projectDivEditWeightsShowStatusSource.asObservable();
  private _projectDivOutputResultsShowStatusSource = new Subject<boolean>();
  projectDivOutputResultsShowStatus$ = this._projectDivOutputResultsShowStatusSource.asObservable();
  private _projectDivEditProjectShowStatusSource = new Subject<boolean>();
  projectDivEditProjectShowStatus$ = this._projectDivEditProjectShowStatusSource.asObservable();
  private _projectDivCreateModelAllowedPropertiesShowStatusSource = new Subject<boolean>();
  projectDivCreateModelAllowedPropertiesShowStatus$ = this._projectDivCreateModelAllowedPropertiesShowStatusSource.asObservable();

  //project component -> right div -> which tab is clicked
  private _projectConfigurationIsClickedSource = new Subject<boolean>();
  projectConfigurationIsClicked$ = this._projectConfigurationIsClickedSource.asObservable();
  private _projectNetworkStatisticsIsClickedSource = new Subject<boolean>();
  projectNetworkStatisticsIsClicked$ = this._projectNetworkStatisticsIsClickedSource.asObservable();
  private _projectNotificationsIsClickedSource = new Subject<boolean>();
  projectNotificationsIsClicked$ = this._projectNotificationsIsClickedSource.asObservable();
  private _projectEditWeightsIsClickedSource = new Subject<boolean>();
  projectEditWeightsIsClicked$ = this._projectEditWeightsIsClickedSource.asObservable();
  private _projectOutputResultsIsClickedSource = new Subject<boolean>();
  projectOutputResultsIsClicked$ = this._projectOutputResultsIsClickedSource.asObservable();
  private _projectEditProjectIsClickedSource = new Subject<boolean>();
  projectEditProjectIsClicked$ = this._projectEditProjectIsClickedSource.asObservable();
  private _projectCreateModelAllowedPropertiesIsClickedSource = new Subject<boolean>();
  projectCreateModelAllowedPropertiesIsClicked$ = this._projectCreateModelAllowedPropertiesIsClickedSource.asObservable();

  //project component -> image input 
  private _projectDivDetailsLeftSideShowStatusSource = new Subject<boolean>();
  projectDivDetailsLeftSideShowStatus$ = this._projectDivDetailsLeftSideShowStatusSource.asObservable();

  //project component -> task radio buttons
  private _checkedTaskSource = new Subject<number>();
  checkedTask$ = this._checkedTaskSource.asObservable();

  selectedTaskId;

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

  private _selectedOptionTaskManagerSource = new Subject<string>();
  selectedOptionTaskManager$ = this._selectedOptionTaskManagerSource.asObservable();
  private _selectedOptionEnvironmentSource = new Subject<string>();
  selectedOptionEnvironment$ = this._selectedOptionEnvironmentSource.asObservable();

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
  learningRateValueSource$ = this._learningRateValueSource.asObservable();
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
  // private _reTrainButtonCheckedStateSource = new Subject<boolean>();
  // reTrainButtonCheckedState$ = this._reTrainButtonCheckedStateSource.asObservable();
  private _inferenceButtonStateSource = new Subject<boolean>();
  inferenceButtonState$ = this._inferenceButtonStateSource.asObservable();
  private _trainButtonStateSource = new Subject<boolean>();
  trainButtonState$ = this._trainButtonStateSource.asObservable();
  private _stopButtonStateSource = new Subject<boolean>();
  stopButtonState$ = this._stopButtonStateSource.asObservable();
  private _inferenceSingleButtonStateSource = new Subject<boolean>();
  inferenceSingleButtonState$ = this._inferenceSingleButtonStateSource.asObservable();

  private _selectedModelIdSource = new Subject<boolean>();
  selectedModelId$ = this._selectedModelIdSource.asObservable();
  private _selectedDatasetIdSource = new Subject<boolean>();
  selectedDataId$ = this._selectedDatasetIdSource.asObservable();
  private _datasetResponseSource = new Subject<string>();
  datasetResponse = this._datasetResponseSource.asObservable();
  selectedModel = null;
  selectedDataset = null;

  //app-tabs -> unreadNotifications
  private _unreadNotificationsNumberSource = new Subject<number>();
  unreadNotificationsNumber$ = this._unreadNotificationsNumberSource.asObservable();

  unreadNotificationsNumber: number = 0;

  private _currentProjectSource = new Subject<Project>();
  currentProject$ = this._currentProjectSource.asObservable();
  private _projectsListSource = new Subject<Array<Project>>();
  projectsList$ = this._projectsListSource.asObservable();
  projects: Array<Project> = [];

  private modelsByTaskArray: Array<Model> = [];
  private weightsArray: Array<Weight> = [];
  private datasetResponseData;
  private imageUrlResponseData;
  private propertiesResponseData;

  formDataWeight: Weight;
  weightUsersList;
  showWeightDetailsTable: boolean = false;

  //register-user component
  private _userNameValueSource = new Subject<string>();
  usernameValue$ = this._userNameValueSource.asObservable();
  private _emailValueSource = new Subject<string>();
  emailValue$ = this._emailValueSource.asObservable();
  private _firstNameValueSource = new Subject<string>();
  firstNameValue$ = this._firstNameValueSource.asObservable();
  private _lastNameValueSource = new Subject<string>();
  lastNameValue$ = this._lastNameValueSource.asObservable();
  private _passwordValueSource = new Subject<string>();
  passwordValue$ = this._passwordValueSource.asObservable();
  private _confirmPasswordValueSource = new Subject<string>();
  confirmPasswordValue$ = this._confirmPasswordValueSource.asObservable();

  //login-user component
  private _loginButtonStateSource = new Subject<boolean>();
  loginButtonState$ = this._loginButtonStateSource.asObservable();
  private _logoutButtonStateSource = new Subject<boolean>();
  logoutButtonState$ = this._logoutButtonStateSource.asObservable();
  private _registerButtonStateSource = new Subject<boolean>();
  registerButtonState$ = this._registerButtonStateSource.asObservable();

  //user profile
  userProfileDetails: User;
  private _oldPasswordValueSource = new Subject<string>();
  oldPasswordValue$ = this._oldPasswordValueSource.asObservable();
  private _newPasswordValueSource = new Subject<string>();
  newPasswordValue$ = this._newPasswordValueSource.asObservable();
  private _confirmNewPasswordValueSource = new Subject<string>();
  confirmNewPasswordValue$ = this._confirmNewPasswordValueSource.asObservable();

  //edit project
  private _editProjectButtonStateSource = new Subject<boolean>();
  editProjectButtonState$ = this._editProjectButtonStateSource.asObservable();
  private _cancelEditProjectButtonStateSource = new Subject<boolean>();
  cancelEditProjectButtonState$ = this._cancelEditProjectButtonStateSource.asObservable();
  private _deleteProjectUsersButtonStateSource = new Subject<boolean>();
  deleteProjectUsersButtonState$ = this._deleteProjectUsersButtonStateSource.asObservable();
  projectName;
  projectOwner;
  username;
  currentProject: Project;
  usersAssociatedArray = [];
  usersList = [];
  userLoggedOut: Boolean;

  private _usersListSource = new Subject<Array<User>>();
  usersList$ = this._usersListSource.asObservable();

  private _usersAssociatedListSource = new Subject<Array<User>>();
  usersAssociatedList$ = this._usersAssociatedListSource.asObservable();

  runningProcesses: ProcessingObject[] = [];

  //reset-paswword
  private _emailValueResetPasswordSource = new Subject<string>();
  emailValueResetPasswordValue$ = this._emailValueResetPasswordSource.asObservable();
  private _newResetPasswordValueSource = new Subject<string>();
  newResetPasswordValue$ = this._newResetPasswordValueSource.asObservable();
  private _resetCodeValueSource = new Subject<string>();
  resetCodeValue$ = this._resetCodeValueSource.asObservable();

  //processes in Notifications
  processesList: MatTableDataSource<any>;
  displayedProcessColumns: string[] = ['processRead', 'processCreatedDate', 'projectId', 'processId', 'processType', 'processStatus', 'processUpdatedDate', 'processOptions'];
  processData = [];
  @ViewChild('processPaginator', { static: true }) processPaginator: MatPaginator;
  @ViewChild('processTableSort', { static: true }) processTableSort: MatSort;

  //dynamic properties
  allowedValues = [];
  learningRateName = null;
  epochName = null;
  batchSizeName = null;
  inputHeightName = null;
  inputWidthName = null;
  trainingAugmentationsName = null;
  validationAugmentationsName = null;
  testAugmentationsName = null;
  metricName = null;
  lossFunctionName = null;
  learningRateValue = null;
  epochValue = null;
  batchSizeValue = null;
  inputHeightValue = null;
  inputWidthValue = null;
  trainingAugmentationsValue = null;
  validationAugmentationsValue = null;
  testAugmentationsValue = null;
  metricValue = null;
  lossFunctionValue = null;
  booleanPropertyName = null;
  booleanPropertyValue: Boolean = false;
  editAllowedProperties: Boolean = false;
  propertyAllowedValue: string;
  propertyDefaultValue: string;
  allowedValuesList = [];
  showIntegerInput: Boolean = false;
  showFloatInput: Boolean = false;
  showTextInput: Boolean = false;
  epochAllowedValues = [];
  batchSizeAllowedValues = [];
  inputWidthAllowedValues = [];
  inputHeightAllowedValues = [];
  learningRateAllowedValues = [];
  metricAllowedValues = [];
  lossFunctionAllowedValues = [];
  trainingAugmentationsAllowedValues = [];
  validationAugmentationsAllowedValues = [];
  testAugmentationsAllowedValues = [];
  propertyAllowedValuesList = [];
  dropdownValues = null;

  angleXValue;
  angleYValue;;
  centerXValue;
  centerYValue;
  scaleValue;
  interpDropdown;
  selectedOptionInterp = null;

  disabledTrainButton = false;
  disabledTrainLearningRateAllowed = false;
  disabledTrainEpochsAllowed = false;
  disabledTrainBatchSizeAllowed = false;
  disabledTrainMetricAllowed = false;
  disabledTrainLossFunctionAllowed = false;
  disabledTrainInputWidthAllowed = false;
  disabledTrainInputHeightAllowed = false;
  disabledTrainAugm = false;
  disabledTrainValidationAugm = false;
  disabledTrainTestAugm = false;
  propertyItemData = new PropertyItemClass();

  @Input() dynamicPropertyList: PropertyItem[] = [];
  selectedOption = null;

  batchSizeValues = null;
  inputWidthValues = null;
  inputHeightValues = null;
  epochValues = null;
  learningRateValues = null;

  //inference output
  showClassificationOutput: boolean = false;
  showSegmentationOutput: boolean = false;

  initialiseModelDropdown(taskId) {
    this._dataService.getModels(taskId).subscribe(data => {
      this.insertDataIntoModelDropdown(data);
    })
  }

  initialiseWeightDropdown(modelId, datasetId) {
    this._dataService.getWeights(modelId, datasetId).subscribe(data => {
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
          this._selectedOptionMetricSource.next(property.default);
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

  getProperties() {
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
    this._epochsValueSource.next(null);
    this._inputHeightValueSource.next(null);
    this._inputWidthValueSource.next(null);
    this._batchSizeValueSource.next(null);
    this._learningRateValueSource.next(null);
    this._trainingAugmentationsValueSource.next(null);
    this._validationAugmentationsValueSource.next(null);
    this._testAugmentationsValueSource.next(null);
    this.selectedModel = null;
    this.selectedDataset = null;
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
    this.changeShowStateProjectDivNotifications(false);
    this.changeShowStateProjectDivEditWeights(false);
    this.changeShowStateProjectDivOutputResults(false);
    this.changeShowStateProjectDivEditProject(false);
    this.changeShowStateProjectDivDetailsLeftSide(false);

    this.changeStateProjectConfigurationIsClicked(true);
    this.changeStateProjectNetworkIsClicked(false);
    this.changeStateProjectNotificationsIsClicked(false);
    this.changeStateProjectEditWeightsIsClicked(false);
    this.changeStateProjectOutputResultsIsClicked(false);
    this.changeStateProjectEditProjectIsClicked(false);

    this.resetInputType(false);
    this.resetSelectedOptions();
    this.resetDropdowns();

    this.changeStateInferenceButton(false);
    this.changeStateInferenceSingleButton(false);
    this.changeCheckedStateTrainButton(false);
    this.changeCheckedStateStopButton(false);
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
    if (state == true) {
      this._stopButtonStateSource.next(state);
    }
  }

  changeCheckedStateLoginButton(state: boolean) {
    this._loginButtonStateSource.next(state);
  }

  changeCheckedStateLogoutButton(state: boolean) {
    this._logoutButtonStateSource.next(state);
  }

  changeCheckedStateRegisterButton(state: boolean) {
    this._registerButtonStateSource.next(state);
  }

  //deepHealth component -> which component is shown
  changeShowStateProject(state: boolean) {
    this._projectStateSource.next(state);
  }
  changeShowStatePowerUser(state: boolean) {
    this._powerUserStateSource.next(state);
  }
  changeShowStateLoginUser(state: boolean) {
    this._loginUserStateSource.next(state);
  }
  changeShowStateRegisterUser(state: boolean) {
    this._registerUserStateSource.next(state);
  }

  //project component -> which tab section is shown  
  changeShowStateProjectDivLeft(state: boolean) {
    this._projectDivLeftShowStatusSource.next(state);
  }
  changeShowStateProjectDivMiddle(state: boolean) {
    this._projectDivMiddleShowStatusSource.next(state);
  }
  changeShowStateProjectDivNetwork(state: boolean) {
    this._projectDivNetworkStatisticsShowStatusSource.next(state);
  }
  changeShowStateProjectDivNotifications(state: boolean) {
    this._projectDivNotificationsShowStatusSource.next(state);
  }
  changeShowStateProjectDivEditWeights(state: boolean) {
    this._projectDivEditWeightsShowStatusSource.next(state);
  }
  changeShowStateProjectDivOutputResults(state: boolean) {
    this._projectDivOutputResultsShowStatusSource.next(state);
  }
  changeShowStateProjectDivEditProject(state: boolean) {
    this._projectDivEditProjectShowStatusSource.next(state);
  }
  changeShowStateProjectDivModelAllowedProperties(state: boolean) {
    this._projectDivCreateModelAllowedPropertiesShowStatusSource.next(state);
  }

  //project component -> right div -> which tab is clicked
  changeStateProjectConfigurationIsClicked(state: boolean) {
    this._projectConfigurationIsClickedSource.next(state);
  }
  changeStateProjectNetworkIsClicked(state: boolean) {
    this._projectNetworkStatisticsIsClickedSource.next(state);
  }
  changeStateProjectNotificationsIsClicked(state: boolean) {
    this._projectNotificationsIsClickedSource.next(state);
  }
  changeStateProjectEditWeightsIsClicked(state: boolean) {
    this._projectEditWeightsIsClickedSource.next(state);
  }
  changeStateProjectOutputResultsIsClicked(state: boolean) {
    this._projectOutputResultsIsClickedSource.next(state);
  }
  changeStateProjectEditProjectIsClicked(state: boolean) {
    this._projectEditProjectIsClickedSource.next(state);
  }
  changeStateProjectCreateModelAllowedPropertiesIsClicked(state: boolean) {
    this._projectCreateModelAllowedPropertiesIsClickedSource.next(state);
  }

  //project component -> image input
  changeShowStateProjectDivDetailsLeftSide(state: boolean) {
    this._projectDivDetailsLeftSideShowStatusSource.next(state);
  }

  changeSelectedModel(model) {
    this._selectedModelIdSource.next(model);
  }

  changeSelectedDatasetId(datasetId) {
    this._selectedDatasetIdSource.next(datasetId);
  }

  //app tabs -> which tab to show/close
  showUserTab(userName: string) {
    if (this.tabs.length == 0) {
      let newTab = new TabObject();
      newTab.name = userName;
      newTab.type = "Home";
      this.tabs.push(newTab);
    } else {
      console.log("The " + userName + " tab is already open");
    }
  }

  showProjectTab(projectName: string) {
    this.projectName = projectName;
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
    this.formDataWeight = null;
    this.formDataWeight = contentData;
    return this.formDataWeight;
  }

  getProjects() {
    this._dataService.projects().subscribe(data => {
      // this._interactionService.resetProjectsList(data);
      this.updateProjectsList(data);
    })
  }

  updateProjectsList(contentData) {
    this.projects = [];
    for (let entry of contentData) {
      this.projects.push(entry);
    }
    console.log(this.projects);
  }

  getProjectList() {
    return this._projectsListSource;
  }

  resetUserProfileDetails(contentData) {
    this.userProfileDetails = null;
    this.userProfileDetails = contentData;
    return this.userProfileDetails;
  }

  getUsername() {
    this._authService.getCurrentUser().subscribe(data => {
      if (data != undefined || data != null) {
        this.initUsername(data);
      }
    })
  }

  initUsername(data) {
    this.username = data.username;
  }

  resetUsersList(contentData) {
    this._usersListSource.next(null);
    this._usersListSource.next(contentData);
    return this._usersListSource;
  }

  resetAssociatedUsersList(contentData) {
    this._usersAssociatedListSource.next(null);
    this._usersAssociatedListSource.next(contentData);
    return this._usersAssociatedListSource;
  }

  changeProjectTabName(projectName: string) {
    this.projectName = projectName;
    if (this.tabs.length == 1) {
      let newTab = new TabObject();
      newTab.name = projectName;
      newTab.type = "Project";
      this.tabs.push(newTab);
    }
    else if (this.tabs[1].name != projectName) {
      this.tabs[1].name = projectName;
    }
    else {
      console.log("The " + projectName + " tab is already open");
    }
  }

  browseFile(event: any) {
    this.projectInputFiles = event.target.files;
    this.localFilePath = event.target.value;
    if (this.projectInputFiles.length === 0)
      return;

    var reader = new FileReader();
    this.projectImagePathSource = this.projectInputFiles;
    reader.readAsDataURL(this.projectInputFiles[0]);
    reader.onload = () => {
      this.projectImageURLSource = reader.result;
    }
  }

  changeStopButton(process) {
    if (process.process_status == "STARTED") {
      process.showStopButton = true;
      process.showDisabledButton = false;
    }
    else if (process.process_status == "SUCCESS") {
      process.showDisabledButton = true;
      process.showStopButton = false;
    }
  }

  showProcesses() {
    this.runningProcesses.forEach(process => {
      if (process.process_created_date != null || process.process_created_date != undefined
        || process.process_updated_date != null || process.process_updated_date != undefined) {
        if (process.process_created_date.includes("T")) {
          process.process_created_date = process.process_created_date.replace("T", " ");
          process.process_created_date = process.process_created_date.replace(/\..*/g, "$'");
        }
        if (process.process_updated_date.includes("T")) {
          process.process_updated_date = process.process_updated_date.replace("T", " ");
          process.process_updated_date = process.process_updated_date.replace(/\..*/g, "$'");
        }
      }
      this.processData.push({
        processCreatedDate: process.process_created_date, processUpdatedDate: process.process_updated_date, projectId: process.projectId, processId: process.processId, trainingId: process.training_id, processType: process.process_type, processStatus: process.process_status, showStopButton: process.showStopButton,
        showDisabledButton: process.showDisabledButton, processRead: process.unread
      });
    });
    this.processesList = new MatTableDataSource(this.processData);
    this.processesList.paginator = this.processPaginator;
    this.processesList.sort = this.processTableSort;

    this.runningProcesses.forEach(runningProcess => {
      this.checkStatusPastProcesses(runningProcess);
    })
  }

  checkStatusPastProcesses(process) {
    let status: any;
    if (process.process_status != "REVOKED") {
      this._dataService.status(process.processId).subscribe(data => {
        status = data.status;
        this.createProcess(status, process);
        this.changeStopButton(process);
        if (process.process_status == "PENDING" || process.process_status == "STARTED") {
          let runningProcess = new ProcessingObject;
          this.createProcess(status, process);
          runningProcess = process;
          runningProcess.unread = false;
          runningProcess.showDisabledButton = false;
          this.changeStopButton(process);
          if (process.processId !== runningProcess.processId) {
            this.runningProcesses.push(runningProcess);
          }
          this.processData.forEach(process => {
            if (process.processId == runningProcess.processId) {
              process.processStatus = runningProcess.process_status;
              process.showStopButton = true;
              process.showDisabledButton = runningProcess.showDisabledButton;
              this.processesList = new MatTableDataSource(this.processData);
              this.processesList.paginator = this.processPaginator;
              this.processesList.sort = this.processTableSort;
            }
          })
        }
        if (process.process_status == "FAILURE" || process.process_status == "RETRY") {
          let failProcess = new ProcessingObject;
          this.createProcess(status, process);
          failProcess = process;
          failProcess.showStopButton = false;
          failProcess.showDisabledButton = true;
          this.changeStopButton(process);
          if (process.processId !== failProcess.processId) {
            this.runningProcesses.push(failProcess);
          }
          this.processData.forEach(process => {
            if (process.processId == failProcess.processId) {
              process.processStatus = failProcess.process_status;
              process.showStopButton = false;
              process.showDisabledButton = failProcess.showDisabledButton;
              this.processesList = new MatTableDataSource(this.processData);
              this.processesList.paginator = this.processPaginator;
              this.processesList.sort = this.processTableSort;
            }
          })
        }
      });
    }
  }

  createProcess(status, process) {
    process.process_created_date = process.process_created_date;
    process.process_updated_date = process.process_updated_date;
    process.projectId = process.projectId;
    process.processId = process.processId;
    process.process_data = status.process_data;
    process.process_type = status.process_type;
    process.process_status = status.process_status;
  }

  cleanProcessesList() {
    this.processData = [];
    this.processesList = new MatTableDataSource(this.processData);
  }

  editAllowedPropertiesValues(property) {
    let enableCreateValues = false;
    this.showPropertyInput(property);

    let selectedModelId;
    let selectedDatasetId;
    let modelList = this.getModelsByTaskArray();
    modelList.forEach(model => {
      if (model.name == this.selectedModel) {
        selectedModelId = model.id;
      }
    });
    let datasetList = this.getDatasetResponseData();
    datasetList.forEach(dataset => {
      if (dataset.name == this.selectedDataset) {
        selectedDatasetId = dataset.id;
      }
    })

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('create-allowed-properties-dialog.dialogTitle'),
      inputAllowedValue: null,
      inputDefaultValue: null,
      allowedValuesList: [],
      showIntegerInput: this.showIntegerInput,
      showFloatInput: this.showFloatInput,
      showTextInput: this.showTextInput,
      propertyName: property.name
    }

    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

    if (property.type == "LST") {
      if (property.allowed_value != null) {
        if (property.allowed_value.length == 1) {
          enableCreateValues = false;
        } else {
          enableCreateValues = true;
        }
      }
    } else {
      if (property.allowed_value != null) {
        if (property.allowed_value.length == 1) {
          enableCreateValues = true;
        }
        else if (property.allowed_value.length < 3 && property.allowed_value[0].includes(">") && property.allowed_value[0].includes(">=") && property.allowed_value[0].includes("<") && property.allowed_value[0].includes("<=")) {
          enableCreateValues = true;
        }
        else if (property.allowed_value[1] != null && property.allowed_value.length > 2 && !property.allowed_value[1].includes(",")) {
          enableCreateValues = true;
        } else {
          enableCreateValues = false;
        }
      } else {
        enableCreateValues = true;
      }
    }
    if (enableCreateValues == false) {
      this.openSnackBarBadRequest(this.translate.instant('create-allowed-properties-dialog.errorSingleAllowedValue'));
    } else {
      let dialogRef = this.dialog.open(CreateAllowedPropertiesDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        if (result) {
          let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
          this.propertyDefaultValue = result.inputDefaultValue;
          this.allowedValuesList = result.allowedValuesList;
          this.propertyAllowedValue = this.allowedValuesList.join(",");

          if (property.propertyId == null || property.propertyId == undefined) {
            this._dataService.createAllowedProperties(this.propertyAllowedValue, this.propertyDefaultValue, property.id, selectedModelId, selectedDatasetId).subscribe(data => {
              if (data.statusText == "Created") {
                dialogRefSpinner.close();
                this.openSnackBarOkRequest(this.translate.instant('create-allowed-properties-dialog.successMessageCreateValues'));

                this._dataService.allowedProperties(selectedModelId, property.id, selectedDatasetId).subscribe(data => {
                  if (data[0] != undefined) {
                    this.updateAllowedPropertiesList(property, data);
                  } else {
                    this._dataService.propertiesById(property.id).subscribe(data => {
                      if (data != undefined) {
                        this.updatePropertiesList(property, data);
                      }
                    })
                  }
                }, error => {
                  dialogRefSpinner.close();
                  this.openSnackBarBadRequest("Error: " + error.statusText);
                })
              }
            }, error => {
              dialogRefSpinner.close();
              this.openSnackBarBadRequest("Error: " + error.error.Error);
            })
          } else {
            this._dataService.updateAllowedProperties(property.id, this.propertyAllowedValue, this.propertyDefaultValue, property.propertyId, selectedModelId, selectedDatasetId).subscribe(data => {
              if (data.statusText == "OK") {
                dialogRefSpinner.close();
                this.openSnackBarOkRequest(this.translate.instant('create-allowed-properties-dialog.successMessageCreateValues'));

                this._dataService.allowedProperties(selectedModelId, property.propertyId, selectedDatasetId).subscribe(data => {
                  if (data[0] != undefined) {
                    this.updateAllowedPropertiesList(property, data);
                  } else {
                    this._dataService.propertiesById(property.propertyId).subscribe(data => {
                      if (data != undefined) {
                        this.updatePropertiesList(property, data);
                      }
                    })
                  }
                }, error => {
                  dialogRefSpinner.close();
                  this.openSnackBarBadRequest("Error: " + error.statusText);
                })
              }
            }, error => {
              dialogRefSpinner.close();
              this.openSnackBarBadRequest("Error: " + error.error.Error);
            })
          }
        }
      });
    }
  }

  showPropertyInput(property) {
    if (property.type == "INT") {
      this.showIntegerInput = true;
      this.showFloatInput = false;
      this.showTextInput = false;
    } else if (property.type == "FLT") {
      this.showIntegerInput = false;
      this.showFloatInput = true;
      this.showTextInput = false;
    } else if (property.type == "STR" || property.type == "LST") {
      this.showIntegerInput = false;
      this.showFloatInput = false;
      this.showTextInput = true;
    }
  }

  updateAllowedPropertiesList(property, data) {
    let allowedArray = [];
    let defaultAndAllowedArray = []
    this.dynamicPropertyList.forEach(propertyItem => {
      if (propertyItem.propertyData.name == property.name) {
        if (property.type == "LST") {
          this.updateDropdownAllowedProperty(data);
        }
        propertyItem.propertyData.id = data[0].id;
        propertyItem.propertyData.propertyId = data[0].property_id;
        propertyItem.propertyData.name = property.name;
        propertyItem.propertyData.type = property.type;
        propertyItem.propertyData.modelId = data[0].model_id;
        propertyItem.propertyData.datasetId = data[0].dataset_id;
        propertyItem.propertyData.default_value = data[0].default_value;
        propertyItem.propertyData.selectedOption = data[0].default_value;
        propertyItem.propertyData.allowed_value = data[0].allowed_value;
        if (property.name == "Epochs") {
          this.populateEpochProperty(data);
        }
        if (property.name == "Batch size") {
          this.populateBatchSizeProperty(data);
        }
        if (property.name == "Input width") {
          this.populateInputWidthProperty(data);
        }
        if (property.name == "Input height") {
          this.populateInputHeightProperty(data);
        }
        if (property.name == "Learning rate") {
          this.populateLearningRateProperty(data);
        }
        if (property.name == "Metric") {
          this.populateMetricProperty(data);
        }
        if (property.name == "Loss function") {
          this.populateLossProperty(data);
        }
        if (property.name == "Training augmentations") {
          this.populateTrainingAugmentationsProperty(data);
        }
        if (property.name == "Validation augmentations") {
          this.populateValidationAugmentationsProperty(data);
        }
        if (property.name == "Test augmentations") {
          this.populateTestAugmentationsProperty(data);
        }
      }
    })
  }

  updatePropertiesList(property, data) {
    this.dynamicPropertyList.forEach(propertyItem => {
      if (propertyItem.propertyData.name == property.name) {
        if (property.type == "LST") {
          this.updateDropdownProperty(data);
        }
        propertyItem.propertyData.id = data.id;
        propertyItem.propertyData.name = property.name;
        propertyItem.propertyData.type = property.type;
        propertyItem.propertyData.default_value = data.default;
        propertyItem.propertyData.allowed_value = data.values;
        propertyItem.propertyData.selectedOption = data.default_value;
      }
    })
  }

  populateEpochProperty(contentData) {
    this.epochAllowedValues = [];
    this.propertyAllowedValuesList = [];
    let epochArray = [];
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');

    this.epochAllowedValues.push(contentData[0].default_value);
    this.propertyAllowedValuesList = contentData[0].allowed_value.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.epochAllowedValues.push(value);
      }
    })
    //display with ; after creation
    this.epochAllowedValues.forEach(val => {
      if (val != contentData[0].default_value) {
        epochArray.push(val);
      }
    })
    this.epochValues = epochArray.join(',').replace(/,/g, '; ');
  }

  populateBatchSizeProperty(contentData) {
    this.batchSizeAllowedValues = [];
    this.propertyAllowedValuesList = [];
    let batchSizeArray = [];
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');

    this.batchSizeAllowedValues.push(contentData[0].default_value);
    this.propertyAllowedValuesList = contentData[0].allowed_value.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.batchSizeAllowedValues.push(value);
      }
    })
    //display with ; after creation
    this.batchSizeAllowedValues.forEach(val => {
      if (val != contentData[0].default_value) {
        batchSizeArray.push(val);
      }
    })
    this.batchSizeValues = batchSizeArray.join(',').replace(/,/g, '; ');
  }

  populateInputWidthProperty(contentData) {
    this.inputWidthAllowedValues = [];
    this.propertyAllowedValuesList = [];
    let inputWidthArray = [];
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');

    this.inputWidthAllowedValues.push(contentData[0].default_value);
    this.propertyAllowedValuesList = contentData[0].allowed_value.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.inputWidthAllowedValues.push(value);
      }
    })
    this.inputWidthAllowedValues.forEach(val => {
      if (val != contentData[0].default_value) {
        inputWidthArray.push(val);
      }
    })
    this.inputWidthValues = inputWidthArray.join(',').replace(/,/g, '; ');
  }

  populateInputHeightProperty(contentData) {
    this.inputHeightAllowedValues = [];
    this.propertyAllowedValuesList = [];
    let inputHeightArray = [];
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');

    this.inputHeightAllowedValues.push(contentData[0].default_value);
    this.propertyAllowedValuesList = contentData[0].allowed_value.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.inputHeightAllowedValues.push(value);
      }
    })
    this.inputHeightAllowedValues.forEach(val => {
      if (val != contentData[0].default_value) {
        inputHeightArray.push(val);
      }
    })
    this.inputHeightValues = inputHeightArray.join(',').replace(/,/g, '; ');
  }

  populateLearningRateProperty(contentData) {
    this.learningRateAllowedValues = [];
    this.propertyAllowedValuesList = [];
    let learningRateArray = []
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');

    this.learningRateAllowedValues.push(contentData[0].default_value);
    this.propertyAllowedValuesList = contentData[0].allowed_value.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.learningRateAllowedValues.push(value);
      }
    })
    this.learningRateAllowedValues.forEach(val => {
      if (val != contentData[0].default_value) {
        learningRateArray.push(val);
      }
    })
    this.learningRateValues = learningRateArray.join(',').replace(/,/g, '; ');
  }

  populateLossProperty(contentData) {
    this.lossFunctionAllowedValues = [];
    this.propertyAllowedValuesList = [];
    this.dropdownValues = null;
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');
    this.propertyItemData.allowedValuesLoss = [];

    this.lossFunctionAllowedValues.push(contentData[0].default_value);
    this.dropdownValues = contentData[0].allowed_value.join(",");
    this.propertyAllowedValuesList = this.dropdownValues.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.lossFunctionAllowedValues.push(value);
        this.propertyItemData.allowedValuesLoss.push(value);
      }
    })
    this.propertyItemData.allowedValuesLoss = this.lossFunctionAllowedValues.join(',').replace(/,/g, '; ');
  }

  populateMetricProperty(contentData) {
    this.metricAllowedValues = [];
    this.propertyAllowedValuesList = [];
    this.dropdownValues = null;
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');
    this.propertyItemData.allowedValuesMetric = [];

    this.metricAllowedValues.push(contentData[0].default_value);
    this.dropdownValues = contentData[0].allowed_value.join(",");
    this.propertyAllowedValuesList = this.dropdownValues.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.metricAllowedValues.push(value);
        this.propertyItemData.allowedValuesMetric.push(value);
      }
    })
    this.propertyItemData.allowedValuesMetric = this.metricAllowedValues.join(',').replace(/,/g, '; ');
  }

  populateTrainingAugmentationsProperty(contentData) {
    this.trainingAugmentationsAllowedValues = [];
    this.propertyAllowedValuesList = [];
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');

    this.trainingAugmentationsAllowedValues.push(contentData[0].default_value);
    this.propertyAllowedValuesList = contentData[0].allowed_value.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.trainingAugmentationsAllowedValues.push(value);
      }
    })
  }

  populateValidationAugmentationsProperty(contentData) {
    this.validationAugmentationsAllowedValues = [];
    this.propertyAllowedValuesList = [];
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');

    this.validationAugmentationsAllowedValues.push(contentData[0].default_value);
    this.propertyAllowedValuesList = contentData[0].allowed_value.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.validationAugmentationsAllowedValues.push(value);
      }
    })
  }

  populateTestAugmentationsProperty(contentData) {
    this.testAugmentationsAllowedValues = [];
    this.propertyAllowedValuesList = [];
    this.propertyItemData.defaultType = this.translate.instant('project.defaultProperty');
    this.propertyItemData.allowedType = this.translate.instant('project.allowedProperty');

    this.testAugmentationsAllowedValues.push(contentData[0].default_value);
    this.propertyAllowedValuesList = contentData[0].allowed_value.split(",");
    this.propertyAllowedValuesList.forEach(value => {
      if (value != contentData[0].default_value) {
        this.testAugmentationsAllowedValues.push(value);
      }
    })
  }

  updateDropdownAllowedProperty(contentData) {
    var propertyValuesNameList = Array<string>();
    if (contentData[0].allowed_value != null) {
      propertyValuesNameList = contentData[0].allowed_value.split(",");;
    } else {
      propertyValuesNameList = contentData[0].default_value;
    }
    contentData[0].allowed_value = [];
    contentData[0].allowed_value = propertyValuesNameList;

    propertyValuesNameList.push(contentData[0].default_value);
    this.selectedOption = contentData[0].default_value;
  }

  updateDropdownProperty(contentData) {
    var propertyValuesNameList = Array<string>();
    if (contentData.values != null) {
      propertyValuesNameList = contentData[0].allowed_value.split(",");;
    } else {
      propertyValuesNameList = contentData.default;
    }
    contentData.values = [];
    contentData.values = propertyValuesNameList;

    propertyValuesNameList.push(contentData.default_value);
    this.selectedOption = contentData.default;
  }

  openSnackBarOkRequest(message) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['ok-request-custom-class'];
    config.duration = 20000;
    this.snackBar.open(message, "close", config);
  }

  openSnackBarBadRequest(message) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['bad-request-custom-class'];
    config.duration = 20000;
    this.snackBar.open(message, "close", config);
  }
}
