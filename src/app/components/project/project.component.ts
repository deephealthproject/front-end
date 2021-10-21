import { Component, OnInit, ViewChild, ElementRef, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { InteractionService } from '../../services/interaction.service';
import { DataService } from '../../services/data.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogTrainComponent } from '../confirm-dialog-train/confirm-dialog-train.component';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PropertyInstance, Project, Model, Weight, User, PermissionStatus, ProcessingObject, ProcessStatus, ItemToDelete, TypeOfItemToDelete } from '../power-user/power-user.component';
import { UploadDatasetsDialogComponent } from '../upload-datasets-dialog/upload-datasets-dialog.component';
import { UpdateWeightDialogComponent } from '../update-weight-dialog/update-weight-dialog.component';
import { ShowOutputDetailsDialogComponent } from '../show-output-details-dialog/show-output-details-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ProgressSpinnerDialogComponent } from '../progress-spinner-dialog/progress-spinner-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { PropertyItem } from '../property-item';
import { DropdownComponent } from '../dynamic-components/dropdown/dropdown.component';
import { InputTextComponent } from '../dynamic-components/input-text/input-text.component';
import { InputFloatComponent } from '../dynamic-components/input-float/input-float.component';
import { InputIntegerComponent } from '../dynamic-components/input-integer/input-integer.component';

export class Task {
  id: number;
  name: string;
  checked: boolean;
}

export enum UploadModelStatus {
  PENDING,
  STARTED,
  RETRY,
  FAILURE,
  SUCCESS,
  REVOKED
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
  createModelAllowedPropertiesIsClicked = false;

  //divs show status
  divMiddleShowStatus = true;
  divLeftShowStatus = true;
  divNetworkStatisticsShowStatus = false;
  divDetailsLeftSideShowStatus = false;
  divNotificationsShowStatus = false;
  divEditWeightsShowStatus = false;
  divOutputResultsShowStatus = false;
  divEditProjectShowStatus = false;
  divCreateModelAllowedPropertiesShowStatus = false;

  //Task radio buttons
  tasks: Task[];

  //Input Type radio buttons
  checkedStateImageInputType = false;
  checkedStateTextInputType = false;
  checkedState3DInputType = false;
  checkedStateVideoInputType = false;

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
  selectedOptionTaskManager = null;
  selectedOptionEnvironment = null;

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

  selectedOption = null;

  populatedPropertyAllowedValuesList = [];
  populatedPropertyDefaultValue = [];
  populatedPropertyAllowedValue = [];

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
  disabledInferenceButton = false;
  disabledInferenceSingleButton = false;
  showInference = false;
  showTrainButton = false;
  disabledStopButton = false;
  process_type: string;
  trainMessage: string = null;
  inferenceMessage: string = null;
  modelsResponseData: Array<Model>;
  currentProject: Project;
  fullStatusProcess = false;

  selectedInputType = null;
  selectedEnvironment;

  //upload Dataset
  datasetName: string;
  datasetPath: string;
  datasetLocalPath: string;
  isUrlLink = false;
  datasetPublic: Boolean = true;
  datasetColorTypeImage: string;
  datasetColorTypeGroundTruth: string;

  //upload Modelweight
  modelWeightName: string;
  modelWeightPath: string;
  datasetId;
  modelWeightFormData;
  modelId;
  uploadStatusVar;
  inputLayersToRemove;
  inputClasses;

  //updateWeights
  weights: Array<Weight> = [];
  weightName: string;
  weightsList: MatTableDataSource<any>;
  weightDetails: MatTableDataSource<any>;
  displayedWeightDetailsColumns: string[] = ['weight_id', 'weight_name', 'dataset_name', 'model_name', 'pretrained_on', "public_weight", "associated_users", "classes", "layers_to_remove", "is_active"];
  displayedColumns: string[] = ['weightId', 'weightName', 'weightDatasetId', 'weightOwner', 'weightProcessId', 'weightOptions'];
  weightsEditData = [];
  selectedOptionModelEditList = null;
  modelIdEditWeight = null;
  selectedValueEditWeight = undefined;
  weightIdForTitle: any;
  weightDisplayMode;
  weightOwner;
  weightProcessId;

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

  metricChartObject;
  values: any[];
  view: any[] = [1290, 370];
  crossEntropyChartValues = [];
  categoricalAccuracyChartValues = [];

  // chart options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Epoch';
  yAxisLabel: string = 'Loss';
  yMetricAxisLabel: string = 'Metric';
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
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) {
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
  @ViewChild('inference', { static: true }) inference: ElementRef;
  @ViewChild('inferenceSingle', { static: true }) inferenceSingleButton: ElementRef;
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

  @ViewChild('processPaginator', { read: MatPaginator, static: true }) processPaginator: MatPaginator;
  @ViewChild('modelWeightPaginator', { read: MatPaginator, static: true }) modelWeightPaginator: MatPaginator;
  @ViewChild('outputPaginator', { read: MatPaginator }) outputPaginator: MatPaginator;

  @ViewChild('processTableSort', { static: true }) processTableSort: MatSort;
  @ViewChild('modelWeightTableSort', { static: true }) modelWeightTableSort: MatSort;
  @ViewChild('outputTableSort') outputTableSort: MatSort;

  @ViewChild(MatSelectionList, { static: true }) usersSelection: MatSelectionList;
  @ViewChild(MatSelectionList, { static: true }) associatedUsersSelection: MatSelectionList;

  //@Input() dynamicPropertyList: PropertyItem[] = [];
  @ViewChild('viewPropertiesContainer', { read: ViewContainerRef }) viewPropertiesContainer: ViewContainerRef;
  @ViewChild('viewLearningRateContainer', { read: ViewContainerRef, static: true }) viewLearningRateContainer: ViewContainerRef;
  @ViewChild('viewEpochsContainer', { read: ViewContainerRef, static: true }) viewEpochsContainer: ViewContainerRef;
  @ViewChild('viewBatchSizeContainer', { read: ViewContainerRef, static: true }) viewBatchSizeContainer: ViewContainerRef;
  @ViewChild('viewInputWidthContainer', { read: ViewContainerRef, static: true }) viewInputWidthContainer: ViewContainerRef;
  @ViewChild('viewInputHeightContainer', { read: ViewContainerRef, static: true }) viewInputHeightContainer: ViewContainerRef;
  @ViewChild('viewLossFunctionContainer', { read: ViewContainerRef, static: true }) viewLossFunctionContainer: ViewContainerRef;
  @ViewChild('viewMetricContainer', { read: ViewContainerRef, static: true }) viewMetricContainer: ViewContainerRef;
  @ViewChild('viewTrainingAugmentationsContainer', { read: ViewContainerRef, static: true }) viewTrainingAugmentationsContainer: ViewContainerRef;
  @ViewChild('viewValidationAugmentationsContainer', { read: ViewContainerRef, static: true }) viewValidationAugmentationsContainer: ViewContainerRef;
  @ViewChild('viewTestAugmentationsContainer', { read: ViewContainerRef, static: true }) viewTestAugmentationsContainer: ViewContainerRef;

  @ViewChild('viewLearningRateContainer2', { read: ViewContainerRef, static: true }) viewLearningRateContainer2: ViewContainerRef;
  @ViewChild('viewEpochsContainer2', { read: ViewContainerRef, static: true }) viewEpochsContainer2: ViewContainerRef;
  @ViewChild('viewBatchSizeContainer2', { read: ViewContainerRef, static: true }) viewBatchSizeContainer2: ViewContainerRef;
  @ViewChild('viewInputWidthContainer2', { read: ViewContainerRef, static: true }) viewInputWidthContainer2: ViewContainerRef;
  @ViewChild('viewInputHeightContainer2', { read: ViewContainerRef, static: true }) viewInputHeightContainer2: ViewContainerRef;
  @ViewChild('viewLossFunctionContainer2', { read: ViewContainerRef, static: true }) viewLossFunctionContainer2: ViewContainerRef;
  @ViewChild('viewMetricContainer2', { read: ViewContainerRef, static: true }) viewMetricContainer2: ViewContainerRef;
  @ViewChild('viewTrainingAugmentationsContainer2', { read: ViewContainerRef, static: true }) viewTrainingAugmentationsContainer2: ViewContainerRef;
  @ViewChild('viewValidationAugmentationsContainer2', { read: ViewContainerRef, static: true }) viewValidationAugmentationsContainer2: ViewContainerRef;
  @ViewChild('viewTestAugmentationsContainer2', { read: ViewContainerRef, static: true }) viewTestAugmentationsContainer2: ViewContainerRef;

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
    this._interactionService.processPaginator = this.processPaginator;
    this._interactionService.processTableSort = this.processTableSort;
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
        this._interactionService.disabledTrainButton = state;
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
    );

    this._interactionService.projectDivCreateModelAllowedPropertiesShowStatus$.subscribe(
      state => {
        this.divCreateModelAllowedPropertiesShowStatus = state;
      }
    );
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

    this._interactionService.selectedOptionTaskManager$.subscribe(
      state => {
        this.selectedOptionTaskManager = state;
      }
    );

    this._interactionService.selectedOptionEnvironment$.subscribe(
      state => {
        this.selectedOptionEnvironment = state;
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
    );

    this._interactionService.projectCreateModelAllowedPropertiesIsClicked$.subscribe(
      state => {
        this.createModelAllowedPropertiesIsClicked = state;
      }
    );

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
        selectedColorTypeImage: null,
        selectedColorTypeGroundTruth: null,
        userDropdown: usersData
      }

      let dialogRef = this.dialog.open(UploadDatasetsDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        if (result) {
          if (result.inputValue) {
            this.datasetName = result.inputValue;
            this.isUrlLink = result.isUrlLink;
            this.datasetPublic = result.datasetDisplayMode;
            this.datasetPath = result.inputValuePath;
            this.datasetColorTypeImage = result.selectedColorTypeImage;
            this.datasetColorTypeGroundTruth = result.selectedColorTypeGroundTruth;

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
            this._dataService.uploadDataset(this.datasetName, taskId, this.datasetPath, this.users, this.datasetPublic, this.datasetColorTypeImage, this.datasetColorTypeGroundTruth).subscribe(data => {
              if (data.statusText == "Created") {
                dialogRefSpinner.close();
                this._interactionService.openSnackBarOkRequest(this.translate.instant('upload-dataset-dialog.uploadDatasetResult'));
                this.datasetDropdown.push(data.body.name);
                console.log("dataset " + this.datasetName + " uploaded");
              }
            }, error => {
              dialogRefSpinner.close();
              this._interactionService.openSnackBarBadRequest("Error: " + error.error.error);
            });
          }
        }
      });
    });
  }

  uploadModelWeight() {
    this.process_type = "uploading modelweight"
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
      this._dataService.getModels(taskId).subscribe(modelData => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          inputValue: this.modelWeightName,
          dialogTitle: this.translate.instant('upload-dataset-dialog.uploadModelProcess'),
          dialogContent: this.translate.instant('upload-dataset-dialog.uploadModelContent'),
          inputPlaceHolder: this.translate.instant('upload-dataset-dialog.uploadModelName'),
          isUrlLink: this.isUrlLink,
          inputValuePath: this.modelWeightPath,
          selectedDatasetName: null,
          modelWeightFormData: this.modelWeightFormData,
          datasetDropdownForUploadModelWeight: datasetData,
          selectedModelName: null,
          modelDropdownForUploadModelWeight: modelData,
          inputValueLayersToRemove: this.inputLayersToRemove,
          inputValueClasses: this.inputClasses
        }

        let dialogRef = this.dialog.open(UploadDatasetsDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          console.log(result);
          if (result) {
            if (result.inputValue) {
              this.modelWeightName = result.inputValue;
              this.isUrlLink = result.isUrlLink;
              this.modelWeightFormData = result.modelWeightFormData;
              this.modelWeightPath = result.inputValuePath;
              this.inputLayersToRemove = result.inputValueLayersToRemove;
              this.inputClasses = result.inputValueClasses;

              result.datasetDropdownForUploadModelWeight.forEach(element => {
                if (element.name == result.selectedDatasetName) {
                  this.datasetId = element.id;
                }
              });
              result.modelDropdownForUploadModelWeight.forEach(element => {
                if (element.name == result.selectedModelName) {
                  this.modelId = element.id;
                }
              });
              formData.append("name", this.modelWeightName);
              formData.append("model_id", this.modelId);
              formData.append("dataset_id", this.datasetId);
              formData.append("onnx_data", this.modelWeightFormData.onnx_data);
              if (this.inputLayersToRemove != null || this.inputLayersToRemove != undefined) {
                formData.append("layer_to_remove", this.inputLayersToRemove);
              }
              if (this.inputLayersToRemove != null || this.inputLayersToRemove != undefined) {
                formData.append("classes", this.inputClasses);
              }
              let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
              if (this.modelWeightFormData.onnx_data != undefined || this.modelWeightFormData.onnx_data != null) {
                this._dataService.uploadModelWeight(formData).subscribe(data => {
                  if (data.statusText == "Created") {
                    dialogRefSpinner.close();
                    this._interactionService.openSnackBarOkRequest(this.translate.instant('upload-dataset-dialog.uploadModelResult'));
                    console.log(data.body);
                    let process = new ProcessingObject;
                    process.projectId = this._interactionService.currentProject.id;
                    process.processId = data.body.process_id;
                    process.process_status = UploadModelStatus[1];
                    process.process_type = this.process_type;
                    process.unread = true;
                    this._interactionService.changeStopButton(process);
                    this._interactionService.runningProcesses.push(process);
                    setTimeout(() => {
                      this.checkStatusUploadModelWeight(process);
                    }, 2000);
                  }
                }, error => {
                  dialogRefSpinner.close();
                  this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
                });
              } else {
                this._dataService.uploadModelWeightFromURL(this.modelWeightName, this.modelId, this.datasetId, this.modelWeightPath, this.inputLayersToRemove, this.inputClasses).subscribe(data => {
                  if (data.statusText == "Created") {
                    dialogRefSpinner.close();
                    this._interactionService.openSnackBarOkRequest(this.translate.instant('upload-dataset-dialog.uploadModelResult'));
                    console.log(data.body);
                    let process = new ProcessingObject;
                    process.projectId = this._interactionService.currentProject.id;
                    process.processId = data.body.process_id;
                    process.process_status = UploadModelStatus[1];
                    process.process_type = this.process_type;
                    process.unread = true;
                    this._interactionService.changeStopButton(process);
                    this._interactionService.runningProcesses.push(process);
                    setTimeout(() => {
                      this.checkStatusUploadModelWeight(process);
                    }, 2000);
                  }
                }, error => {
                  dialogRefSpinner.close();
                  this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
                });
              }
            }
          }
        });
      });
    });
  }

  checkStatusUploadModelWeight(process) {
    console.log(process);
    let contentData;
    this._dataService.uploadModelWeightStatus(process.processId).subscribe(data => {
      contentData = data;
      process.projectId = process.projectId;
      process.process_type = contentData.process_type;
      process.process_status = contentData.result;
      this._interactionService.changeStopButton(process);
      if (process.process_status == "PENDING" || process.process_status == "STARTED") {
        console.log(process.process_status);
        setTimeout(() => {
          this.checkStatusUploadModelWeight(process)
        }, 10 * 1000);
      }
      else if (process.process_status == "SUCCESS") {
        this._interactionService.openSnackBarOkRequest(this.translate.instant('upload-dataset-dialog.finishedUploadModelProcessMessage'));
        console.log("Model " + this.modelWeightName + " uploaded");
        process.unread = true;
        this._interactionService.increaseNotificationsNumber();
      }
      else if (process.process_status == "FAILURE" || process.process_status == "RETRY" || process.process_status == "REVOKED") {
        process.unread = true;
        this._interactionService.increaseNotificationsNumber();
        this._interactionService.openSnackBarBadRequest(this.translate.instant('upload-dataset-dialog.errorUploadModelProcessMessage'));
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
    this.initialisePropertiesContainers();
    this._interactionService.resetSelectedOptions();
    this.weightDropdown = [];
    this.showTrainButton = false;
    this._interactionService.editAllowedProperties = false;

    this._interactionService.changeShowStateProjectDivLeft(true);
    this._interactionService.changeShowStateProjectDivMiddle(true);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivModelAllowedProperties(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(true);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectCreateModelAllowedPropertiesIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);
  }

  openNetworkStatistics() {
    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(true);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivModelAllowedProperties(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(true);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectCreateModelAllowedPropertiesIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);
  }

  openNotifications() {
    this._interactionService.cleanProcessesList();
    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(true);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivModelAllowedProperties(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(true);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectCreateModelAllowedPropertiesIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);

    this._interactionService.showProcesses();
  }

  openEditWeights() {
    this.cleanWeightsEditList();

    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(true);
    this._interactionService.changeShowStateProjectDivModelAllowedProperties(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(true);
    this._interactionService.changeStateProjectCreateModelAllowedPropertiesIsClicked(false);
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
    this._interactionService.changeShowStateProjectDivModelAllowedProperties(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(true);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectCreateModelAllowedPropertiesIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);
  }

  openCreateModelAllowedProperties() {
    this._interactionService.resetSelectedOptions();
    this.initialisePropertiesContainers();
    this._interactionService.editAllowedProperties = true;

    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivModelAllowedProperties(true);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectCreateModelAllowedPropertiesIsClicked(true);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);
  }

  //train & inference functions
  trainModel() {
    this.process_type = "training";
    this.trainProcessStarted = true;

    let selectedProperties: PropertyInstance[] = [];
    this.populatePropertiesForTrainingProcess(selectedProperties);

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
        process_type: this.process_type,
        selectedTaskManager: this.selectedOptionTaskManager,
        selectedEnvironmentType: this.selectedOptionEnvironment,
        selectedEnvironment: this.selectedEnvironment
      }

      let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        if (result && this.trainProcessStarted == true && this.selectedOptionWeight != null && this.selectedOptionDataset != null) {
          if (result.selectedTaskManager == "CELERY") {
            let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
            this._dataService.trainModel(selectedDatasetId, selectedWeightId, selectedProperties, this._interactionService.currentProject.id, result.selectedTaskManager).subscribe(data => {
              if (data.body.result == "ok") {
                dialogRefSpinner.close();
              }
              this._interactionService.openSnackBarOkRequest(this.translate.instant('project.startedTrainProcessMessage'));
              this.trainProcessStarted = true;
              this.showTrainButton = true;
              let process = new ProcessingObject;
              //data creare
              process.projectId = this._interactionService.currentProject.id;
              process.processId = data.body.process_id;
              process.process_status = ProcessStatus[1];
              process.process_type = this.process_type;
              process.training_id = data.body.training_id;
              process.unread = true;
              this._interactionService.disabledTrainButton = false;
              this._interactionService.runningProcesses.push(process);
              this._interactionService.changeStopButton(process);
              this.trainMessage = "The process of the type " + process.process_type + ", with the id " + process.processId + ", has the status: " + process.process_status + ".";
              //this.checkStatusTrainButton();
              setTimeout(() => {
                this.checkStatusTrain(process)
              }, 1000);
            }, error => {
              this.trainProcessStarted = false;
              dialogRefSpinner.close();
              this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
            });
          } else {
            let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
            this._dataService.trainModelStreamFlow(selectedDatasetId, selectedWeightId, selectedProperties, this._interactionService.currentProject.id, result.selectedTaskManager, result.selectedEnvironment).subscribe(data => {
              if (data.body.result == "ok") {
                dialogRefSpinner.close();
              }
              this._interactionService.openSnackBarOkRequest(this.translate.instant('project.startedTrainProcessMessage'));
              this.trainProcessStarted = true;
              this.showTrainButton = true;
              let process = new ProcessingObject;
              //data creare
              process.projectId = this._interactionService.currentProject.id;
              process.processId = data.body.process_id;
              process.process_status = ProcessStatus[1];
              process.process_type = this.process_type;
              process.training_id = data.body.training_id;
              process.unread = true;
              this._interactionService.disabledTrainButton = false;
              this._interactionService.runningProcesses.push(process);
              this._interactionService.changeStopButton(process);
              this.trainMessage = "The process of the type " + process.process_type + ", with the id " + process.processId + ", has the status: " + process.process_status + ".";
              //this.checkStatusTrainButton();
              setTimeout(() => {
                this.checkStatusTrain(process)
              }, 1000);
            }, error => {
              this.trainProcessStarted = false;
              dialogRefSpinner.close();
              this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
            });
          }
        }
      });
    }
    else {
      this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorMessageLearningrateLimits'));
      this.trainProcessStarted = false;
      this.showTrainButton = true;
      console.log('Canceled');
    }
  }

  populatePropertiesForTrainingProcess(selectedProperties) {
    let learning = new PropertyInstance;
    learning.name = this._interactionService.learningRateName;
    learning.value = this._interactionService.learningRateValue;
    if (learning.value >= 0.00001 && learning.value <= 0.01) {
      selectedProperties.push(learning);
    }
    else {
      this.trainProcessStarted = false;
    }
    let metric = new PropertyInstance;
    metric.name = this._interactionService.metricName;
    metric.value = this._interactionService.metricValue;
    selectedProperties.push(metric);
    let loss = new PropertyInstance;
    loss.name = this._interactionService.lossFunctionName;
    loss.value = this._interactionService.lossFunctionValue;
    selectedProperties.push(loss);
    let epochs = new PropertyInstance;
    epochs.name = this._interactionService.epochName;
    epochs.value = this._interactionService.epochValue;
    if (epochs.value >= 1 && epochs.value <= 300) {
      selectedProperties.push(epochs);
    }
    else {
      this.trainProcessStarted = false;
    }
    let batchSize = new PropertyInstance;
    batchSize.name = this._interactionService.batchSizeName;
    batchSize.value = this._interactionService.batchSizeValue;
    selectedProperties.push(batchSize);
    let inputHeight = new PropertyInstance;
    inputHeight.name = this._interactionService.inputHeightName;
    inputHeight.value = this._interactionService.inputHeightValue;
    if (this._interactionService.inputHeightValue != null) {
      selectedProperties.push(inputHeight);
    }
    let inputWidth = new PropertyInstance;
    inputWidth.name = this._interactionService.inputWidthName;
    inputWidth.value = this._interactionService.inputWidthValue;
    if (this._interactionService.inputWidthValue != null) {
      selectedProperties.push(inputWidth);
    }
    let trainingAugmentations = new PropertyInstance;
    trainingAugmentations.name = this._interactionService.trainingAugmentationsName;
    trainingAugmentations.value = this._interactionService.trainingAugmentationsValue;
    if (this._interactionService.trainingAugmentationsValue != null || this._interactionService.trainingAugmentationsValue != undefined) {
      selectedProperties.push(trainingAugmentations);
    }
    let validationAugmentations = new PropertyInstance;
    validationAugmentations.name = this._interactionService.validationAugmentationsName;
    validationAugmentations.value = this._interactionService.validationAugmentationsValue;
    if (this._interactionService.validationAugmentationsValue != null || this._interactionService.validationAugmentationsValue != undefined) {
      selectedProperties.push(validationAugmentations);
    }
    let testAugmentations = new PropertyInstance;
    testAugmentations.name = this._interactionService.testAugmentationsName;
    testAugmentations.value = this._interactionService.testAugmentationsValue;
    if (this._interactionService.testAugmentationsValue != null || this._interactionService.testAugmentationsValue != undefined) {
      selectedProperties.push(testAugmentations);
    }
    let booleanProperty = new PropertyInstance;
    booleanProperty.name = this._interactionService.booleanPropertyName;
    booleanProperty.value = this._interactionService.booleanPropertyValue;
    if (this._interactionService.booleanPropertyValue != false) {
      selectedProperties.push(booleanProperty);
    }
  }

  checkStatusTrainButton() {
    let nrOfRunningProcesses = 0;
    for (let process of this._interactionService.runningProcesses) {
      if (process.process_status == "STARTED") {
        nrOfRunningProcesses++;
      }
    }
    if (nrOfRunningProcesses >= 1) {
      this._interactionService.disabledTrainButton = true;
    } else {
      this._interactionService.disabledTrainButton = false;
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
      process_type: this.process_type,
      selectedTaskManager: this.selectedOptionTaskManager,
      selectedEnvironmentType: this.selectedOptionEnvironment,
      selectedEnvironment: this.selectedEnvironment
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result && this.selectedOptionModel != null && this.selectedOptionWeight != null && this.selectedOptionDataset != null) {
        if (result.selectedTaskManager == "CELERY") {
          let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
          this._dataService.inferenceModel(selectedWeightId, selectedDatasetId, this._interactionService.currentProject.id, result.selectedTaskManager).subscribe(data => {
            if (data.body.result == "ok") {
              this.disabledInferenceButton = true;
              dialogRefSpinner.close();
            }
            this._interactionService.openSnackBarOkRequest(this.translate.instant('project.startedInferenceProcessMessage'));
            let process = new ProcessingObject;
            this.inferenceProcessStarted = true;
            //???process.process_created_date = data.body.created;
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
        } else {
          let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
          this._dataService.inferenceModelStreamFlow(selectedWeightId, selectedDatasetId, this._interactionService.currentProject.id, result.selectedTaskManager, result.selectedEnvironment).subscribe(data => {
            if (data.body.result == "ok") {
              this.disabledInferenceButton = true;
              dialogRefSpinner.close();
            }
            this._interactionService.openSnackBarOkRequest(this.translate.instant('project.startedInferenceProcessMessage'));
            let process = new ProcessingObject;
            this.inferenceProcessStarted = true;
            //???process.process_created_date = data.body.created;
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
      process_type: this.process_type,
      datasetImageData: this.datasetImageData
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result && this.selectedOptionModel != null && selectedWeightId != null) {
        this.datasetImagePath = result.inputValue;
        this.datasetImageData = result.datasetImageData;
        if (result.selectedTaskManager == "CELERY") {
          let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
          this._dataService.inferenceSingle(selectedWeightId, this.datasetImagePath, this.datasetImageData, this._interactionService.currentProject.id, result.selectedTaskManager).subscribe(data => {
            if (data.body.result == "ok") {
              this.disabledInferenceSingleButton = true;
              dialogRefSpinner.close();
            }
            this._interactionService.openSnackBarOkRequest(this.translate.instant('project.startedInferenceProcessMessage'));
            let process = new ProcessingObject;
            this.inferenceProcessStarted = true;
            //data creare
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
        } else {
          let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
          this._dataService.inferenceSingleStreamFlow(selectedWeightId, this.datasetImagePath, this.datasetImageData, this._interactionService.currentProject.id, result.selectedTaskManager, result.selectedEnvironment).subscribe(data => {
            if (data.body.result == "ok") {
              this.disabledInferenceSingleButton = true;
              dialogRefSpinner.close();
            }
            this._interactionService.openSnackBarOkRequest(this.translate.instant('project.startedInferenceProcessMessage'));
            let process = new ProcessingObject;
            this.inferenceProcessStarted = true;
            //data creare
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
      process.process_created_date = process.process_created_date;
      process.process_updated_date = process.process_updated_date;
      process.projectId = process.projectId;
      process.process_data = status.process_data;
      process.process_type = status.process_type;
      process.process_status = status.process_status;
      this._interactionService.changeStopButton(process);
      if (process.process_status == "PENDING" || process.process_status == "STARTED") {
        console.log(process.process_status);
        setTimeout(() => {
          this.checkStatusTrain(process)
        }, 10 * 1000);
      }
      if (process.process_status == "SUCCESS") {
        this._interactionService.openSnackBarOkRequest(this.translate.instant('project.finishedTrainProcessMessage'));
        this.trainProcessStarted = false;
        process.showStopButton = false;
        process.showDisabledButton = true;
        process.unread = true;
        this._interactionService.increaseNotificationsNumber();
        this._interactionService.changeStopButton(process);
      }
      if (process.process_status == "FAILURE" || process.process_status == "RETRY" || process.process_status == "REVOKED") {
        this.trainProcessStarted = false;
        let failProcess = new ProcessingObject;
        failProcess.process_created_date = process.process_created_date;
        failProcess.process_updated_date = process.process_updated_date;
        failProcess.projectId = process.projectId;
        failProcess.processId = process.processId;
        failProcess.process_data = status.process_data;
        failProcess.process_type = status.process_type;
        failProcess.process_status = status.process_status;
        failProcess.showStopButton = false;
        failProcess.showDisabledButton = true;
        failProcess.unread = true;
        this._interactionService.increaseNotificationsNumber();
        this._interactionService.changeStopButton(process);
        if (process.processId !== failProcess.processId) {
          this._interactionService.runningProcesses.push(failProcess);
        }
        this._interactionService.processData.forEach(process => {
          if (process.processId == failProcess.processId) {
            process.processStatus = failProcess.process_status;
            process.showStopButton = false;
            process.showDisabledButton = failProcess.showDisabledButton;
            this._interactionService.processesList = new MatTableDataSource(this._interactionService.processData);
            this._interactionService.processesList.paginator = this.processPaginator;
            this._interactionService.processesList.sort = this.processTableSort;
          }
        })
      }
    });
  }

  checkStatusInference(process) {
    console.log(process);
    this._dataService.status(process.processId).subscribe(data => {
      let status: any = data.status;
      process.process_created_date = process.process_created_date;
      process.process_updated_date = process.process_updated_date;
      process.projectId = process.projectId;
      process.process_data = status.process_data;
      process.process_type = status.process_type;
      process.process_status = status.process_status;
      this._interactionService.changeStopButton(process);
      if (process.process_status == "PENDING" || process.process_status == "STARTED") {
        console.log(process.process_status);
        setTimeout(() => {
          this.checkStatusInference(process)
        }, 10 * 1000);
      }
      if (process.process_status == "SUCCESS") {
        this._interactionService.openSnackBarOkRequest(this.translate.instant('project.finishedInferenceProcessMessage'));
        this.inferenceProcessStarted = false;
        process.showStopButton = false;
        process.showDisabledButton = true;
        process.unread = true;
        this._interactionService.increaseNotificationsNumber();
        this._interactionService.changeStopButton(process);
      }
      if (process.process_status == "FAILURE" || process.process_status == "RETRY" || process.process_status == "REVOKED") {
        this.inferenceProcessStarted = false;
        let failProcess = new ProcessingObject;
        failProcess.process_created_date = process.process_created_date;
        failProcess.process_updated_date = process.process_updated_date;
        failProcess.projectId = process.projectId;
        failProcess.processId = process.processId;
        failProcess.process_data = status.process_data;
        failProcess.process_type = status.process_type;
        failProcess.process_status = status.process_status;
        failProcess.showStopButton = false;
        failProcess.showDisabledButton = true;
        failProcess.unread = true;
        this._interactionService.increaseNotificationsNumber();
        this._interactionService.changeStopButton(process);
        if (process.processId !== failProcess.processId) {
          this._interactionService.runningProcesses.push(failProcess);
        }
        this._interactionService.processData.forEach(process => {
          if (process.processId == failProcess.processId) {
            process.processStatus = failProcess.process_status;
            process.showStopButton = false;
            process.showDisabledButton = failProcess.showDisabledButton;
            this._interactionService.processesList = new MatTableDataSource(this._interactionService.processData);
            this._interactionService.processesList.paginator = this.processPaginator;
            this._interactionService.processesList.sort = this.processTableSort;
          }
        })
      }
    });
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

  getWeights(modelName: string, datasetName: string) {
    let modelId;
    let contentData;
    let modelList = this._interactionService.getModelsByTaskArray();
    modelList.forEach(model => {
      if (model.name == modelName) {
        modelId = model.id;
      }
    });
    let datasetId;
    let datasetList = this._interactionService.getDatasetResponseData();
    datasetList.forEach(dataset => {
      if (dataset.name == datasetName) {
        datasetId = dataset.id;
      }
    });
    this._dataService.getWeights(modelId, datasetId).subscribe(data => {
      contentData = data;
      if (contentData.length != 0) {
        this.updateWeightsList(data);
      } else {
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorStartedTrainProcessWithoutModelweight'));
      }
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
            // process.showStopButton = false;
            // process.showDisabledButton = true;
            // process.process_status = "stopped";
            //this.checkStatusTrainButton();
            //this._interactionService.runningProcesses = this._interactionService.runningProcesses.filter(item => item.processId !== process.processId);
            // this.processData = this.processData.filter(item => item.processId !== process.processId);
            this._interactionService.runningProcesses.forEach(runningProcess => {
              if (runningProcess.processId == process.processId) {
                runningProcess.process_status = ProcessStatus[5];
                runningProcess.showStopButton = false;
                runningProcess.showDisabledButton = true;
              }
            })
            this._interactionService.processData.forEach(existingProcess => {
              if (existingProcess.processId == process.processId) {
                existingProcess.processStatus = ProcessStatus[5];
                existingProcess.showStopButton = false;
                existingProcess.showDisabledButton = true;
              }
            })
            this._interactionService.processesList = new MatTableDataSource(this._interactionService.processData);
            this._interactionService.processesList.paginator = this.processPaginator;
            this._interactionService.processesList.sort = this.processTableSort;
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
    if (process.processRead == true) {
      process.processRead = false;
      this._interactionService.decreaseNotificationsNumber();
    }
    this._interactionService.runningProcesses.forEach(runningProcess => {
      if (runningProcess.processId == process.processId) {
        runningProcess.unread = process.processRead;
      }
    })
  }

  triggerSelectedModel(event) {
    this.weightDropdown = [];
    this._interactionService.selectedModel = event.value;
    this.showTrainButton = true;
    this.getWeights(this._interactionService.selectedModel, null);
    this.getAllowedProperties(this._interactionService.selectedModel, this._interactionService.selectedDataset);
  }

  triggerSelectedDataset(event) {
    this._interactionService.selectedDataset = event.value;
    this.getAllowedProperties(this._interactionService.selectedModel, this._interactionService.selectedDataset);
    this.getWeights(this._interactionService.selectedModel, this._interactionService.selectedDataset);
  }

  //dropdown functions
  getAllowedProperties(modelName: string, datasetName: string) {
    this._interactionService.interpDropdown = [];
    this.initialisePropertiesContainers();

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
    this._interactionService.dynamicPropertyList = [];

    for (let entry of propertyList) {
      if (selectedModelId != undefined || selectedModelId != null) {
        this._dataService.allowedProperties(selectedModelId, entry.id, selectedDatasetId).subscribe(data => {
          if (data[0] != undefined) {
            this.populateDynamicAllowedPropertiesList(entry, data);
            this.initialisePropertiesContainers();
            this.populatePropertiesContainers();
          }
          else {
            this._dataService.propertiesById(entry.id).subscribe(data => {
              if (data != undefined) {
                this.populateDynamicPropertyList(entry, data);
                this.initialisePropertiesContainers();
                this.populatePropertiesContainers();
              }
            })
          }
        })
      }
      else {
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorAllowedPropertiesWithoutModel'));
      }
    }
  }

  initialisePropertiesContainers() {
    //this.viewPropertiesContainer.clear();
    this.viewLearningRateContainer.clear();
    this.viewEpochsContainer.clear();
    this.viewBatchSizeContainer.clear();
    this.viewInputWidthContainer.clear();
    this.viewInputHeightContainer.clear();
    this.viewLossFunctionContainer.clear();
    this.viewMetricContainer.clear();
    this.viewTrainingAugmentationsContainer.clear();
    this.viewValidationAugmentationsContainer.clear();
    this.viewTestAugmentationsContainer.clear();

    this.viewLearningRateContainer2.clear();
    this.viewEpochsContainer2.clear();
    this.viewBatchSizeContainer2.clear();
    this.viewInputWidthContainer2.clear();
    this.viewInputHeightContainer2.clear();
    this.viewLossFunctionContainer2.clear();
    this.viewMetricContainer2.clear();
    this.viewTrainingAugmentationsContainer2.clear();
    this.viewValidationAugmentationsContainer2.clear();
    this.viewTestAugmentationsContainer2.clear();
  }

  populateDynamicAllowedPropertiesList(entry, data) {
    if (entry.type == "FLT") {
      this.populatedPropertyAllowedValuesList = [];
      this.populatedPropertyDefaultValue;
      this.populatedPropertyAllowedValue = [];
      this.populatedPropertyDefaultValue = data[0].default_value;
      if (data[0].allowed_value != null || data[0].allowed_value != undefined) {
        this.populatedPropertyAllowedValuesList = data[0].allowed_value.split(",");
        this.populatedPropertyAllowedValuesList.forEach(value => {
          if (value != data[0].default_value) {
            this.populatedPropertyAllowedValue.push(value);
          }
        })
      }
      this._interactionService.dynamicPropertyList.push(new PropertyItem(InputFloatComponent, { id: data[0].id, name: entry.name, type: entry.type, default_value: this.populatedPropertyDefaultValue, allowed_value: this.populatedPropertyAllowedValue, modelId: data[0].model_id, datasetId: data[0].dataset_id, propertyId: data[0].property_id }))
    }
    else if (entry.type == "LST") {
      this.populatedPropertyAllowedValuesList = [];
      this.populatedPropertyDefaultValue = [];
      this.populatedPropertyAllowedValue = [];
      this.populatedPropertyAllowedValue.push(data[0].default_value);
      if (data[0].allowed_value != null || data[0].allowed_value != undefined) {
        this.populatedPropertyAllowedValuesList = data[0].allowed_value.split(",");
        this.populatedPropertyAllowedValuesList.forEach(value => {
          if (value != data[0].default_value) {
            this.populatedPropertyAllowedValue.push(value);
          }
        })
      }
      this.updateDropdownAllowedProperty(data);
      this._interactionService.dynamicPropertyList.push(new PropertyItem(DropdownComponent, { id: data[0].id, name: entry.name, type: entry.type, default_value: data[0].default_value, allowed_value: this.populatedPropertyAllowedValue, selectedOption: this.selectedOption, modelId: data[0].model_id, datasetId: data[0].dataset_id, propertyId: data[0].property_id }))
    }
    else if (entry.type == "INT") {
      this.populatedPropertyAllowedValuesList = [];
      this.populatedPropertyDefaultValue;
      this.populatedPropertyAllowedValue = [];
      this.populatedPropertyDefaultValue = data[0].default_value;
      if (data[0].allowed_value != null || data[0].allowed_value != undefined) {
        this.populatedPropertyAllowedValuesList = data[0].allowed_value.split(",");
        this.populatedPropertyAllowedValuesList.forEach(value => {
          if (value != data[0].default_value) {
            this.populatedPropertyAllowedValue.push(value);
          }
        })
      }
      this._interactionService.dynamicPropertyList.push(new PropertyItem(InputIntegerComponent, { id: data[0].id, name: entry.name, type: entry.type, default_value: this.populatedPropertyDefaultValue, allowed_value: this.populatedPropertyAllowedValue, modelId: data[0].model_id, datasetId: data[0].dataset_id, propertyId: data[0].property_id }))
    }
    else if (entry.type == "STR") {
      this.populatedPropertyAllowedValuesList = [];
      this.populatedPropertyDefaultValue;
      this.populatedPropertyAllowedValue = [];
      this.populatedPropertyDefaultValue = data[0].default_value;
      if (data[0].allowed_value != null || data[0].allowed_value != undefined) {
        this.populatedPropertyAllowedValuesList = data[0].allowed_value.split(",");
        this.populatedPropertyAllowedValuesList.forEach(value => {
          if (value != data[0].default_value) {
            this.populatedPropertyAllowedValue.push(value);
          }
        })
      }
      this._interactionService.dynamicPropertyList.push(new PropertyItem(InputTextComponent, { id: data[0].id, name: entry.name, type: entry.type, default_value: this.populatedPropertyDefaultValue, allowed_value: this.populatedPropertyAllowedValue, modelId: data[0].model_id, datasetId: data[0].dataset_id, propertyId: data[0].property_id }))
      //TODO: to be updated
      //if (entry.name == "Training augmentations") {
      //   if (data[0].allowed_value != null) {
      //     var result = data[0].allowed_value.match(/[+-]?\d+(\.\d+)?/g);
      //     this._interactionService.angleXValue = result[0];
      //     this._interactionService.angleYValue = result[1];
      //     this._interactionService.centerXValue = result[2];
      //     this._interactionService.centerYValue = result[3];
      //     this._interactionService.scaleValue = result[4];
      //     this._interactionService.interpDropdown.push("linear");
      //     this._interactionService.selectedOptionInterp = this._interactionService.interpDropdown[0];
      //   }
      // }
    }
  }

  populateDynamicPropertyList(entry, contentData) {
    if (entry.type == "FLT") {
      this._interactionService.dynamicPropertyList.push(new PropertyItem(InputFloatComponent, { id: contentData.id, name: contentData.name, type: contentData.type, default_value: contentData.default, allowed_value: contentData.values }))
    }
    else if (entry.type == "LST") {
      this.updateDropdownProperty(contentData);
      this._interactionService.dynamicPropertyList.push(new PropertyItem(DropdownComponent, { id: contentData.id, name: contentData.name, type: contentData.type, default_value: contentData.default, allowed_value: contentData.values, selectedOption: this.selectedOption }))
    }
    else if (entry.type == "INT") {
      this._interactionService.dynamicPropertyList.push(new PropertyItem(InputIntegerComponent, { id: contentData.id, name: contentData.name, type: contentData.type, default_value: contentData.default, allowed_value: contentData.values }))
    }
    else if (entry.type == "STR") {
      this._interactionService.dynamicPropertyList.push(new PropertyItem(InputTextComponent, { id: contentData.id, name: contentData.name, type: contentData.type, default_value: contentData.default, allowed_value: contentData.values }))
      //TODO: to be updated
      // if (entry.name == "Training augmentations") {
      //   if (contentData.default != null) {
      //     var result = contentData.default.match(/[+-]?\d+(\.\d+)?/g);
      //     this._interactionService.angleXValue = result[0];
      //     this._interactionService.angleYValue = result[1];
      //     this._interactionService.centerXValue = result[2];
      //     this._interactionService.centerYValue = result[3];
      //     this._interactionService.scaleValue = result[4];
      //   }
      // }
    }
  }

  populatePropertiesContainers() {
    this._interactionService.dynamicPropertyList.forEach(item => {
      if (item.propertyData.name == "Learning rate") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewLearningRateContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewLearningRateContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      } else if (item.propertyData.name == "Epochs") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewEpochsContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewEpochsContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      } else if (item.propertyData.name == "Batch size") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewBatchSizeContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewBatchSizeContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      } else if (item.propertyData.name == "Loss function") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewLossFunctionContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewLossFunctionContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      } else if (item.propertyData.name == "Metric") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewMetricContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewMetricContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      } else if (item.propertyData.name == "Input width") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewInputWidthContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewInputWidthContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      } else if (item.propertyData.name == "Input height") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewInputHeightContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewInputHeightContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      } else if (item.propertyData.name == "Training augmentations") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewTrainingAugmentationsContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewTrainingAugmentationsContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      } else if (item.propertyData.name == "Validation augmentations") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewValidationAugmentationsContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewValidationAugmentationsContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      } else if (item.propertyData.name == "Test augmentations") {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);

        const componentRef = this.viewTestAugmentationsContainer.createComponent<PropertyItem>(componentFactory);
        const componentRef2 = this.viewTestAugmentationsContainer2.createComponent<PropertyItem>(componentFactory);

        componentRef.instance.propertyData = item.propertyData;
        componentRef2.instance.propertyData = item.propertyData;
      }
    });
  }

  updateDropdownAllowedProperty(contentData) {
    var propertyValuesNameList = Array<string>();
    if (contentData[0].allowed_value != null) {
      propertyValuesNameList = contentData[0].allowed_value.split(",");
    } else {
      propertyValuesNameList = contentData[0].default_value;
    }
    contentData[0].allowed_value = [];
    contentData[0].allowed_value = propertyValuesNameList;
    this.selectedOption = propertyValuesNameList[0];
  }

  updateDropdownProperty(contentData) {
    var propertyValuesNameList = Array<string>();
    if (contentData.values != null) {
      propertyValuesNameList = contentData.values.split(",");
    } else {
      propertyValuesNameList = contentData.default;
    }
    contentData.values = [];
    contentData.values = propertyValuesNameList;
    this.selectedOption = propertyValuesNameList[0];
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
        this.initialisePropertiesContainers();
        this.showTrainButton = false;
      }, error => {
        this._interactionService.openSnackBarBadRequest("Error: " + error.error.Error);
      })
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
        this._interactionService.showWeightDetailsTable = false;
        this.displayWeightsListByModel(data);
      } else {
        dialogRef.close();
        this.displayWeightsListByModel(data);
        this._interactionService.showWeightDetailsTable = false;
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.errorMessageGetModelWeightList'));
      }
    })
  }

  displayWeightsListByModel(weightDataList) {
    this.weightsEditData = [];

    weightDataList.forEach(weightData => {
      this.weightDisplayMode = weightData.public;
      if (weightData.users.length == 0) {
        this.weightOwner = this.translate.instant('project.noWeightOwner');
      } else {
        weightData.users.forEach(user => {
          if (user.permission == "OWN") {
            this.weightOwner = user.username;
          }
        })
      }
      if (weightData.process_id == null || weightData.process_id == undefined) {
        this.weightProcessId = this.translate.instant('project.noWeightProcessId');
      } else {
        this.weightProcessId = weightData.process_id;
      }
      this.weightsEditData.push({
        weightId: weightData.id, weightName: weightData.name, weightDatasetId: weightData.dataset_id,
        weightOwner: this.weightOwner, weightPublic: this.weightDisplayMode, weightUsers: weightData.users,
        weightProcessId: this.weightProcessId
      });
    });
    this.weightsList = new MatTableDataSource(this.weightsEditData);
    this.weightsList.sort = this.modelWeightTableSort;
    this.weightsList.paginator = this.modelWeightPaginator;
  }

  cleanWeightsEditList() {
    this.selectedValueEditWeight = undefined;
    this.weightsEditData = [];
    this.weightsList = new MatTableDataSource(this.weightsEditData);

    let dummyArray = [];
    this.weightDetails = new MatTableDataSource(dummyArray);
    this._interactionService.showWeightDetailsTable = false;
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
    this._interactionService.showWeightDetailsTable = true;
    let weightDetailsArray = [];
    let dataset_name;
    let model_name;
    let public_weight;
    let pretrained_on;
    let associated_users = [];
    let nrAssociatedUsers = 0;
    let layers_to_remove;
    let classes;
    let is_active;
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
    if (contentData.is_active.toString() == "false") {
      is_active = this.translate.instant('project.innactiveWeight');
    } else {
      is_active = this.translate.instant('project.isWeightActive');
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

    if (contentData.layer_to_remove == null || contentData.layer_to_remove == undefined) {
      layers_to_remove = this.translate.instant('project.noPretrainedWeight');
    } else {
      layers_to_remove = contentData.layer_to_remove;
    }
    if (contentData.classes == null || contentData.classes == undefined) {
      classes = this.translate.instant('project.noClasses');
    } else {
      classes = contentData.classes;
    }
    weightDetailsArray.push(
      {
        weight_id: contentData.id,
        weight_name: contentData.name,
        dataset_name: dataset_name,
        model_name: model_name,
        pretrained_on: pretrained_on,
        public_weight: public_weight,
        associated_users: associated_users,
        layers_to_remove: layers_to_remove,
        classes: classes,
        is_active: is_active
      });
    this.weightIdForTitle = contentData.id;
    this.weightDetails = new MatTableDataSource(weightDetailsArray);
  }

  deleteWeight(weight) {
    let itemToDelete = new ItemToDelete();
    itemToDelete.type = TypeOfItemToDelete[3];
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
        this._interactionService.showWeightDetailsTable = false;
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

  showOutputProcess(process) {
    this.openOutputResultCustom();
    this.displayOutputResultsOuputsTable(process);
    //this.showProcessPropertiesTable(process);
  }

  onShowOutputsByWeight(outputResultsRow) {
    this.showOutputProcessFromWeights(outputResultsRow);
  }

  showOutputProcessFromWeights(process) {
    this.openOutputResultCustom();
    this.displayOutputResultsOuputsTable(process);
    //this.showProcessPropertiesTable(process);
  }

  openOutputResultCustom() {
    this.cleanWeightsEditList();

    this.showOutputRunning = false;
    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivModelAllowedProperties(false);
    this._interactionService.changeShowStateProjectDivOutputResults(true);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectCreateModelAllowedPropertiesIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(true);
  }

  displayOutputResultsOuputsTable(process) {
    let contentData;
    console.log(process);
    if (process.processId != null || process.processId != undefined) {
      this.checkProcessStatusForOutput(process);
    }
    else if (process.weightId != null || process.weightId != undefined) {
      this._dataService.pastTrainingProcesses(this._interactionService.currentProject.id, process.weightId).subscribe(data => {
        contentData = data;
        contentData.forEach(process => {
          if (process.celery_id != null || process.celery_id != undefined) {
            this.checkProcessStatusForOutputWeight(process);
          }
        })
      }, error => {
        this._interactionService.openSnackBarBadRequest("Error: " + error.error.Error);
      })
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
      if (outputsResults != undefined) {
        outputsResults.forEach(output => {
          JSON.parse(output[1]).forEach(element => {
            outputDetail = element;
          });
          this.outputResultsData.push({ outputImage: output[0].replace("['", "").replace("']", ""), outputDetails: outputDetail });
        });
      } else {
        dialogRef.close();
      }

      this.outputList = new MatTableDataSource(this.outputResultsData);
      this.outputList.sort = this.outputTableSort;
      this.outputList.paginator = this.outputPaginator;
      dialogRef.close();
      this._interactionService.openSnackBarOkRequest(this.translate.instant('output-details-dialog.outputStatusOk'));
    }, error => {
      dialogRef.close();
      this._interactionService.openSnackBarBadRequest(this.translate.instant('output-details-dialog.outputStatusError'));
    })
  }

  checkProcessStatusForOutput(process) {
    if (process.processStatus == "SUCCESS") {
      if (process.processType == "training") {
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
    else if (process.processStatus == "STARTED") {
      if (process.processType == "training") {
        this.showGraphicProcess = true;
        this.showProgressBarProcess = false;
      }
      else if (process.processType == "inference") {
        this.showProgressBarProcess = true;
        this.showGraphicProcess = false;
      } else {
        this.showProgressBarProcess = true;
        this.showGraphicProcess = false;
      }
      this.showOutputResultsProcess(process);
    }
  }

  checkProcessStatusForOutputWeight(process) {
    this.showGraphicProcess = true;
    this.showProgressBarProcess = false;
    this.showOutputResultsProcess(process);
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

  showOutputResultsProcess(process) {
    this.fullStatusProcess = true;
    this.showOutputRunning = false;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    if (process.celery_id != null || process.celery_id != undefined) {
      this._dataService.statusCompleteForEvolution(process.celery_id, this.fullStatusProcess).subscribe(data => {
        dialogRef.close();
        this.outputResultsDetailProcessId = process.celery_id;
        this.showGraphicData(data);
        this.showOutputRunning = true;
        this.showOutputInferenceSingle = false;
        this._interactionService.openSnackBarOkRequest(this.translate.instant('output-details-dialog.outputStatusOk'));
        this._interactionService.changeStopButton(process);
      }, error => {
        dialogRef.close();
        this.showOutputRunning = false;
        this.showOutputInferenceSingle = false;
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.outputStatusError'));
      });
    } else {
      this._dataService.statusCompleteForEvolution(process.processId, this.fullStatusProcess).subscribe(data => {
        dialogRef.close();
        this.outputResultsDetailProcessId = process.processId;
        this.showGraphicData(data);
        if (process.process_type == "training" && this.metricChartObject == null) {
          this.showOutputRunning = false;
          this.showOutputInferenceSingle = false;
          this._interactionService.openSnackBarBadRequest(this.translate.instant('output-details-dialog.outputPendingStatus'));
        } else {
          this.showOutputRunning = true;
          this.showOutputInferenceSingle = false;
          this._interactionService.openSnackBarOkRequest(this.translate.instant('output-details-dialog.outputStatusOk'));
        }
        this._interactionService.changeStopButton(process);
      }, error => {
        dialogRef.close();
        this.showOutputRunning = false;
        this.showOutputInferenceSingle = false;
        this._interactionService.openSnackBarBadRequest(this.translate.instant('project.outputStatusError'));
      });
    }
  }

  showProcessPropertiesTable(process) {
    let propertyId;
    this._dataService.trainingSettings(process.processId, propertyId).subscribe(data => {
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
    this.metricChartObject = null;
    let outputEpoch;
    let currentBatch;
    let totalBatch;
    let varCrossEntropy = "categorical_cross_entropy=";
    let varCategoricalAccuracy = " - categorical_accuracy=";
    let outputLoss;
    let outputMetric;
    let varTraining = "Train";
    let varInference = "Inference";
    let varOutputInference;
    let lossChartObject;
    let chartLossValuesList = [
      {
        "name": "Evolution of the process",
        "series": []
      }
    ];
    let chartMetricValuesList = [
      {
        "name": "Evolution of the process",
        "series": []
      }
    ];

    if (outputsResults.length == 0) {
      this._interactionService.openSnackBarBadRequest(this.translate.instant('project.outputResultsError'));
    } else {
      outputsResults.forEach(output => {
        if (output.indexOf(varTraining) == 0) {
          currentBatch = output.match(/.*[[](\d+).*/)[1];
          totalBatch = output.match(/.*[/](\d+).*/)[1];
          if (currentBatch == totalBatch) {
            outputEpoch = output.match(/[\d\.]+/g)[0];
            outputLoss = output.match(/[\d\.]+/g)[4];
            outputMetric = output.match(/[\d\.]+/g)[5];

            lossChartObject = { name: outputEpoch, value: parseFloat(outputLoss) };
            chartLossValuesList[0].series.push(lossChartObject);
            Object.assign(this, { chartLossValuesList });

            this.metricChartObject = { name: outputEpoch, value: parseFloat(outputMetric) };
            chartMetricValuesList[0].series.push(this.metricChartObject);
            Object.assign(this, { chartMetricValuesList });
          }
        }
        else if (output.indexOf(varInference) == 0) {
          currentBatch = output.match(/.*[[](\d+).*/)[1];
          totalBatch = output.match(/.*[/](\d+).*/)[1];
          varOutputInference = ((parseFloat(currentBatch)) * 100 / parseFloat(totalBatch));
          this.outputInference = varOutputInference.toFixed(2);
        }
      });
    }
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
    itemToDelete.type = TypeOfItemToDelete[4];
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
    itemToDelete.type = TypeOfItemToDelete[0];
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

  applyProcessFilter(filterValue: string) {
    this._interactionService.processesList.filter = filterValue.trim().toLowerCase();
  }
}
