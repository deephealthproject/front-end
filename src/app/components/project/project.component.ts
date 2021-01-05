import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InteractionService } from '../../services/interaction.service';
import { DataService } from '../../services/data.service';
import { MatDialogConfig, MatDialog, MatSnackBar, MatTableDataSource, MatSort, MatPaginator, MatSelectionList } from '@angular/material';
import { ConfirmDialogTrainComponent } from '../confirm-dialog-train/confirm-dialog-train.component';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PropertyInstance, Project, Model, Dataset, Weight, User, PermissionStatus, ProcessingObject, ProcessStatus } from '../power-user/power-user.component';
import { UploadDatasetsDialogComponent } from '../upload-datasets-dialog/upload-datasets-dialog.component';
import { UpdateWeightDialogComponent } from '../update-weight-dialog/update-weight-dialog.component';
import { ShowOutputDetailsDialogComponent } from '../show-output-details-dialog/show-output-details-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export class Task {
  id: number;
  name: string;
  checked: boolean;
}

export enum UploadModelStatus {
  pending,
  started,
  retry,
  failure,
  success
}

export class DropdownResponse {
  name;
  id;
  default_value;
  allowed_value;
  type;
}

export interface WeightData {
  WeightId: number;
  WeightName: string;
  weightCeleryId: string;
  weightDatasetId: number;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {

  fileTempLocation: string;

  //div-right tabs
  configurationIsClicked = true;
  networkStatisticsIsClicked = false;
  notificationsIsClicked = false;
  editWeightsIsClicked = false;
  outputResultsIsClicked = false;
  editProjectIsClicked = false;

  //divs show status
  divMiddleShowStatus = true;
  divLeftShowStatus = true;
  divNetworkStatisticsShowStatus = false;
  divDetailsLeftSideShowStatus = false;
  divNotificationsShowStatus = false;
  divEditWeightsShowStatus = false;
  divOutputResultsShowStatus = false;
  divEditProjectShowStatus = false;

  //Task radio buttons
  tasks: Task[];

  //Input Type radio buttons
  checkedStateImageInputType = false;
  checkedStateTextInputType = false;
  checkedState3DInputType = false;
  checkedStateVideoInputType = false;

  public message: string;

  //selectors option list
  selectors: Array<string> = ["model", "dataset", "metric", "loss", "learning_rate", "epochs", "batchSize", "inputHeight", "inputWidth"];
  modelDropdown;
  datasetDropdown;
  metricDropdown;
  lossDropdown;
  optimizerDropdown;
  learningRateDropdown;
  epochsDropdown;
  batchSizeDropdown;
  inputHeightDropdown;
  inputWidthDropdown;
  weightDropdown;

  //selectors currently selected option
  selectedOptionModel = null;
  selectedOptionDataset = null;
  selectedOptionLoss = null;
  selectedOptionMetric = null;
  selectedOptionOptimizer = null;
  selectedOptionEpochs = null;
  selectedOptionBatchSize = null;
  selectedOptionInputHeight = null;
  selectedOptionInputWidth = null;
  selectedOptionWeight = null;
  selectedOptionProperty = null;

  //slide toggle
  // reTrainState = false;

  //properties
  useDropoutCheckedState: boolean = false;
  learningRateValue;
  epochsValue;
  batchSizeValue;
  inputHeightValue;
  inputWidthValue;
  metricValue;
  checked;

  trainingAugmentationsValue;
  validationAugmentationsValue;
  testAugmentationsValue;

  //data augmentation
  flippingCheckedState;
  rotationCheckedState;
  colorJitterCheckedState;
  gaussianNoiseCheckedState;
  croppingCheckedState;
  scalingCheckedState;
  shiftingCheckedState;
  shearingCheckedState;

  dropDownDetailsResponseData: DropdownResponse[];
  datasetResponseData = undefined;
  pretrainingResponseData = undefined;
  weightsResponseData = undefined;
  lossResponseData = undefined;
  propertiesResponseData: Array<PropertyInstance>;

  selectedTaskId;
  selectedWeight;

  dataAugmentation = [
    { label: 'Flipping', selected: false },
    { label: 'Rotation', selected: false },
    { label: 'Color Jitter', selected: false },
    { label: 'Gaussian Noise', selected: false },
    { label: 'Cropping', selected: false },
    { label: 'Scaling', selected: false },
    { label: 'Shifting', selected: false },
    { label: 'Shearing', selected: false }
  ];

  selectedModel;
  selectedProperty;
  selectedDataset;
  selectedProcess;

  trainProcessId;
  inferenceProcessId;

  searchIcon = "search";
  markUnreadIcon = "markUnread";
  stopProcessIcon = "stopProcess";
  inputProcessId: string;

  trainProcessStarted = false;
  inferenceProcessStarted = false;
  disabledTrainButton = false;
  disabledInferenceButton = false;
  disabledInferenceSingleButton = false;
  showInference = false;
  trainSpinner = false;
  showTrainButton = true;
  disabledStopButton = false;
  process_type: string;
  trainMessage: string = null;
  inferenceMessage: string = null;
  //runningProcesses: ProcessingObject[] = [];
  modelsResponseData: Array<Model>;
  currentProject: Project;
  fullStatusProcess = false;

  selectedInputType = null;

  //upload Dataset
  datasetName: string;
  datasets: Array<Dataset> = [];
  datasetPath: string;
  isUrlLink = false;
  datasetPublic: Boolean = true;

  //upload Model
  modelName: string;
  modelPath: string;
  datasetId: number;
  modelData: string;
  uploadStatusVar;

  //updateWeights
  weights: Array<Weight> = [];
  weightName: string;
  weightsList: MatTableDataSource<any>;
  weightDetails: MatTableDataSource<any>;
  displayedWeightDetailsColumns: string[] = ['Weight_Id', 'Name', 'dataset_name', 'model_name', 'pretrained_on', 'celery_id'];
  displayedColumns: string[] = ['weightId', 'weightName', 'weightCeleryId', 'weightDatasetId', 'weightOptions'];
  weightsEditData = [];
  selectedOptionModelEditList = null;
  modelIdEditWeight = null;
  selectedValueEditWeight = undefined;
  weightIdForTitle: any;
  showWeightDetailsTable: boolean = false;

  weightOwners;
  weightDisplayMode;
  inputWeightName: string;

  //project users
  users = [];
  usersArray: Array<User> = [];
  usersAssociatedArray = [];
  disabledSaveUpdateButton = true;
  disabledCancelUpdateButton = true;
  projectNameValue = this._interactionService.projectName;
  projectOwnerValue = this._interactionService.projectOwner;
  selectedUsersData;
  selectedAssociatedUsers;
  disabledDeleteUsersButton = true;
  projectUsersList = [];
  inputProjectName: string;
  inputUsersName: string;

  searchText = '';

  //inference single
  datasetImagePath: string;
  datasetImageData: string;

  //output
  outputList: MatTableDataSource<any>;
  outputResultsData = [];
  displayedOutputColumns: string[] = ['outputImage', 'outputDetails']
  outputResultsDetailProcessId;
  outputResultsRunning: MatTableDataSource<any>;
  displayedOutputResultsRunningColumns: string[] = ['Model_Id', 'Dataset_Id', 'Weight_Id', 'Epoch', 'Loss_Function', 'Metric', 'Batch_Size', 'Input_Height', 'Input_Width', 'Training_Augmentations', 'Validation_Augmentations'];
  outputResultsFinished: MatTableDataSource<any>;
  showOutputRunning: boolean = false;
  showOutputInferenceSingle: boolean = false;
  showGraphicProcess: boolean = false;
  showProgressBarProcess: boolean = false;
  outputInference: number = 0;

  values: any[];
  view: any[] = [1290, 370];
  crossEntropyChartValues = [];
  categoricalAccuracyChartValues = [];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Cross entropy';
  yAxisLabel: string = 'Categorical accuracy';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  constructor(public _interactionService: InteractionService, private _dataService: DataService, private _authService: AuthService,
    public dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.matIconRegistry.addSvgIcon(
      'search',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-search-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'markUnread',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-markunread-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'stopProcess',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/stop_circle-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'showOutput',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/format_list_bulleted-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'inavailable',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/block-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'viewDetails',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/visibility-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/edit-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/delete-24px.svg')
    );
  }

  @ViewChild('loss') loss: ElementRef;
  @ViewChild('learningRate') learningRate: ElementRef;
  @ViewChild('useDropout') useDropout: ElementRef;
  @ViewChild('inference') inference: ElementRef;
  @ViewChild('inferenceSingle') inferenceSingleButton: ElementRef;
  @ViewChild('dataAugmentationSection') dataAugmentationSection: ElementRef;
  @ViewChild('trainButton') trainButton: ElementRef;
  @ViewChild('epochs') epochs: ElementRef;
  @ViewChild('batchSize') batchSize: ElementRef;
  @ViewChild('optimizer') optimizer: ElementRef;
  @ViewChild('inputHeight') inputHeight: ElementRef;
  @ViewChild('inputWidth') inputWidth: ElementRef;
  @ViewChild('trainingAugmentations') trainingAugmentations: ElementRef;
  @ViewChild('validationAugmentations') validationAugmentations: ElementRef;
  @ViewChild('testAugmentations') testAugmentations: ElementRef;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSelectionList) usersSelection: MatSelectionList;
  @ViewChild(MatSelectionList) associatedUsersSelection: MatSelectionList;

  ngOnInit() {
    this.initialiseShowStatusProjectDivs();
    this.initialiseDivRightClickedButtons();
    this.initialiseTasks();
    this.getTasks();

    this.initialiseInputTypes();
    this.initialiseImageInput();
    this.initialiseDropdowns();
    this.initialiseProperties()
    this.initiliaseSelectedOptions();
    this.initialiseSelectedModel();
    this.initialiseSelectedDataset();
    this.initialiseInferenceButton();
    this.initialiseInferenceSingleButton();
    this.initialiseTrainButton();

    this.getUsers();
    this.initialiseUsersList();
    this.initialiseAssociatedUsersList();
    this.initialiseSaveUpdateButton();
    this.initialiseCancelUpdateButton();

    this.cleanWeightsEditList();
    if (localStorage.getItem('accessToken') == null) {
      this.router.navigate(['/']);
    }
  }

  initialiseCurrentProject() {
    this._interactionService.currentProject$.subscribe(
      project => {
        this._interactionService.currentProject = project;
      }
    );
  }

  initialiseInferenceButton() {
    this._interactionService.inferenceButtonState$.subscribe(
      state => {
        this.disabledInferenceButton = state;
      }
    );
  }

  initialiseInferenceSingleButton() {
    this._interactionService.inferenceSingleButtonState$.subscribe(
      state => {
        this.disabledInferenceSingleButton = state;
      }
    );
  }

  initialiseTrainButton() {
    this._interactionService.trainButtonState$.subscribe(
      state => {
        this.disabledTrainButton = state;
      }
    )
  }

  initialiseStopButton() {
    this._interactionService.stopButtonState$.subscribe(
      state => {
        this.disabledStopButton = state;
      }
    )
  }

  initialiseSelectedModel() {
    this._interactionService.selectedModelId$.subscribe(
      model => {
        this.selectedModel = model;
      }
    )
  }

  initialiseSelectedDataset() {
    this._interactionService.selectedDataId$.subscribe(
      dataset => {
        this.selectedDataset = dataset;
      }
    )
  }

  initialiseDropdowns() {
    //clears dropdowns
    this._interactionService.dropdownModel$.subscribe(
      state => {
        this.modelDropdown = state;
      }
    );

    this._interactionService.dropdownWeights$.subscribe(
      state => {
        this.weightDropdown = state;
      }
    );

    this._interactionService.dropdownDataset$.subscribe(
      state => {
        this.datasetDropdown = state;
      }
    );
  }

  initialiseProperties() {
    this._interactionService.dropdownLoss$.subscribe(
      state => {
        this.lossDropdown = state;
      }
    );

    this._interactionService.learningRateValue$.subscribe(
      state => {
        this.learningRateValue = state;
      }
    );

    this._interactionService.dropdownMetric$.subscribe(
      state => {
        this.metricDropdown = state;
      }
    );

    this._interactionService.epochsValueSource$.subscribe(
      state => {
        this.epochsValue = state;
      }
    );

    this._interactionService.batchSizeValueSource$.subscribe(
      state => {
        this.batchSizeValue = state;
      }
    );

    this._interactionService.inputHeightValueSource$.subscribe(
      state => {
        this.inputHeightValue = state;
      }
    );

    this._interactionService.inputWidthValueSource$.subscribe(
      state => {
        this.inputWidthValue = state;
      }
    )

    this._interactionService.trainingAugmentationsValueSource$.subscribe(
      state => {
        this.trainingAugmentationsValue = state;
      }
    )

    this._interactionService.validationAugmentationsValueSource$.subscribe(
      state => {
        this.validationAugmentationsValue = state;
      }
    )

    this._interactionService.testAugmentationsValueSource$.subscribe(
      state => {
        this.testAugmentationsValue = state;
      }
    )
  }

  initialiseImageInput() {
    this._interactionService.projectDivDetailsLeftSideShowStatus$.subscribe(
      state => {
        this.divDetailsLeftSideShowStatus = state;
      }
    );
  }

  initialiseShowStatusProjectDivs() {
    this._interactionService.projectDivMiddleShowStatus$.subscribe(
      state => {
        this.divMiddleShowStatus = state;
      }
    );

    this._interactionService.projectDivLeftShowStatus$.subscribe(
      state => {
        this.divLeftShowStatus = state;
      }
    );

    this._interactionService.projectDivNetworkStatisticsShowStatus$.subscribe(
      state => {
        this.divNetworkStatisticsShowStatus = state;
      }
    );

    this._interactionService.projectDivNotificationsShowStatus$.subscribe(
      state => {
        this.divNotificationsShowStatus = state;
      }
    );

    this._interactionService.projectDivEditWeightsShowStatus$.subscribe(
      state => {
        this.divEditWeightsShowStatus = state;
      }
    );

    this._interactionService.projectDivOutputResultsShowStatus$.subscribe(
      state => {
        this.divOutputResultsShowStatus = state;
      }
    )

    this._interactionService.projectDivEditProjectShowStatus$.subscribe(
      state => {
        this.divEditProjectShowStatus = state;
      }
    )
  }

  initiliaseSelectedOptions() {
    this._interactionService.selectedOptionModel$.subscribe(
      state => {
        this.selectedOptionModel = state;
      }
    );

    this._interactionService.selectedOptionDataset$.subscribe(
      state => {
        this.selectedOptionDataset = state;
      }
    );

    this._interactionService.selectedOptionMetric$.subscribe(
      state => {
        this.selectedOptionMetric = state;
      }
    );

    this._interactionService.selectedOptionLoss$.subscribe(
      state => {
        this.selectedOptionLoss = state;
      }
    );
  }

  initialiseTasks() {
    this._interactionService.checkedTask$.subscribe(
      id => {
        this._interactionService.selectedTask = id;
      }
    );
  }

  initialiseInputTypes() {
    this._interactionService.checkedStateVideo$.subscribe(
      state => {
        this.checkedStateVideoInputType = state;
      }
    );

    this._interactionService.checkedStateImage$.subscribe(
      state => {
        this.checkedStateImageInputType = state;
      }
    );

    this._interactionService.checkedStateText$.subscribe(
      state => {
        this.selectedInputType = state;
      }
    );

    this._interactionService.checkedState3D$.subscribe(
      state => {
        this.checkedState3DInputType = state;
      }
    );

  }

  initialiseDivRightClickedButtons() {
    this._interactionService.projectConfigurationIsClicked$.subscribe(
      state => {
        this.configurationIsClicked = state;
      }
    );

    this._interactionService.projectNetworkStatisticsIsClicked$.subscribe(
      state => {
        this.networkStatisticsIsClicked = state;
      }
    );

    this._interactionService.projectNotificationsIsClicked$.subscribe(
      state => {
        this.notificationsIsClicked = state;
      }
    );

    this._interactionService.projectEditWeightsIsClicked$.subscribe(
      state => {
        this.editWeightsIsClicked = state;
      }
    )

    this._interactionService.projectOutputResultsIsClicked$.subscribe(
      state => {
        this.outputResultsIsClicked = state;
      }
    )

    this._interactionService.projectEditProjectIsClicked$.subscribe(
      state => {
        this.editProjectIsClicked = state;
      }
    )
  }

  initialiseUsersList() {
    this._interactionService.usersList$.subscribe(
      usersArray => {
        this.usersArray = usersArray;
      }
    );
  }

  initialiseAssociatedUsersList() {
    this._interactionService.usersAssociatedList$.subscribe(
      usersAssociatedArray => {
        this.usersAssociatedArray = usersAssociatedArray;
      }
    )
  }

  initialiseSaveUpdateButton() {
    this._interactionService.editProjectButtonState$.subscribe(
      state => {
        this.disabledSaveUpdateButton = state;
      }
    )
  }

  initialiseCancelUpdateButton() {
    this._interactionService.cancelEditProjectButtonState$.subscribe(
      state => {
        this.disabledCancelUpdateButton = state;
      }
    )
  }

  initialiseDeleteProjectUsersButton() {
    this._interactionService.deleteProjectUsersButtonState$.subscribe(
      state => {
        this.disabledDeleteUsersButton = state;
      }
    )
  }

  resetSelectedOptions() {
    this._interactionService.resetSelectedOptions();
  }

  uploadDataset() {
    this._interactionService.uploadModelIsClicked = false;
    let taskId;
    this.tasks.forEach(task => {
      if (task.id == this._interactionService.currentProject.task_id) {
        taskId = task.id;
      }
    })
    this._authService.getUsers().subscribe(usersData => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        inputValue: this.datasetName,
        dialogTitle: this.translate.instant('project.uploadDatasetProcess'),
        dialogContent: this.translate.instant('project.uploadDatasetContent'),
        inputPlaceHolder: this.translate.instant('project.uploadDatasetName'),
        isUrlLink: this.isUrlLink,
        inputValuePath: this.datasetPath,
        datasetDisplayMode: this._interactionService.projectDatasetDisplayMode,
        selectedUsername: null,
        userDropdown: usersData
      }

      let dialogRef = this.dialog.open(UploadDatasetsDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        if (result) {
          if (result.inputValue) {
            let thatDatasetExist = false;
            for (let currentDataset of this.datasets) {
              if (currentDataset.name == result.inputValue) {
                thatDatasetExist = true;
              }
            }
            if (thatDatasetExist == false) {
              this.datasetName = result.inputValue;
              this.isUrlLink = result.isUrlLink;
              this.datasetPublic = result.datasetDisplayMode;
              if (this.isUrlLink == true) {
                this.datasetPath = null;
                this.datasetPath = result.inputValuePath;
              }
              else {
                this.datasetPath = result.inputValuePath;
              }
              for (let currentUser of this.usersArray) {
                if (currentUser.username == this._interactionService.username) {
                  this.users.push({
                    "username": currentUser.username,
                    "permission": PermissionStatus[0]
                  });
                }
              }
              if (result.selectedUsername != null && result.selectedUsername.length == 1) {
                this.users.push({
                  "username": result.selectedUsername[0],
                  "permission": PermissionStatus[1]
                });
              }
              else if (result.selectedUsername != null && result.selectedUsername.length > 1) {
                result.selectedUsername.forEach(selectedUsername => {
                  this.users.push({
                    "username": selectedUsername,
                    "permission": PermissionStatus[1]
                  });
                });
              }
              this._dataService.uploadDataset(this.datasetName, taskId, this.datasetPath, this.users, this.datasetPublic).subscribe(data => {
                if (data.statusText == "Created") {
                  this.openSnackBar(this.translate.instant('project.uploadDatasetResult'));
                  console.log("dataset " + this.datasetName + " uploaded");
                }
              }, error => {
                this.openSnackBar("Error: " + error.error.error);
              });
            }
          }
        } else {
          console.log('Canceled');
        }
      });
    });
  }

  uploadModel() {
    this._interactionService.uploadModelIsClicked = true;

    let taskId;
    this.tasks.forEach(task => {
      if (task.id == this._interactionService.currentProject.task_id) {
        taskId = task.id;
      }
    })
    this._dataService.getDatasets(taskId).subscribe(datasetData => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        inputValue: this.modelName,
        dialogTitle: this.translate.instant('project.uploadModelProcess'),
        dialogContent: this.translate.instant('project.uploadModelContent'),
        inputPlaceHolder: this.translate.instant('project.uploadModelName'),
        isUrlLink: this.isUrlLink,
        inputValuePath: this.modelPath,
        selectedDatasetName: null,
        modelData: this.modelData,
        datasetDropdownForUploadModel: datasetData
      }

      let dialogRef = this.dialog.open(UploadDatasetsDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        if (result) {
          if (result.inputValue) {
            let thatModelExist = false;
            for (let currentModel of this.modelDropdown) {
              if (currentModel == result.inputValue) {
                thatModelExist = true;
              }
            }
            if (thatModelExist == false) {
              this.modelName = result.inputValue;
              this.isUrlLink = result.isUrlLink;
              this.modelData = result.modelData;
              if (this.isUrlLink == true) {
                this.modelPath = null;
                this.modelPath = result.inputValuePath;
              }
              else {
                this.modelPath = result.inputValuePath;
              }
              result.datasetDropdownForUploadModel.forEach(element => {
                if (element.name == result.selectedDatasetName) {
                  this.datasetId = element.id;
                }
              });
              this._dataService.uploadModel(this.modelName, taskId, this.modelPath, this.modelData, this.datasetId).subscribe(data => {
                if (data.statusText == "Created") {
                  this.openSnackBar(this.translate.instant('project.uploadModelResult'));
                  console.log(data.body);
                  let process = new ProcessingObject;
                  process.projectId = this._interactionService.currentProject.id;
                  process.processId = data.body.process_id;
                  process.process_status = UploadModelStatus[0];
                  process.process_type = this.process_type;
                  process.unread = true;
                  this._interactionService.changeStopButton(process);
                  this._interactionService.runningProcesses.push(process);
                  setTimeout(() => {
                    this.checkStatusUploadModel(process);
                  }, 10);
                }
              }, error => {
                this.openSnackBar("Error: " + error.statusText);
              });
            } else {
              this.openSnackBar(this.translate.instant('project.uploadModelExists'));
            }
          }
        } else {
          console.log('Canceled');
        }
      });
    });
  }

  checkStatusUploadModel(process) {
    console.log(process);
    this._dataService.status(process.processId).subscribe(data => {
      let status: any = data.status;
      process.projectId = status.projectId;
      process.process_data = status.process_data;
      process.process_type = status.process_type;
      process.process_status = status.result;
      this._interactionService.changeStopButton(process);
      if (process.process_status == "pending") {
        console.log(process.process_status);
        setTimeout(() => {
          this.checkStatusUploadModel(process)
        }, 10 * 10);
      }
      else if (process.process_status == "success") {
        this.openSnackBar(this.translate.instant('project.finishedUploadModelProcessMessage'));
        console.log("Model " + this.modelName + " uploaded");
        this._interactionService.increaseNotificationsNumber();
      }
      else if (process.process_status == "failure" || process.process_status == "retry") {
        this.openSnackBar(this.translate.instant('project.errorUploadModelProcessMessage'));
      }
    })
  }

  resetDropDownDetails() {
    this.modelDropdown = [];
    this.weightDropdown = [];
    this.datasetDropdown = [];
    this.metricDropdown = [];
    this.lossDropdown = [];
  }

  openConfiguration() {
    this._interactionService.changeShowStateProjectDivLeft(true);
    this._interactionService.changeShowStateProjectDivMiddle(true);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(true);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);
  }

  openNetworkStatistics() {
    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(true);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(true);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);
  }

  openNotifications() {
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
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);
  }

  openEditWeights() {
    this.cleanWeightsEditList();

    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(true);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(true);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);
  }

  openEditProject() {
    this.cleanProjectEditName();
    this.cleanProjectUsersEditLists();

    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(true);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(true);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);
  }

  openOutputResults() {
    this.openOutputResultCustom(null);
  }

  openOutputResultCustom(processIdNotification) {
    // TODO: clean first Grid
    this.cleanWeightsEditList();
    if (processIdNotification != undefined && processIdNotification != null) {
      // TODO: show info about output results from weights or from notification process
    }

    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(true);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(true);
  }

  displayOutputResultsOuputsTable(process) {
    console.log(process);
    if (process.processId != null || process.processId != undefined) {
      this.checkProcessStatusForOutput(process);
    }
    else if (process.weightCeleryId != null || process.weightCeleryId != undefined) {
      this.getOutput(process.weightCeleryId);
    }

    // clean second outputs details list grid
    this.cleanOutputResultsOuputsTableList();

    var testRealOutputs = {
      "outputs": [
        [
          "['https://jenkins-master-deephealth-unix01.ing.unimore.it/backend/media/imgs/1.png']",
          "[[4.5472843339666724e-05, 0.006470129359513521, 0.005621257703751326, 0.002127237617969513, 0.0007704696618020535, 0.9840483665466309, 3.123315400443971e-05, 0.00012626624084077775, 0.0007565256673842669, 3.0344513106683735e-06]]"
        ]
      ]
    }
  }

  getOutput(processId) {
    this._dataService.getOutput(processId).subscribe(data => {
      this.outputResultsDetailProcessId = processId;
      var outputsResults = data.outputs;
      let outputDetail = [];
      outputsResults.forEach(output => {
        JSON.parse(output[1]).forEach(element => {
          outputDetail = element;
        });
        this.outputResultsData.push({ outputImage: output[0].replace("['", "").replace("']", ""), outputDetails: outputDetail });
      });

      this.outputList = new MatTableDataSource(this.outputResultsData);
      this.outputList.sort = this.sort;
      this.outputList.paginator = this.paginator;
      this.openSnackBar(this.translate.instant('output-details-dialog.outputStatusOk'));
    }, error => {
      this.openSnackBar(this.translate.instant('output-details-dialog.outputStatusError'));
    })
  }

  checkProcessStatusForOutput(process) {
    if (process.process_status == "finished") {
      if (process.process_type == "training") {
        this.showGraphicProcess = true;
        this.showProgressBarProcess = false;
        this.showOutputRunningTable(process);
      } else {
        this.getOutput(process.processId);
        this.showOutputInferenceSingle = true;
        this.showGraphicProcess = false;
        this.showProgressBarProcess = false;
      }
    }
    else if (process.process_status == "running") {
      if (process.process_type == "training") {
        this.showGraphicProcess = true;
        this.showProgressBarProcess = false;
      }
      else if (process.process_type == "inference") {
        this.showProgressBarProcess = true;
        this.showGraphicProcess = false;
      } else {
        this.showProgressBarProcess = false;
        this.showGraphicProcess = false;
      }
      this.showOutputRunningTable(process);
    }
  }

  cleanOutputResultsOuputsTableList() {
    this.outputResultsDetailProcessId = undefined;
    this.outputResultsData = [];
    this.outputList = new MatTableDataSource(this.outputResultsData);
    this.showOutputRunning = false;
  }

  changeUseDropoutCheckedState() {
    this.useDropoutCheckedState = !this.useDropoutCheckedState;
  }

  changeLearningRateValue(event) {
    this.learningRateValue = event.target.value;
  }

  //train & inference functions
  trainModel() {
    this.process_type = "training";
    this.trainProcessStarted = true;
    this.trainSpinner = false;

    let selectedProperties: PropertyInstance[] = [];
    let learning = new PropertyInstance;
    learning.name = "Learning rate";
    learning.value = this.learningRateValue;
    if (learning.value >= 0.00000 && learning.value <= 0.99999) {
      selectedProperties.push(learning);
    }
    else {
      this.trainProcessStarted = false;
    }
    let loss = new PropertyInstance;
    loss.name = "Loss function";
    loss.value = this.selectedOptionLoss;
    selectedProperties.push(loss);
    // let epochs = new PropertyInstance;
    // epochs.name = "Epochs";
    // epochs.value = this.selectedOptionEpochs;
    // selectedProperties.push(epochs);
    // let batchSize = new PropertyInstance;
    // batchSize.name = "Batch size";
    // batchSize.value = this.selectedOptionBatchSize;
    // selectedProperties.push(batchSize);
    // let metric = new PropertyInstance;
    // metric.name = "Metric";
    // metric.value = this.selectedOptionMetric;
    // selectedProperties.push(metric);
    // let inputHeight = new PropertyInstance;
    // inputHeight.name = "Input height";
    // inputHeight.value = this.selectedOptionInputHeight;
    // let inputWidth = new PropertyInstance;
    // inputWidth.name = "Input width";
    // inputWidth.value = this.selectedOptionInputWidth;
    // let dropout = new PropertyInstance;
    // dropout.name = "Use dropout";
    // if(this.useDropoutCheckedState){
    //   dropout.value = "true";
    // }
    // else {
    //   dropout.value = "false";
    // }
    // selectedProperties.push(dropout);

    let selectedModelId;
    let modelList = this._interactionService.getModelsByTaskArray();
    modelList.forEach(model => {
      if (model.name == this.selectedOptionModel) {
        selectedModelId = model.id;
      }
    });

    let selectedWeightId;
    if (this.selectedOptionWeight) {
      this.weightsResponseData.forEach(weight => {
        if (weight.name == this.selectedOptionWeight) {
          selectedWeightId = weight.id;
        }
      });
    }
    else {
      selectedWeightId = null;
    }

    let selectedDatasetId;
    let datasetList = this._interactionService.getDatasetResponseData();
    if (this.selectedOptionDataset) {
      datasetList.forEach(dataset => {
        if (dataset.name == this.selectedOptionDataset) {
          selectedDatasetId = dataset.id;
        }
      })
    }
    else {
      selectedDatasetId = undefined;
    }

    if (this.trainProcessStarted == true) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        dialogTitle: this.translate.instant('project.trainNewModel'),
        dialogContent: this.translate.instant('project.areYouSureTrain'),
        trainingTime: this.translate.instant('project.estimatedTimeTrain'),
        modelSelected: this.selectedOptionModel,
        weightSelected: this.selectedOptionWeight,
        datasetSelected: this.selectedOptionDataset,
        process_type: this.process_type
      }

      let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        if (result && this.trainProcessStarted == true && this.selectedOptionModel != null && this.selectedOptionDataset != null) {
          this._dataService.trainModel(selectedDatasetId, selectedModelId, selectedWeightId, selectedProperties, this._interactionService.currentProject.id).subscribe(data => {
            // if (data.body.result == "ok") {
            //   this.trainSpinner = false;
            //   this.disabledTrainButton = true;
            // }
            this.openSnackBar(this.translate.instant('project.startedTrainProcessMessage'));
            this.trainSpinner = false;
            this.disabledTrainButton = true;
            this.trainProcessStarted = true;
            this.showTrainButton = false;
            let process = new ProcessingObject;
            process.projectId = this._interactionService.currentProject.id;
            process.processId = data.body.process_id;
            process.process_status = ProcessStatus[1];
            process.process_type = this.process_type;
            process.unread = true;
            this._interactionService.runningProcesses.push(process);
            this._interactionService.changeStopButton(process);
            setTimeout(() => {
              this.checkStatusTrain(process)
            }, 2000);
          }, error => {
            this.openSnackBar("Error: " + error.statusText);
          });
        }
      });
    }
    else {
      this.openSnackBar(this.translate.instant('project.errorStartedTrainProcessMessage'));
      this.trainProcessStarted = false;
      this.trainSpinner = false;
      this.showTrainButton = true;
      console.log('Canceled');
    }
  }

  inferenceModel() {
    this.process_type = "inference";
    this.disabledStopButton = false;
    this.inferenceProcessStarted = true;

    let selectedWeightId;
    if (this.selectedOptionWeight) {
      this.weightsResponseData.forEach(weight => {
        if (weight.name == this.selectedOptionWeight) {
          selectedWeightId = weight.id;
        }
      });
    }

    let selectedDatasetId;
    let datasetList = this._interactionService.getDatasetResponseData();
    if (this.selectedOptionDataset) {
      datasetList.forEach(dataset => {
        if (dataset.name == this.selectedOptionDataset) {
          selectedDatasetId = dataset.id;
        }
      })
    }
    else {
      selectedDatasetId = undefined;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('project.inference'),
      dialogContent: this.translate.instant('project.areYouSureInference'),
      trainingTime: this.translate.instant('project.estimatedTimePreTrain'),
      modelSelected: this.selectedOptionModel,
      datasetSelected: this.selectedOptionDataset,
      process_type: this.process_type
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result && this.selectedOptionModel != null && this.selectedOptionDataset != null) {
        this._dataService.inferenceModel(selectedWeightId, selectedDatasetId, this._interactionService.currentProject.id).subscribe(data => {
          if (data.body.result == "ok") {
            this.disabledInferenceButton = true;
          }
          this.openSnackBar(this.translate.instant('project.startedInferenceProcessMessage'));
          let process = new ProcessingObject;
          this.inferenceProcessStarted = true;
          process.projectId = this._interactionService.currentProject.id;
          process.processId = data.body.process_id;
          process.process_status = ProcessStatus[1];
          process.process_type = this.process_type;
          process.unread = true;
          this._interactionService.runningProcesses.push(process);
          this._interactionService.changeStopButton(process);
          setTimeout(() => {
            this.checkStatusInference(process)
          }, 2000);
          this.getOutputResultsOfInference(process);
        }, error => {
          this.openSnackBar("Error: " + error.statusText);
        })
      }
      else {
        this.inferenceProcessStarted = false;
        console.log('Canceled');
      }
    });
  }

  inferenceSingleMethod() {
    this.process_type = "inferenceSingle";
    this.disabledStopButton = false;
    this.inferenceProcessStarted = true;

    let selectedWeightId;
    if (this.selectedOptionWeight) {
      this.weightsResponseData.forEach(weight => {
        if (weight.name == this.selectedOptionWeight) {
          selectedWeightId = weight.id;
        }
      });
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      inputValue: this.datasetImagePath,
      dialogTitle: this.translate.instant('project.inferenceSingle'),
      dialogContent: this.translate.instant('project.areYouSureInference'),
      trainingTime: this.translate.instant('project.estimatedTimePreTrain'),
      modelSelected: this.selectedOptionModel,
      datasetSelected: this.selectedOptionDataset,
      process_type: this.process_type,
      datasetImageData: this.datasetImageData
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result && this.selectedOptionModel != null) {
        this.datasetImagePath = result.inputValue;
        this.datasetImageData = result.datasetImageData;
        this._dataService.inferenceSingle(selectedWeightId, this.datasetImagePath, this.datasetImageData, this._interactionService.currentProject.id).subscribe(data => {
          if (data.body.result == "ok") {
            this.disabledInferenceSingleButton = true;
          }
          this.openSnackBar(this.translate.instant('project.startedInferenceProcessMessage'));
          let process = new ProcessingObject;
          this.inferenceProcessStarted = true;
          process.projectId = this._interactionService.currentProject.id;
          process.processId = data.body.process_id;
          process.process_status = ProcessStatus[1];
          process.process_type = this.process_type;
          process.unread = true;
          this._interactionService.runningProcesses.push(process);
          this._interactionService.changeStopButton(process);
          setTimeout(() => {
            this.checkStatusInference(process)
          }, 2000);
          this.getOutputResultsOfInference(process);
        }, error => {
          this.openSnackBar("Error: " + error.statusText);
        });
      }
      else {
        this.inferenceProcessStarted = false;
        console.log('Canceled');
      }
    });
  }

  checkStatusTrain(process) {
    console.log(process);
    this._dataService.status(process.processId).subscribe(data => {
      let status: any = data.status;
      process.projectId = process.projectId;
      process.process_data = status.process_data;
      process.process_type = status.process_type;
      process.process_status = status.process_status;
      this._interactionService.changeStopButton(process);
      if (process.process_status == "running") {
        console.log(process.process_status);
        // this.disabledStopButton = false;
        setTimeout(() => {
          this.checkStatusTrain(process)
        }, 10 * 1000);
      }
      if (process.process_status == "finished") {
        this.openSnackBar(this.translate.instant('project.finishedTrainProcessMessage'));
        this.trainProcessStarted = false;
        // this.disabledStopButton = true;
        this.trainSpinner = false;
        this._interactionService.increaseNotificationsNumber();
      }
      this.trainMessage = "The process of the type " + process.process_type + ", with the id " + process.processId + ", has the status: " + process.process_status;
    })
  }

  checkStatusInference(process) {
    console.log(process);
    this._dataService.status(process.processId).subscribe(data => {
      let status: any = data.status;
      process.projectId = process.projectId;
      process.process_data = status.process_data;
      process.process_type = status.process_type;
      process.process_status = status.process_status;
      this._interactionService.changeStopButton(process);
      if (process.process_status == "running") {
        console.log(process.process_status);
        // this.disabledStopButton = false;
        setTimeout(() => {
          this.checkStatusInference(process)
        }, 10 * 1000);
      }
      if (process.process_status == "finished") {
        this.openSnackBar(this.translate.instant('project.finishedInferenceProcessMessage'));
        this.inferenceProcessStarted = false;
        // this.disabledStopButton = true;
        this.trainSpinner = false;
        this._interactionService.increaseNotificationsNumber();
      }
      this.inferenceMessage = "The process of the type " + process.process_type + ", with the id " + process.processId + ", has the status: " + process.process_status;
    })
    // TODO: catch error case
  }

  getOutputResultsOfInference(process) {
    this._dataService.output(process.processId).subscribe(data => {
      console.log(data);
    })
  }

  //Task functions
  getTasks() {
    this._dataService.getTasks().subscribe(data => {
      console.log(data);
      if (data.body != undefined || data != undefined) {
        this.populateTasks(data);
      }
    })
  }

  populateTasks(contentData) {
    var valuesNameList = [];
    contentData.forEach(task => {
      task.checked = false;
      valuesNameList.push(task);
    });
    this.tasks = valuesNameList;
  }

  changeCheckedTask(checkedButton: Task) {
    this.updateProjectsTaskId(checkedButton.id);
    if (checkedButton.id != undefined || checkedButton.id != null) {
      this.selectedTaskId = checkedButton.id;
      this._interactionService.initialiseModelDropdown(this.selectedTaskId);
      this.weightDropdown = [];

      console.log("task id: " + this.selectedTaskId);
      console.log("the checked task: " + checkedButton.name);
    }
  }

  getWeights(modelName: string) {
    let modelId;
    let modelList = this._interactionService.getModelsByTaskArray();
    modelList.forEach(model => {
      if (model.name == modelName) {
        modelId = model.id;
      }
    });
    this._dataService.getWeights(modelId).subscribe(data => {
      this.updateWeightsList(data);
    })
  }

  updateModelsList(contentData) {
    var modelsValuesNameList = [];
    this.selectedOptionModel = null;
    this.modelsResponseData = contentData;
    contentData.forEach(model => {
      modelsValuesNameList.push(model.name);
    });
    this.modelDropdown = modelsValuesNameList;
  }

  updateWeightsList(contentData) {
    var weightsValuesNameList = [];
    this.selectedOptionWeight = null;
    this.weightsResponseData = contentData;
    contentData.forEach(weight => {
      weightsValuesNameList.push(weight.name);
    });
    this.weightDropdown = weightsValuesNameList;
  }

  updatePretrainingList(contentData) {
    var pretrainigValuesNameList = [];
    this.selectedOptionDataset = null;
    this.datasetResponseData = contentData;
    contentData.forEach(pretraining => {
      if (pretraining.pretrained_on != null || pretraining.pretrained_on != undefined) {
        if (pretraining.pretrained_on != null || pretraining.pretrained_on != undefined) {
          pretrainigValuesNameList.push(pretraining.name);
        }
      }
    });
    this.datasetDropdown = pretrainigValuesNameList;
  }

  updateModelsResponseData(contentData) {
    this.modelsResponseData = [];
    contentData.forEach(model => {
      this.modelsResponseData.push(model);
    });
  }

  stopProcess(process) {
    this._interactionService.showDeleteInput = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('project.stopTraining'),
      dialogContent: this.translate.instant('project.areYouSureStop'),
      dialogDeletedItemInputValue: this.inputProcessId,
      dialogDeletedItem: process.processId,
      deletedItemInputPlaceHolder: this.translate.instant('project.processIdStopped'),
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        this.inputProcessId = result.dialogDeletedItemInputValue;
        if (this.inputProcessId == process.processId) {
          this._dataService.stopProcess(process.processId).subscribe(data => {
            if (data.statusText == "OK") {
              this.openSnackBar(this.translate.instant('project.stoppedProcessMessage'));
              this.trainProcessStarted = false;
              this.inferenceProcessStarted = false;
              process.showStopButton = false;
              process.showDisabledButton = true;
              process.process_status = ProcessStatus[2];
            }
            else {
              this.trainProcessStarted = true;
              this.inferenceProcessStarted = true;
            }
          });
        } else {
          this.openSnackBar(this.translate.instant('project.errorMessageStopProcess'));
        }
      }
      else {
        console.log('Canceled');
      }
    });
  }

  showOutputProcess(process) {
    this.openOutputResultCustom(process.processId);
    this.displayOutputResultsOuputsTable(process);
  }

  showOutputProcessFromWeights(process) {
    this.displayOutputResultsOuputsTable(process);
  }

  markNotificationAsRead(process) {
    if (process.unread == true) {
      process.unread = false;
      this._interactionService.decreaseNotificationsNumber();
    }
  }

  openSnackBar(message) {
    this.snackBar.open(message, "close", {
      duration: 5000,
    });
  }

  //dropdown functions
  getAllowedProperties(modelName: string) {
    let modelId;
    let modelList = this._interactionService.getModelsByTaskArray();
    modelList.forEach(model => {
      if (model.name == modelName) {
        modelId = model.id;
      }
    });
    let propertyList = this._interactionService.getPropertiesById();
    for (let entry of propertyList) {
      this._dataService.allowedProperties(modelId, entry.id).subscribe(data => {
        if (data != undefined || data != null) {
          this.updatePropertiesList(entry.id, data);
        }
        else {
          this._dataService.propertiesById(entry.id);
        }
      })
    }
  }

  updatePropertiesList(propertyId: number, contentData) {
    var propertyValuesNameList = Array<string>();
    this.selectedOptionProperty = null;
    contentData.forEach(property => {
      if (property.allowed_value != null) {
        propertyValuesNameList = property.allowed_value.split(",");
      }
    });

    switch (propertyId) {
      case 1:
        this.learningRateValue = propertyValuesNameList;
        break;
      case 2:
        this.lossDropdown = [];
        this.lossDropdown = propertyValuesNameList;
        break;
      case 3:
        this.epochsValue = propertyValuesNameList;
        break;
      case 4:
        this.batchSizeValue = propertyValuesNameList;
        break;
      case 5:
        this.metricDropdown = [];
        this.metricDropdown = propertyValuesNameList;
        break;
      case 6:
        this.inputHeightValue = propertyValuesNameList;
        break;
      case 7:
        this.inputWidthValue = propertyValuesNameList;
        break;
    }
  }

  populateSelector(selector, contentData) {
    var selectorValuesNameList = [];
    contentData.forEach(item => {
      selectorValuesNameList.push(item.name);
    });

    switch (selector) {
      case "model":
        this.modelDropdown = selectorValuesNameList;
        break;
      case "dataset":
        this.datasetDropdown = selectorValuesNameList;
        break;
      case "metric":
        this.metricDropdown = selectorValuesNameList;
        break;
      case "loss":
        this.lossDropdown = selectorValuesNameList;
        break;
      case "optimizer":
        this.optimizerDropdown = selectorValuesNameList;
        break;
      case "learning_rate":
        this.learningRateDropdown = selectorValuesNameList;
        break;
      case "epochs":
        this.epochsDropdown = selectorValuesNameList;
        break;
      case "batchSize":
        this.batchSizeDropdown = selectorValuesNameList;
        break;
      case "inputWidth":
        this.inputWidthDropdown = selectorValuesNameList;
        break;
      case "inputHeight":
        this.inputHeightDropdown = selectorValuesNameList;
        break;
    }
  }

  updateProjectsTaskId(taskId) {
    this._interactionService.usersAssociatedArray.push({ "username": this._interactionService.projectOwner, "permission": PermissionStatus[0] });
    this._dataService.updateProject(this._interactionService.currentProject.name, this._interactionService.currentProject.id,
      taskId, this._interactionService.usersAssociatedArray).subscribe(data => {
        this._interactionService.resetProjectsList(data.body);
        this._interactionService.usersAssociatedArray = this._interactionService.usersAssociatedArray.filter(item => item.username !== this._interactionService.projectOwner);
        console.log(data.body);
      }, error => {
        this.openSnackBar("Error: " + error.error.Error);
      })
  }

  triggerSelectedModel(event) {
    this.weightDropdown = [];
    var selectedModel = event.value;
    this.getWeights(selectedModel);
    this.getAllowedProperties(selectedModel);
  }

  triggerSelectedModelEditWeight(event) {
    this.modelIdEditWeight = null;
    var selectedModel = event.value;
    let modelList = this._interactionService.getModelsByTaskArray();
    modelList.forEach(model => {
      if (model.name == selectedModel) {
        this.modelIdEditWeight = model.id;
      }
    });
    this._dataService.getWeightsArray(this.modelIdEditWeight).subscribe(data => {
      this.displayWeightsListByModel(data);
    })
  }

  displayWeightList(modelName: string) {
    let modelId;
    let modelList = this._interactionService.getModelsByTaskArray();
    modelList.forEach(model => {
      if (model.name == modelName) {
        modelId = model.id;
      }
    });
    this._dataService.getWeightsArray(modelId).subscribe(data => {
      this.weightsList = new MatTableDataSource(data);
    })
  }

  displayWeightsListByModel(weightdataList) {
    this.weightsEditData = [];
    weightdataList.forEach(weightdata => {
      this.weightDisplayMode = weightdata.public;
      this.weightOwners = weightdata.owners;
      this.weightsEditData.push({ weightId: weightdata.id, weightName: weightdata.name, weightCeleryId: weightdata.celery_id, weightDatasetId: weightdata.dataset_id, weightPublic: this.weightDisplayMode });
    });
    this.weightsList = new MatTableDataSource(this.weightsEditData);
    this.weightsList.sort = this.sort;
    this.weightsList.paginator = this.paginator;
  }

  cleanWeightsEditList() {
    this.selectedValueEditWeight = undefined;
    this.weightsEditData = [];
    this.weightsList = new MatTableDataSource(this.weightsEditData);

    let dummyArray = [];
    this.weightDetails = new MatTableDataSource(dummyArray);
    this.showWeightDetailsTable = false;
  }

  onEditWeight(weight) {
    console.log(weight);
    this.users = [];
    this._interactionService.formDataWeight = weight;
    this._authService.getUsers().subscribe(usersData => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        inputValue: weight.weightName,
        dialogTitle: this.translate.instant('project.updateWeightProcess'),
        inputPlaceHolder: this.translate.instant('project.updateWeightName'),
        weightDisplayMode: weight.weightPublic,
        selectedUsername: null,
        userDropdown: usersData
      }

      let dialogRef = this.dialog.open(UpdateWeightDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        if (result) {
          for (let currentUser of this.usersArray) {
            if (currentUser.username == this._interactionService.username) {
              this.users.push({
                "username": currentUser.username
              });
            }
          }
          if (result.selectedUsername != null && result.selectedUsername.length == 1) {
            this.users.push({
              "username": result.selectedUsername
            });
          }
          else if (result.selectedUsername != null && result.selectedUsername.length > 1) {
            result.selectedUsername.forEach(selectedUsername => {
              this.users.push({
                "username": selectedUsername
              });
            });
          }
          this._dataService.updateWeight(weight.weightId, weight.weightDatasetId, weight.weightName, this.modelIdEditWeight, weight.pretrained_on, weight.weightPublic, this.users).subscribe(data => {
            if (data.statusText == "OK") {
              this.openSnackBar(this.translate.instant('project.updateWeightResult'));
              this._interactionService.resetEditWeightsList(data.body);
              console.log(data.body);
              console.log("weight " + weight.weightName + " updated");
            }
          }, error => {
            this.openSnackBar("Error: " + error.statusText);
          });
        }
      });
    })
  }

  showWeightDetails(weight) {
    this._dataService.getWeightById(weight.weightId).subscribe(data => {
      this.updateWeightDetails(data);
    }, error => {
      this.openSnackBar("Error: " + error.details);
    });
  }

  updateWeightDetails(contentData) {
    this.showWeightDetailsTable = true;
    let dummyArray = [];
    let dataset_name;
    let model_name;
    let datasetList = this._interactionService.getDatasetResponseData();
    let modelList = this._interactionService.getModelsByTaskArray();
    modelList.forEach(element => {
      if (element.id == contentData.model_id) {
        model_name = element.name;
      }
    });
    datasetList.forEach(element => {
      if (element.id == contentData.dataset_id) {
        dataset_name = element.name;
      }
    });
    dummyArray.push(
      {
        Weight_Id: contentData.id,
        Name: contentData.name,
        dataset_name: dataset_name,
        model_name: model_name,
        pretrained_on: contentData.pretrained_on,
        celery_id: contentData.celery_id,
      });
    this.weightIdForTitle = contentData.id;
    this.weightDetails = new MatTableDataSource(dummyArray);
  }

  deleteWeight(weight) {
    this._interactionService.showDeleteInput = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('project.deleteWeightTitle'),
      dialogDeletedItemInputValue: this.inputWeightName,
      dialogDeletedItem: weight.weightName,
      deletedItemInputPlaceHolder: this.translate.instant('project.weightName'),
      dialogContent: this.translate.instant('project.areYouSureDeleteWeight')
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        this.inputWeightName = result.dialogDeletedItemInputValue;
        if (this.inputWeightName == weight.weightName) {
          this._dataService.deleteWeight(weight.weightId).subscribe(data => {
            this.openSnackBar(this.translate.instant('project.succesMessageDeleteWeight'));
            this.showWeightDetailsTable = false;
            let modelList = this._interactionService.getModelsByTaskArray();
            modelList.forEach(model => {
              if (model.name == weight.modelName) {
                this.modelIdEditWeight = model.id;
              }
            });
            this._dataService.getWeightsArray(this.modelIdEditWeight).subscribe(data => {
              this.displayWeightsListByModel(data);
            })
          }, error => {
            this.openSnackBar("Error: " + error.statusText);
          });
        } else {
          this.openSnackBar(this.translate.instant('project.errorMessageDeleteWeight'));
        }
      } else {
        console.log('Canceled');
      }
    });
  }

  applyFilter(filterValue: string) {
    this.weightsList.filter = filterValue.trim().toLowerCase();
  }

  triggerSelectedProject(event) {
    var selectedModel = event.value;
    this.getWeights(selectedModel);
  }

  onShowOutputDetails(outputResultsRow) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      processId: this.outputResultsDetailProcessId,
      dialogTitle: this.translate.instant('output-details-dialog.dialogTitle'),
      dialogContent: outputResultsRow
    }
    let dialogRef = this.dialog.open(ShowOutputDetailsDialogComponent, dialogConfig);
  }

  onShowOutputsByWeight(outputResultsRow) {
    this.showOutputProcessFromWeights(outputResultsRow);
  }

  showOutputRunningTable(process) {
    this.fullStatusProcess = true;
    this._dataService.statusCompleteForEvolution(process.processId, this.fullStatusProcess).subscribe(data => {
      this.updateOutputRunningTable(data);
      this.showGraphicData(data);
      this.outputResultsDetailProcessId = process.processId;
      this.openSnackBar(this.translate.instant('output-details-dialog.outputStatusOk'));
      this._interactionService.changeStopButton(process);
    }), error => {
      this.showOutputRunning = false;
      this.showOutputInferenceSingle = false;
      this.openSnackBar(this.translate.instant('project.outputStatusError'));
    };
  }

  updateOutputRunningTable(contentData) {
    console.log(contentData);
    this.showOutputRunning = true;
    this.showOutputInferenceSingle = false;
    let outputsResultsTable = contentData.status;
    let outputsArray = [];
    let outputModel, outputDataset, outputWeight, outputEpoch, outputLoss, outputMetric, outputBatch, outputInputH, outputInputW, outputTrainingAug, outputValidationAug;
    let varModel = ' "model_id":', varDataset = ' "dataset_id":', varWeight = ' "weight_id":', varEpoch = ' "epochs":';
    let varLoss = ' "loss": "', varMetric = ' "metric": "', varBatch = ' "batch_size":', varInputH = ' "input_h":', varInputW = ' "input_w":';
    let varTrainingAug = ' "train_augs":', varValidationAug = ' "val_augs":';

    outputsResultsTable.forEach(output => {
      if (output.indexOf(varModel) > 0) {
        outputModel = output.substr(output.indexOf(varModel) + varModel.length, ' 1,'.length - 1);
      }
      if (output.indexOf(varDataset) > 0) {
        outputDataset = output.substr(output.indexOf(varDataset) + varDataset.length, ' 1,'.length - 1);
      }
      if (output.indexOf(varWeight) > 0) {
        outputWeight = output.substr(output.indexOf(varWeight) + varWeight.length, ' 475,'.length - 1);
      }
      if (output.indexOf(varEpoch) > 0) {
        outputEpoch = output.substr(output.indexOf(varEpoch) + varEpoch.length, ' 3,'.length - 1);
      }
      if (output.indexOf(varLoss) > 0) {
        outputLoss = output.substr(output.indexOf(varLoss) + varLoss.length, ' CrossEntropy",'.length - 3);
      }
      if (output.indexOf(varMetric) > 0) {
        outputMetric = output.substr(output.indexOf(varMetric) + varMetric.length, ' CategoricalAccuracy",'.length - 3);
      }
      if (output.indexOf(varBatch) > 0) {
        outputBatch = output.substr(output.indexOf(varBatch) + varBatch.length, ' 64,'.length - 1);
      }
      if (output.indexOf(varInputH) > 0) {
        outputInputH = output.substr(output.indexOf(varInputH) + varInputH.length, ' 100,'.length - 1);
      }
      if (output.indexOf(varInputW) > 0) {
        outputInputW = output.substr(output.indexOf(varInputW) + varInputW.length, ' 100,'.length - 1);
      }
      if (output.indexOf(varTrainingAug) > 0) {
        outputTrainingAug = output.substr(output.indexOf(varTrainingAug) + varTrainingAug.length, ' null,'.length - 1);
      }
      if (output.indexOf(varValidationAug) > 0) {
        outputValidationAug = output.substr(output.indexOf(varValidationAug) + varValidationAug.length, ' null,'.length - 1);
      }
    })
    outputsArray.push({
      Model_Id: outputModel,
      Dataset_Id: outputDataset,
      Weight_Id: outputWeight,
      Epoch: outputEpoch,
      Loss_Function: outputLoss,
      Metric: outputMetric,
      Batch_Size: outputBatch,
      Input_Height: outputInputH,
      Input_Width: outputInputW,
      Training_Augmentations: outputTrainingAug,
      Validation_Augmentations: outputValidationAug
    });
    this.outputResultsRunning = new MatTableDataSource(outputsArray);
  }

  showGraphicData(contentData) {
    var outputsResults = contentData.status;
    let outputCross;
    let outputAccuracy;
    let outputBatch;
    let varCrossEntropy = "cross_entropy=";
    let varCategoricalAccuracy = ",categorical_accuracy=";
    let varBatch = "Infer Batch";
    let outputMax;
    let chartObject;
    let chartValuesList = [
      {
        "name": "Evolution of the process",
        "series": []
      }
    ];

    outputsResults.forEach(output => {
      if (output.indexOf("Train Epoch:") == 0 && output.indexOf(varCrossEntropy) > 0 && output.indexOf(varCategoricalAccuracy) > 0) {
        outputCross = output.substr(output.indexOf(varCrossEntropy) + varCrossEntropy.length, 5);
        outputAccuracy = output.substr(output.indexOf(varCategoricalAccuracy) + varCategoricalAccuracy.length, 5);

        chartObject = { name: outputCross, value: parseFloat(outputAccuracy) };
        chartValuesList[0].series.push(chartObject);

        console.log(chartValuesList);
        Object.assign(this, { chartValuesList });
      }
      else if (output.indexOf(varBatch) == 0) {
        if (output.substr(output.indexOf("/")).length <= 5) {
          outputBatch = output.substr(output.indexOf(varBatch) + varBatch.length, output.length - varBatch.length - 5);
          outputMax = output.substr(output.indexOf((varBatch)) + varBatch.length + outputBatch.length + 1);
          this.outputInference = (parseFloat(outputBatch)) * 100 / parseFloat(outputMax);
        }
        else if (output.substr(output.indexOf("/")).length > 5) {
          outputBatch = output.substr(output.indexOf(varBatch) + varBatch.length, output.length - varBatch.length - 6);
          outputMax = output.substr(output.indexOf((varBatch)) + varBatch.length + outputBatch.length + 1);
          this.outputInference = (parseFloat(outputBatch)) * 100 / parseFloat(outputMax);
        }
      }
    });
  }

  getUsers() {
    this._authService.getUsers().subscribe(data => {
      this.updateUsersArray(data);
    })
  }

  updateUsersArray(contentData) {
    this.usersArray = [];
    for (let entry of contentData) {
      this.usersArray.push(entry);
    }
  }

  updateUsersList(contentData) {
    this._interactionService.usersList = [];
    for (let entry of contentData) {
      this._interactionService.usersList.push(entry);
    }
  }

  updateAssociatedUsersList(contentData) {
    this.usersAssociatedArray = [];
    for (let entry of contentData) {
      this.usersAssociatedArray.push(entry);
    }
  }

  cleanProjectEditName() {
    if (this.projectNameValue != null) {
      this.projectNameValue = null;
      this.projectNameValue = this._interactionService.projectName;
    }
  }

  cleanProjectUsersEditLists() {
    this.usersSelection.selectedOptions.clear();
  }

  changeValueProjectName(event) {
    this.projectNameValue = event.target.value;
    if (this._interactionService.username != this._interactionService.projectOwner) {
      this.disabledSaveUpdateButton = true;
      this.disabledCancelUpdateButton = true;
    } else {
      this.disabledSaveUpdateButton = false;
      this.disabledCancelUpdateButton = false;
    }
  }

  updateProject(projectName) {
    if (this.selectedUsersData != null) {
      this.selectedUsersData.forEach(selectedUser => {
        this._interactionService.usersList = this._interactionService.usersList.filter(item => item.username != selectedUser);
        this._interactionService.usersAssociatedArray.push({ "username": selectedUser, "permission": PermissionStatus[1] });
      })
      this.updateUsersList(this._interactionService.usersList);
      this.updateAssociatedUsersList(this._interactionService.usersAssociatedArray);
    }
    this._interactionService.usersAssociatedArray.push({ "username": this._interactionService.projectOwner, "permission": PermissionStatus[0] });
    this._dataService.updateProject(projectName, this._interactionService.currentProject.id, this._interactionService.currentProject.task_id,
      this._interactionService.usersAssociatedArray).subscribe(data => {
        if (data.statusText == "OK") {
          this._interactionService.changeProjectTabName(projectName);
          this._interactionService.resetProjectsList(data.body);
          this._interactionService.usersAssociatedArray = data.body.users;
          this._interactionService.usersAssociatedArray = this._interactionService.usersAssociatedArray.filter(item => item.username != this._interactionService.projectOwner)
          this.updateAssociatedUsersList(this._interactionService.usersAssociatedArray);
          this.openSnackBar(this.translate.instant('project.succesMessageUpdateProject'));
        }
      }), error => {
        this.openSnackBar("Error:" + error.statusText);
      }
  }

  deleteUser(projectName) {
    this._interactionService.showDeleteInput = true;
    let nrOfSelectedUsers;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('project.deleteUsersTitle'),
      dialogDeletedItemInputValue: this.inputUsersName,
      dialogDeletedItem: this.selectedAssociatedUsers,
      deletedItemInputPlaceHolder: this.translate.instant('project.inputPlaceHolderUsersName'),
      dialogContent: this.translate.instant('project.areYouSureDeleteUsers')
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result && this.selectedAssociatedUsers != null) {
        this._interactionService.usersAssociatedArray.push({ "username": this._interactionService.projectOwner, "permission": PermissionStatus[0] });
        this.selectedAssociatedUsers.forEach(selectedAssociatedUser => {
          this.inputUsersName = result.dialogDeletedItemInputValue;
          if (this.inputUsersName == this.selectedAssociatedUsers) {
            this._interactionService.usersAssociatedArray = this._interactionService.usersAssociatedArray.filter(item => item.username != selectedAssociatedUser)
            if (this.selectedAssociatedUsers.length == 1) {
              nrOfSelectedUsers = 0;
            } else {
              nrOfSelectedUsers = 1;
            }
            this._dataService.updateProject(projectName, this._interactionService.currentProject.id, this._interactionService.currentProject.task_id,
              this._interactionService.usersAssociatedArray).subscribe(data => {
                if (nrOfSelectedUsers == 0) {
                  this.openSnackBar(this.translate.instant('project.succesMessageDeleteAssociatedUser'));
                } else {
                  this.openSnackBar(this.translate.instant('project.succesMessageDeleteAssociatedUsers'));
                }
                this._interactionService.usersAssociatedArray = this._interactionService.usersAssociatedArray.filter(item => item.username != this._interactionService.projectOwner);
                this._interactionService.usersList.push({ "username": selectedAssociatedUser, "permission": PermissionStatus[1] });
                this.updateAssociatedUsersList(this._interactionService.usersAssociatedArray);
                this.updateUsersList(this._interactionService.usersList);
                this._interactionService.resetProjectsList(data.body);
              }, error => {
                this._interactionService.usersAssociatedArray.push({ "username": selectedAssociatedUser, "permission": PermissionStatus[1] });
                this.openSnackBar("Error: " + error.statusText);
              });
          } else {
            this._interactionService.usersAssociatedArray = this._interactionService.usersAssociatedArray.filter(item => item.username != this._interactionService.projectOwner);
            this.openSnackBar(this.translate.instant('project.errorMessageDeleteAssociatedUsers'));
          }
        })
      } else {
        console.log('Canceled');
      }
    });
  }

  cancelUpdateProject() {
    this.usersSelection.selectedOptions.clear();
    this.projectNameValue = null;
    this.projectNameValue = this._interactionService.projectName;
    this.disabledCancelUpdateButton = true;
    this.disabledSaveUpdateButton = true;
  }

  deleteProject(projectId) {
    this._interactionService.showDeleteInput = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('project.deleteProjectTitle'),
      dialogDeletedItemInputValue: this.inputProjectName,
      dialogDeletedItem: this.projectNameValue,
      deletedItemInputPlaceHolder: this.translate.instant('powerUser.projectName'),
      dialogContent: this.translate.instant('project.areYouSureDeleteProject')
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        this.inputProjectName = result.dialogDeletedItemInputValue;
        if (this.inputProjectName == this.projectNameValue) {
          this._dataService.deleteProject(projectId).subscribe(data => {
            this.openSnackBar(this.translate.instant('project.succesMessageDeleteProject'));
            this.router.navigate(['/power-user']);
            this._interactionService.closeProjectTab();
          }, error => {
            this.openSnackBar("Error: " + error.error.Error);
          });
        } else {
          this.openSnackBar(this.translate.instant('project.errorMessageDeleteProject'));
        }
      } else {
        console.log('Canceled');
      }
    });
  }
}
