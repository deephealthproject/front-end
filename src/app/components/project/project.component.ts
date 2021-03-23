import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InteractionService } from '../../services/interaction.service';
import { DataService } from '../../services/data.service';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatSort, MatPaginator, MatSelectionList } from '@angular/material';
import { ConfirmDialogTrainComponent } from '../confirm-dialog-train/confirm-dialog-train.component';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PropertyInstance, Project, Model, Dataset, Weight, User, PermissionStatus, ProcessingObject, ProcessStatus, ItemToDelete } from '../power-user/power-user.component';
import { UploadDatasetsDialogComponent } from '../upload-datasets-dialog/upload-datasets-dialog.component';
import { UpdateWeightDialogComponent } from '../update-weight-dialog/update-weight-dialog.component';
import { ShowOutputDetailsDialogComponent } from '../show-output-details-dialog/show-output-details-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ProgressSpinnerDialogComponent } from '../progress-spinner-dialog/progress-spinner-dialog.component';
import { FormControl, Validators } from '../../../../node_modules/@angular/forms';

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

  searchIcon = "search";
  markUnreadIcon = "markUnread";
  stopProcessIcon = "stopProcess";

  //training/inference processes
  trainProcessStarted = false;
  inferenceProcessStarted = false;
  disabledTrainButton = false;
  disabledInferenceButton = false;
  disabledInferenceSingleButton = false;
  showInference = false;
  showTrainButton = true;
  disabledStopButton = false;
  process_type: string;
  trainMessage: string = null;
  inferenceMessage: string = null;
  modelsResponseData: Array<Model>;
  currentProject: Project;
  fullStatusProcess = false;

  selectedInputType = null;

  //upload Dataset
  datasetName: string;
  datasets: Array<Dataset> = [];
  datasetPath: string;
  datasetLocalPath: string;
  isUrlLink = false;
  datasetPublic: Boolean = true;

  //upload Model
  modelName: string;
  modelPath: string;
  datasetId;
  modelData;
  uploadStatusVar;

  //updateWeights
  weights: Array<Weight> = [];
  weightName: string;
  weightsList: MatTableDataSource<any>;
  weightDetails: MatTableDataSource<any>;
  displayedWeightDetailsColumns: string[] = ['Weight_Id', 'Name', 'dataset_name', 'model_name', 'pretrained_on', "public_weight", "associated_users"];
  displayedColumns: string[] = ['weightId', 'weightName', 'weightDatasetId', 'weightOwner', 'weightOptions'];
  weightsEditData = [];
  selectedOptionModelEditList = null;
  modelIdEditWeight = null;
  selectedValueEditWeight = undefined;
  weightIdForTitle: any;
  showWeightDetailsTable: boolean = false;
  weightDisplayMode;
  weightOwner;

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
  inputUsersName: string;

  searchText = '';

  //inference single
  datasetImagePath: string;
  datasetImageData: string;

  requiredModelControl = new FormControl('', [Validators.required]);
  requiredDatasetControl = new FormControl('', [Validators.required]);
  requiredWeightControl = new FormControl('', [Validators.required]);

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
    this.matIconRegistry.addSvgIcon(
      'modelweight',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/subdirectory_arrow_right-24px.svg')
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

    this._interactionService.learningRateValueSource$.subscribe(
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
        this._interactionService.selectedTaskId = id;
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

  changeUseDropoutCheckedState() {
    this.useDropoutCheckedState = !this.useDropoutCheckedState;
  }

  changeLearningRateValue(event) {
    this.learningRateValue = event.target.value;
  }

  changeEpochsValue(event) {
    this.epochsValue = event.target.value;
  }

  changeBatchSizeValue(event) {
    this.batchSizeValue = event.target.value;
  }

  uploadDataset() {
    this._interactionService.uploadModelIsClicked = false;
    let taskId;
    this.tasks.forEach(task => {
      if (task.id == this._interactionService.currentProject.task_id) {
        taskId = task.id;
      }
    })
    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

    this._authService.getUsers().subscribe(usersData => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        inputValue: this.datasetName,
        dialogTitle: this.translate.instant('upload-dataset-dialog.uploadDatasetProcess'),
        dialogContent: this.translate.instant('upload-dataset-dialog.uploadDatasetContent'),
        inputPlaceHolder: this.translate.instant('upload-dataset-dialog.uploadDatasetName'),
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
              this.datasetPath = result.inputValuePath;
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
              let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
              this._dataService.uploadDataset(this.datasetName, taskId, this.datasetPath, this.users, this.datasetPublic).subscribe(data => {
                if (data.statusText == "Created") {
                  dialogRefSpinner.close();
                  this._interactionService.openSnackBarOkRequest(this.translate.instant('upload-dataset-dialog.uploadDatasetResult'));
                  console.log("dataset " + this.datasetName + " uploaded");
                }
              }, error => {
                dialogRefSpinner.close();
                this._interactionService.openSnackBarBadRequest("Error: " + error.error.error);
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
    var formData = new FormData();

    let taskId;
    this.tasks.forEach(task => {
      if (task.id == this._interactionService.selectedTaskId) {
        taskId = this._interactionService.selectedTaskId;
      }
    })

    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

    this._dataService.getDatasets(taskId).subscribe(datasetData => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        inputValue: this.modelName,
        dialogTitle: this.translate.instant('upload-dataset-dialog.uploadModelProcess'),
        dialogContent: this.translate.instant('upload-dataset-dialog.uploadModelContent'),
        inputPlaceHolder: this.translate.instant('upload-dataset-dialog.uploadModelName'),
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
              this.modelPath = result.inputValuePath;
              result.datasetDropdownForUploadModel.forEach(element => {
                if (element.name == result.selectedDatasetName) {
                  this.datasetId = element.id;
                }
              });
              formData.append("name", result.inputValue);
              formData.append("task_id", taskId);
              formData.append("dataset_id", this.datasetId);
              formData.append("onnx_url", this.modelPath);
              formData.append("onnx_data", this.modelData.onnx_data);
              let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
              this._dataService.uploadModel(formData).subscribe(data => {
                if (data.statusText == "Created") {
                  dialogRefSpinner.close();
                  this._interactionService.openSnackBarOkRequest(this.translate.instant('upload-dataset-dialog.uploadModelResult'));
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
                dialogRefSpinner.close();
                this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
              });
            } else {
              this._interactionService.openSnackBarBadRequest(this.translate.instant('upload-dataset-dialog.uploadModelExists'));
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
        this._interactionService.openSnackBarOkRequest(this.translate.instant('project.finishedUploadModelProcessMessage'));
        console.log("Model " + this.modelName + " uploaded");
        this._interactionService.increaseNotificationsNumber();
      }
      else if (process.process_status == "failure" || process.process_status == "retry") {
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorUploadModelProcessMessage'));
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

    this._interactionService.runningProcesses.forEach(runningProcess => {
      if (runningProcess.process_status == "finished") {
        console.log(runningProcess.process_status);
        this.checkStatusPastProcesses(runningProcess);
      }
    })
  }

  checkStatusPastProcesses(process) {
    this._dataService.status(process.processId).subscribe(data => {
      let status: any = data.status;
      process.projectId = process.projectId;
      process.processId = process.processId;
      process.process_data = status.process_data;
      process.process_type = status.process_type;
      process.process_status = status.process_status;
      this._interactionService.changeStopButton(process);
      if (process.process_status == "finished") {
        console.log(process.process_status);
        setTimeout(() => {
          this.checkStatusPastProcesses(process)
        }, 10 * 1000);
      }
      if (process.process_status == "running") {
        let status: any = data.status;
        let runningProcess = new ProcessingObject;
        runningProcess.projectId = process.projectId;
        runningProcess.processId = process.processId;
        runningProcess.process_data = status.process_data;
        runningProcess.process_type = status.process_type;
        runningProcess.process_status = status.process_status;
        runningProcess.unread = false;
        this._interactionService.changeStopButton(process);
        if (process.processId !== runningProcess.processId) {
          this._interactionService.runningProcesses.push(runningProcess);
        }
        if (process.process_type == "training") {
          setTimeout(() => {
            this.checkStatusTrain(process);
          }, 10 * 1000);
        } else {
          setTimeout(() => {
            this.checkStatusInference(process);
          }, 10 * 1000);
        }
      }
    });
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

  //train & inference functions
  trainModel() {
    this.process_type = "training";
    this.trainProcessStarted = true;

    let selectedProperties: PropertyInstance[] = [];
    let metric = new PropertyInstance;
    metric.name = "Metric";
    metric.value = this.selectedOptionMetric;
    selectedProperties.push(metric);
    let loss = new PropertyInstance;
    loss.name = "Loss function";
    loss.value = this.selectedOptionLoss;
    selectedProperties.push(loss);
    let learning = new PropertyInstance;
    learning.name = "Learning rate";
    learning.value = this.learningRateValue;
    if (learning.value >= 0.00000 && learning.value <= 0.99999) {
      selectedProperties.push(learning);
    }
    else {
      this.trainProcessStarted = false;
    }
    let epochs = new PropertyInstance;
    epochs.name = "Epochs";
    epochs.value = this.epochsValue;
    selectedProperties.push(epochs);
    let batchSize = new PropertyInstance;
    batchSize.name = "Batch size";
    batchSize.value = this.batchSizeValue;
    selectedProperties.push(batchSize);
    // let inputHeight = new PropertyInstance;
    // inputHeight.name = "Input height";
    // inputHeight.value = this.inputHeightValue;
    // let inputWidth = new PropertyInstance;
    // inputWidth.name = "Input width";
    // inputWidth.value = this.inputWidthValue;
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

    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

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
          let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
          this._dataService.trainModel(selectedDatasetId, selectedModelId, selectedWeightId, selectedProperties, this._interactionService.currentProject.id).subscribe(data => {
            if (data.body.result == "ok") {
              dialogRefSpinner.close();
            }
            this._interactionService.openSnackBarOkRequest(this.translate.instant('project.startedTrainProcessMessage'));
            this.trainProcessStarted = true;
            this.showTrainButton = false;
            let process = new ProcessingObject;
            process.projectId = this._interactionService.currentProject.id;
            process.processId = data.body.process_id;
            process.process_status = ProcessStatus[1];
            process.process_type = this.process_type;
            process.training_id = data.body.training_id;
            process.unread = true;
            this.disabledTrainButton = false;
            this._interactionService.runningProcesses.push(process);
            this._interactionService.changeStopButton(process);
            this.trainMessage = "The process of the type " + process.process_type + ", with the id " + process.processId + ", has the status: " + process.process_status + ".";
            //this.checkStatusTrainButton();
            setTimeout(() => {
              this.checkStatusTrain(process)
            }, 2000);
          }, error => {
            dialogRefSpinner.close();
            this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
          });
        }
      });
    }
    else {
      this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorStartedTrainProcessMessage'));
      this.trainProcessStarted = false;
      this.showTrainButton = true;
      console.log('Canceled');
    }
  }

  checkStatusTrainButton() {
    let nrOfRunningProcesses = 0;
    for (let process of this._interactionService.runningProcesses) {
      if (process.process_status == "running") {
        nrOfRunningProcesses++;
      }
    }
    if (nrOfRunningProcesses >= 1) {
      this.disabledTrainButton = true;
    } else {
      this.disabledTrainButton = false;
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
    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('project.inference'),
      dialogContent: this.translate.instant('project.areYouSureInference'),
      trainingTime: this.translate.instant('project.estimatedTimePreTrain'),
      modelSelected: this.selectedOptionModel,
      weightSelected: this.selectedOptionWeight,
      datasetSelected: this.selectedOptionDataset,
      process_type: this.process_type
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result && this.selectedOptionModel != null && this.selectedOptionDataset != null) {
        let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
        this._dataService.inferenceModel(selectedWeightId, selectedDatasetId, this._interactionService.currentProject.id).subscribe(data => {
          if (data.body.result == "ok") {
            this.disabledInferenceButton = true;
            dialogRefSpinner.close();
          }
          this._interactionService.openSnackBarOkRequest(this.translate.instant('project.startedInferenceProcessMessage'));
          let process = new ProcessingObject;
          this.inferenceProcessStarted = true;
          process.projectId = this._interactionService.currentProject.id;
          process.processId = data.body.process_id;
          process.process_status = ProcessStatus[1];
          process.process_type = this.process_type;
          process.unread = true;
          this.disabledInferenceButton = false;
          this._interactionService.runningProcesses.push(process);
          this._interactionService.changeStopButton(process);
          this.inferenceMessage = "The process of the type " + process.process_type + ", with the id " + process.processId + ", has the status: " + process.process_status;
          setTimeout(() => {
            this.checkStatusInference(process)
          }, 2000);
          this.getOutputResultsOfInference(process);
        }, error => {
          dialogRefSpinner.close();
          this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
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
    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      inputValue: this.datasetImagePath,
      dialogTitle: this.translate.instant('project.inferenceSingle'),
      dialogContent: this.translate.instant('project.areYouSureInference'),
      trainingTime: this.translate.instant('project.estimatedTimePreTrain'),
      modelSelected: this.selectedOptionModel,
      weightSelected: this.selectedOptionWeight,
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
        let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
        this._dataService.inferenceSingle(selectedWeightId, this.datasetImagePath, this.datasetImageData, this._interactionService.currentProject.id).subscribe(data => {
          if (data.body.result == "ok") {
            this.disabledInferenceSingleButton = true;
            dialogRefSpinner.close();
          }
          this._interactionService.openSnackBarOkRequest(this.translate.instant('project.startedInferenceProcessMessage'));
          let process = new ProcessingObject;
          this.inferenceProcessStarted = true;
          process.projectId = this._interactionService.currentProject.id;
          process.processId = data.body.process_id;
          process.process_status = ProcessStatus[1];
          process.process_type = this.process_type;
          process.unread = true;
          this.disabledInferenceSingleButton = false;
          this._interactionService.runningProcesses.push(process);
          this._interactionService.changeStopButton(process);
          this.inferenceMessage = "The process of the type " + process.process_type + ", with the id " + process.processId + ", has the status: " + process.process_status;
          setTimeout(() => {
            this.checkStatusInference(process)
          }, 2000);
          this.getOutputResultsOfInference(process);
        }, error => {
          dialogRefSpinner.close();
          this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
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
        setTimeout(() => {
          this.checkStatusTrain(process)
        }, 10 * 1000);
      }
      if (process.process_status == "finished") {
        this._interactionService.openSnackBarOkRequest(this.translate.instant('project.finishedTrainProcessMessage'));
        this.trainProcessStarted = false;
        process.unread = true;
        this._interactionService.increaseNotificationsNumber();
      }
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
        setTimeout(() => {
          this.checkStatusInference(process)
        }, 10 * 1000);
      }
      if (process.process_status == "finished") {
        this._interactionService.openSnackBarOkRequest(this.translate.instant('project.finishedInferenceProcessMessage'));
        this.inferenceProcessStarted = false;
        process.unread = true;
        this._interactionService.increaseNotificationsNumber();
      }
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
      this._interactionService.selectedTaskId = checkedButton.id;
      this._interactionService.initialiseModelDropdown(this._interactionService.selectedTaskId);
      this._interactionService.initialiseDatasetDropdown(this._interactionService.selectedTaskId)
      this.weightDropdown = [];

      console.log("task id: " + this._interactionService.selectedTaskId);
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('project.stopTraining'),
      dialogContent: this.translate.instant('project.areYouSureStop'),
    }

    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
        this._dataService.stopProcess(process.processId).subscribe(data => {
          if (data.statusText == "OK") {
            dialogRefSpinner.close();
            this._interactionService.openSnackBarOkRequest(this.translate.instant('project.stoppedProcessMessage'));
            this.trainProcessStarted = false;
            this.inferenceProcessStarted = false;
            process.showStopButton = false;
            process.showDisabledButton = true;
            process.process_status = ProcessStatus[2];
            //this.checkStatusTrainButton();
            this._interactionService.runningProcesses = this._interactionService.runningProcesses.filter(item => item.processId !== process.processId);
          }
          else {
            dialogRefSpinner.close();
            this.trainProcessStarted = true;
            this.inferenceProcessStarted = true;
          }
        }, error => {
          dialogRefSpinner.close();
          this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
        })
      }
      else {
        console.log('Canceled');
      }
    });
  }

  markNotificationAsRead(process) {
    if (process.unread == true) {
      process.unread = false;
      this._interactionService.decreaseNotificationsNumber();
    }
  }

  //dropdown functions
  getAllowedProperties(modelName: string, datasetName: string) {
    let selectedModelId;
    let selectedDatasetId;
    let modelList = this._interactionService.getModelsByTaskArray();
    modelList.forEach(model => {
      if (model.name == modelName) {
        selectedModelId = model.id;
      }
    });
    let datasetList = this._interactionService.getDatasetResponseData();
    datasetList.forEach(dataset => {
      if (dataset.name == datasetName) {
        selectedDatasetId = dataset.id;
      }
    })
    let propertyList = this._interactionService.getProperties();
    for (let entry of propertyList) {
      this._dataService.allowedProperties(selectedModelId, entry.id, selectedDatasetId).subscribe(data => {
        if (data[0] != undefined) {
          this.updatePropertiesList(entry.id, data);
        }
        else {
          this._dataService.propertiesById(entry.id).subscribe(data => {
            if (data != undefined) {
              this.updatePropertiesListById(data);
            }
          })
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
      } else {
        propertyValuesNameList = property.default_value;
      }
    });

    switch (propertyId) {
      case 1:
        this.learningRateValue = propertyValuesNameList;
        break;
      case 2:
        this.lossDropdown = [];
        this.lossDropdown = propertyValuesNameList;
        this.selectedOptionLoss = propertyValuesNameList[0];
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
        this.selectedOptionMetric = propertyValuesNameList[0];
        break;
      case 6:
        this.inputHeightValue = propertyValuesNameList;
        break;
      case 7:
        this.inputWidthValue = propertyValuesNameList;
        break;
    }
  }

  updatePropertiesListById(contentData) {
    let valuesArray = Array<string>();
    if (contentData.values != null) {
      valuesArray = contentData.values.split(",");
    } else {
      valuesArray = contentData.default;
    }
    switch (contentData.name) {
      case "Learning rate":
        this.learningRateValue = valuesArray;
        break;
      case "Loss function":
        this.lossDropdown = [];
        this.lossDropdown = valuesArray;
        this.selectedOptionLoss = valuesArray[0];
        break;
      case "Epochs":
        this.epochsValue = valuesArray;
        break;
      case "Batch size":
        this.batchSizeValue = valuesArray;
        break;
      case "Metric":
        this.metricDropdown = [];
        this.metricDropdown = valuesArray;
        this.selectedOptionMetric = valuesArray[0];
        break;
      case "Input height":
        this.inputHeightValue = valuesArray;
        break;
      case "Input width":
        this.inputWidthValue = valuesArray;
        break;
      case "Training augmentations":
        this.trainingAugmentationsValue = valuesArray;
        break;
      case "Validations augmentations":
        this.validationAugmentationsValue = valuesArray;
        break;
      case "Test augmentations":
        this.testAugmentationsValue = valuesArray;
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
        this._interactionService.openSnackBarBadRequest("Error: " + error.error.Error);
      })
  }

  triggerSelectedModel(event) {
    this.weightDropdown = [];
    this._interactionService.selectedModel = event.value;
    this.getWeights(this._interactionService.selectedModel);
    this.getAllowedProperties(this._interactionService.selectedModel, null);
  }

  triggerSelectedDataset(event) {
    var selectedDataset = event.value;
    //this.getAllowedProperties(this._interactionService.selectedModel, selectedDataset);
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    this._dataService.getWeightsArray(this.modelIdEditWeight).subscribe(data => {
      if (data.length != 0) {
        dialogRef.close();
        this.showWeightDetailsTable = false;
        this.displayWeightsListByModel(data);
      } else {
        dialogRef.close();
        this.displayWeightsListByModel(data);
        this.showWeightDetailsTable = false;
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorMessageGetModelWeightList'));
      }
    })
  }

  displayWeightsListByModel(weightdataList) {
    this.weightsEditData = [];

    weightdataList.forEach(weightdata => {
      this.weightDisplayMode = weightdata.public;
      weightdata.users.forEach(user => {
        if (user.permission == "OWN") {
          this.weightOwner = user.username;
        }
      })
      this.weightsEditData.push({ weightId: weightdata.id, weightName: weightdata.name, weightDatasetId: weightdata.dataset_id, weightOwner: this.weightOwner, weightPublic: this.weightDisplayMode, weightUsers: weightdata.users });

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

    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

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
          let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
          this._dataService.updateWeight(weight.weightId, weight.weightName, this.modelIdEditWeight, weight.weightDatasetId, weight.pretrained_on, weight.weightPublic, this.users).subscribe(data => {
            if (data.statusText == "OK") {
              dialogRefSpinner.close();
              this._interactionService.openSnackBarOkRequest(this.translate.instant('project.updateWeightResult'));
              this._interactionService.resetEditWeightsList(data.body);
              console.log(data.body);
              console.log("weight " + weight.weightName + " updated");
            }
          }, error => {
            dialogRefSpinner.close();
            this._dataService.getWeightsArray(this.modelIdEditWeight).subscribe(data => {
              this.displayWeightsListByModel(data);
            })
            this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
          });
        }
      });
    })
  }

  showWeightDetails(weight) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    this._dataService.getWeightById(weight.weightId).subscribe(data => {
      dialogRef.close();
      this.updateWeightDetails(data);
    }, error => {
      dialogRef.close();
      this._interactionService.openSnackBarBadRequest("Error: " + error.details);
    });
  }

  updateWeightDetails(contentData) {
    this.showWeightDetailsTable = true;
    let dummyArray = [];
    let dataset_name;
    let model_name;
    let public_weight;
    let pretrained_on;
    let associated_users = [];
    let nrAssociatedUsers = 0;
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
    if (contentData.pretrained_on == null || contentData.pretrained_on == undefined) {
      pretrained_on = this.translate.instant('project.noPretrainedWeight');
    } else {
      pretrained_on = contentData.pretrained_on;
    }
    if (contentData.public.toString() == "false") {
      public_weight = this.translate.instant('project.privateWeight');
    } else {
      public_weight = this.translate.instant('project.publicWeight');
    }

    contentData.users.forEach(user => {
      if (user.permission == "VIEW") {
        associated_users.push(user.username);
        nrAssociatedUsers++;
      }
    })
    if (nrAssociatedUsers == 0) {
      associated_users.push(this.translate.instant('project.noAssociatedUsers'));
    }
    dummyArray.push(
      {
        Weight_Id: contentData.id,
        Name: contentData.name,
        dataset_name: dataset_name,
        model_name: model_name,
        pretrained_on: pretrained_on,
        public_weight: public_weight,
        associated_users: associated_users
      });
    this.weightIdForTitle = contentData.id;
    this.weightDetails = new MatTableDataSource(dummyArray);
  }

  deleteWeight(weight) {
    let itemToDelete = new ItemToDelete();
    itemToDelete.type = "weight";
    itemToDelete.deletedItem = weight;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('delete-dialog.deleteWeightTitle'),
      dialogDeletedItem: itemToDelete.deletedItem.weightName,
      deletedItemInputPlaceHolder: this.translate.instant('project.weightName'),
      dialogContent: this.translate.instant('delete-dialog.areYouSureDeleteWeight'),
      deleteObject: itemToDelete
    }

    let dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
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

  showOutputProcess(process) {
    this.openOutputResultCustom(process.processId);
    this.displayOutputResultsOuputsTable(process);
    //this.showProcessPropertiesTable(process);
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
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
      dialogRef.close();
      this._interactionService.openSnackBarOkRequest(this.translate.instant('output-details-dialog.outputStatusOk'));
    }, error => {
      dialogRef.close();
      this._interactionService.openSnackBarBadRequest(this.translate.instant('output-details-dialog.outputStatusError'));
    })
  }

  checkProcessStatusForOutput(process) {
    if (process.process_status == "finished") {
      if (process.process_type == "training") {
        this.showGraphicProcess = true;
        this.showProgressBarProcess = false;
        this.showOutputResultsProcess(process);
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
      this.showOutputResultsProcess(process);
    }
  }

  cleanOutputResultsOuputsTableList() {
    this.outputResultsDetailProcessId = undefined;
    this.outputResultsData = [];
    this.outputList = new MatTableDataSource(this.outputResultsData);
    this.showOutputRunning = false;
  }

  onShowInferenceOutputDetails(outputResultsRow) {
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

  showOutputProcessFromWeights(process) {
    this.displayOutputResultsOuputsTable(process);
  }

  showOutputResultsProcess(process) {
    this.fullStatusProcess = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    this._dataService.statusCompleteForEvolution(process.processId, this.fullStatusProcess).subscribe(data => {
      dialogRef.close();
      this.showOutputRunning = true;
      this.showOutputInferenceSingle = false;
      this.showGraphicData(data);
      this.outputResultsDetailProcessId = process.processId;
      this._interactionService.openSnackBarOkRequest(this.translate.instant('output-details-dialog.outputStatusOk'));
      this._interactionService.changeStopButton(process);
    }, error => {
      dialogRef.close();
      this.showOutputRunning = false;
      this.showOutputInferenceSingle = false;
      this._interactionService.openSnackBarBadRequest(this.translate.instant('project.outputStatusError'));
    });
  }

  showProcessPropertiesTable(process) {
    let propertyId;
    this._dataService.trainingSettings(process.training_id, propertyId).subscribe(data => {
      console.log(data);
      this.showOutputRunning = true;
      this.showOutputInferenceSingle = false;
      let outputsResultsTable = data;
      let outputsArray = [];
      let outputModel, outputDataset, outputWeight, outputEpoch, outputLoss, outputMetric, outputBatch, outputInputH, outputInputW, outputTrainingAug, outputValidationAug;
      let varModel = ' "model_id":', varDataset = ' "dataset_id":', varWeight = ' "weight_id":', varEpoch = ' "epochs":';
      let varLoss = ' "loss": "', varMetric = ' "metric": "', varBatch = ' "batch_size":', varInputH = ' "input_h":', varInputW = ' "input_w":';
      let varTrainingAug = ' "train_augs":', varValidationAug = ' "val_augs":';

      // outputsResultsTable.forEach(output => {
      //   if (output.indexOf(varModel) > 0) {
      //     outputModel = output.substr(output.indexOf(varModel) + varModel.length, ' 1,'.length - 1);
      //   }
      //   if (output.indexOf(varDataset) > 0) {
      //     outputDataset = output.substr(output.indexOf(varDataset) + varDataset.length, ' 1,'.length - 1);
      //   }
      //   if (output.indexOf(varWeight) > 0) {
      //     outputWeight = output.substr(output.indexOf(varWeight) + varWeight.length, ' 475,'.length - 1);
      //   }
      //   if (output.indexOf(varEpoch) > 0) {
      //     outputEpoch = output.substr(output.indexOf(varEpoch) + varEpoch.length, ' 3,'.length - 1);
      //   }
      //   if (output.indexOf(varLoss) > 0) {
      //     outputLoss = output.substr(output.indexOf(varLoss) + varLoss.length, ' CrossEntropy",'.length - 3);
      //   }
      //   if (output.indexOf(varMetric) > 0) {
      //     outputMetric = output.substr(output.indexOf(varMetric) + varMetric.length, ' CategoricalAccuracy",'.length - 3);
      //   }
      //   if (output.indexOf(varBatch) > 0) {
      //     outputBatch = output.substr(output.indexOf(varBatch) + varBatch.length, ' 64,'.length - 1);
      //   }
      //   if (output.indexOf(varInputH) > 0) {
      //     outputInputH = output.substr(output.indexOf(varInputH) + varInputH.length, ' 100,'.length - 1);
      //   }
      //   if (output.indexOf(varInputW) > 0) {
      //     outputInputW = output.substr(output.indexOf(varInputW) + varInputW.length, ' 100,'.length - 1);
      //   }
      //   if (output.indexOf(varTrainingAug) > 0) {
      //     outputTrainingAug = output.substr(output.indexOf(varTrainingAug) + varTrainingAug.length, ' null,'.length - 1);
      //   }
      //   if (output.indexOf(varValidationAug) > 0) {
      //     outputValidationAug = output.substr(output.indexOf(varValidationAug) + varValidationAug.length, ' null,'.length - 1);
      //   }
      // })
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
    })
  }

  showGraphicData(contentData) {
    var outputsResults = contentData.status.process_data;
    let outputCross;
    let outputAccuracy;
    let outputBatch;
    let varCrossEntropy = "categorical_cross_entropy=";
    let varCategoricalAccuracy = " - categorical_accuracy=";
    let varBatch = "Inference Batch";
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    if (this.selectedUsersData != null) {
      this.selectedUsersData.forEach(selectedUser => {
        this._interactionService.usersList = this._interactionService.usersList.filter(item => item.username != selectedUser);
        this._interactionService.usersAssociatedArray.push({ "username": selectedUser, "permission": PermissionStatus[1] });
      })
      this.updateUsersList(this._interactionService.usersList);
      this.updateAssociatedUsersList(this._interactionService.usersAssociatedArray);
    }
    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    this._interactionService.usersAssociatedArray.push({ "username": this._interactionService.projectOwner, "permission": PermissionStatus[0] });
    this._dataService.updateProject(projectName, this._interactionService.currentProject.id, this._interactionService.currentProject.task_id,
      this._interactionService.usersAssociatedArray).subscribe(data => {
        if (data.statusText == "OK") {
          dialogRef.close();
          this._interactionService.changeProjectTabName(projectName);
          this._interactionService.openSnackBarOkRequest(this.translate.instant('project.succesMessageUpdateProject'));
          this._interactionService.usersAssociatedArray = data.body.users;
          this._interactionService.usersAssociatedArray = this._interactionService.usersAssociatedArray.filter(item => item.username != this._interactionService.projectOwner)
          this.updateAssociatedUsersList(this._interactionService.usersAssociatedArray);
        }
      }), error => {
        dialogRef.close();
        this._interactionService.openSnackBarBadRequest("Error:" + error.statusText);
      }
  }

  deleteUser(projectName) {
    let itemToDelete = new ItemToDelete();
    itemToDelete.type = "users";
    itemToDelete.deletedItem = projectName;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('delete-dialog.deleteUsersTitle'),
      dialogDeletedItem: this.selectedAssociatedUsers,
      deletedItemInputPlaceHolder: this.translate.instant('delete-dialog.inputPlaceHolderUsersName'),
      dialogContent: this.translate.instant('delete-dialog.areYouSureDeleteUsers'),
      deleteObject: itemToDelete
    }

    let dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result && this.selectedAssociatedUsers != null) {
        this.updateAssociatedUsersList(this._interactionService.usersAssociatedArray);
        this.updateUsersList(this._interactionService.usersList);
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

  deleteProject(project) {
    let itemToDelete = new ItemToDelete();
    itemToDelete.type = "project";
    itemToDelete.deletedItem = project;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('delete-dialog.deleteProjectTitle'),
      dialogDeletedItem: itemToDelete.deletedItem.name,
      deletedItemInputPlaceHolder: this.translate.instant('powerUser.projectName'),
      dialogContent: this.translate.instant('delete-dialog.areYouSureDeleteProject'),
      deleteObject: itemToDelete
    }

    let dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        this._interactionService.closeProjectTab();
        this.router.navigate(['/power-user']);
      }
    });
  }
}
