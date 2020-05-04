import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { DataService } from 'src/app/services/data.service';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmDialogTrainComponent } from '../confirm-dialog-train/confirm-dialog-train.component';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PropertyInstance, Project, Model } from 'src/app/components/power-user/power-user.component';

export class Task {
  id: number;
  name: string;
  checked: boolean;
}

export class ProcessingObject {
  processId;
  process_type;
  process_status: ProcessStatus;
  process_data: Array<ProcessData>;
  unread: boolean;
  color;
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

enum ProcessStatus {
  none,
  running,
  finished,
  error
}

export class DropdownResponse {
  name;
  id;
  default_value;
  allowed_value;
  type;
}

export class DatasetUpload {
  id;
  name;
  task_id;
  path;
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
  userScreenIsClicked = false;
  networkStatisticsIsClicked = false;
  notificationsIsClicked = false;

  //divs show status
  divMiddleShowStatus = true;
  divLeftShowStatus = true;
  divUserScreenShowStatus = false;
  divNetworkStatisticsShowStatus = false;
  divDetailsLeftSideShowStatus = false;
  divNotificationsShowStatus = false;

  //image input
  disabledProcessImageButton = false;

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
  selectedUrl = null;

  //slide toggle
  reTrainState = false;

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

  trainProcessStarted = false;
  inferenceProcessStarted = false;
  disabledTrainButton = false;
  disabledInferenceButton = false;
  showInference = false;
  trainSpinner = false;
  showTrainButton = true;
  showStopButton = false;
  disabledStopButton = false;
  process_type: string;
  trainMessage: string = null;
  inferenceMessage: string = null;
  runningProcesses: ProcessingObject[] = [];
  modelsResponseData: Array<Model>;
  currentProject: Project;

  selectedTask = null;


  constructor(public _interactionService: InteractionService, private _dataService: DataService, public dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private translate: TranslateService,
    private snackBar: MatSnackBar) {
    this.matIconRegistry.addSvgIcon(
      'search',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-search-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'markUnread',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-markunread-24px.svg')
    );
  }

  @ViewChild('loss') loss: ElementRef;
  @ViewChild('learningRate') learningRate: ElementRef;
  @ViewChild('useDropout') useDropout: ElementRef;
  @ViewChild('inference') inference: ElementRef;
  @ViewChild('dataAugmentationSection') dataAugmentationSection: ElementRef;
  @ViewChild('epochs') epochs: ElementRef;
  @ViewChild('batchSize') batchSize: ElementRef;
  @ViewChild('optimizer') optimizer: ElementRef;
  @ViewChild('inputHeight') inputHeight: ElementRef;
  @ViewChild('inputWidth') inputWidth: ElementRef;
  @ViewChild('trainingAugmentations') trainingAugmentations: ElementRef;
  @ViewChild('validationAugmentations') validationAugmentations: ElementRef;
  @ViewChild('testAugmentations') testAugmentations: ElementRef;

  ngOnInit() {
    this.initialiseShowStatusProjectDivs();
    this.initialiseDivRightClickedButtons();
    this.initialiseTasks();
    this.getTasks();

    this.initialiseCurrentProject();

    this.initialiseInputTypes();
    this.initialiseImageInput();
    this.initialiseDropdowns();
    this.initialiseProperties()
    this.initiliaseSelectedOptions();
    this.initialiseReTrainSection();
    this.initialiseSelectedModel();
    this.initialiseSelectedDataset();
    this.initialiseInferenceButton();
    this.initialiseTrainButton();
    this.initialiseStopButton();
    this.fillDropdowns();
  }


  initialiseCurrentProject() {
    this._interactionService.currentProject$.subscribe(
      project => {
        this.currentProject = project;
        // this.tasks.forEach(task => {
        //   if(task.id == this.currentProject.task_id){
        //     task.checked = true;
        //   }
        // })
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

  initialiseReTrainSection() {
    this._interactionService.reTrainButtonCheckedState$.subscribe(
      state => {
        if (state == false) {
          if (this.trainProcessStarted == true) {
            this.showTrainButton = true;
            console.log("stop");
            this.trainProcessStarted = false;
          }
        }
        this.reTrainState = state;
      }
    );
    this.dataAugmentationSection.nativeElement.style.display = "none";
    this.inference.nativeElement.style.display = "true";
    this.loss.nativeElement.style.display = "none";
    this.learningRate.nativeElement.style.display = "none";
    this.epochs.nativeElement.style.display = "none";
    this.batchSize.nativeElement.style.display = "none";
    this.inputHeight.nativeElement.style.display = "none";
    this.inputWidth.nativeElement.style.display = "none";
    this.useDropout.nativeElement.style.display = "none";

    this.dataAugmentation.forEach(item => item.selected = false);

    this.trainingAugmentations.nativeElement.style.display = "none";
    this.validationAugmentations.nativeElement.style.display = "none";
    this.testAugmentations.nativeElement.style.display = "block";
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

    this._interactionService.projectDisabledProcessImage$.subscribe(
      state => {
        this.disabledProcessImageButton = state;
      }
    )
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

    this._interactionService.projectDivUserScreenShowStatus$.subscribe(
      state => {
        this.divUserScreenShowStatus = state;
      }
    );

    this._interactionService.projectDivNotificationsShowStatus$.subscribe(
      state => {
        this.divNotificationsShowStatus = state;
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
  }

  initialiseTasks() {
    this._interactionService.checkedTask$.subscribe(
      id => {
        this.selectedTask = id;
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
        this.checkedStateTextInputType = state;
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

    this._interactionService.projectUserScreenIsClicked$.subscribe(
      state => {
        this.userScreenIsClicked = state;
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
  }

  resetSelectedOptions() {
    this._interactionService.resetSelectedOptions();
  }

  changeCheckedInputType(checkedButton: any) {
    switch (checkedButton) {
      case "Video":
        this.checkedStateVideoInputType = true;
        break;
      case "Image":
        this.checkedStateImageInputType = true;
        break;
      case "3D":
        this.checkedState3DInputType = true;
        break;
      case "Text":
        this.checkedStateTextInputType = true;
        break;
    }
  }


  browseImage(event: any) {
    this._interactionService.projectInputFiles = event.target.files;
    this.fileTempLocation = event.target.value;
    if (this._interactionService.projectInputFiles.length === 0)
      return;

    var reader = new FileReader();
    this._interactionService.projectImagePathSource = this._interactionService.projectInputFiles;
    reader.readAsDataURL(this._interactionService.projectInputFiles[0]);
    reader.onload = () => {
      this._interactionService.projectImageURLSource = reader.result;
    }
    this.disabledProcessImageButton = true;
    event.srcElement.value = null;
  }

  processImage() {
    this._dataService.processImage(this.fileTempLocation).subscribe(data => {
      // TODO: de afisat continutul obiectului json primit
      console.log(data.body);
    });
  }

  uploadDataset() {
    let taskId;
    let datasetName;
    let datasetPath;
    let datasetList = this._interactionService.getDatasetResponseData();
    datasetList.forEach(dataset => {
      datasetName = dataset.name;
    })
    this.tasks.forEach(task => {
        taskId = task.id;
    })
    datasetPath = "https://www.dropbox.com/s/ul1yc8owj0hxpu6/" + datasetName + ".yml?dl=1";
    this._dataService.uploadDataset(datasetName, taskId, datasetPath).subscribe(data => {
      console.log(data.body);
    })
  }

  resetDropDownDetails() {
    this.modelDropdown = [];
    this.weightDropdown = [];
    this.datasetDropdown = [];
    this.metricDropdown = [];
    this.lossDropdown = [];
  }

  showImageInput() {
    this._interactionService.changeShowStateProjectDivDetailsLeftSide(true);
  }

  hideImageInput() {
    this._interactionService.changeShowStateProjectDivDetailsLeftSide(false);
  }

  openUserScreen() {
    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivUserScreen(true);
    this._interactionService.changeShowStateProjectDivNotifications(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectUserScreenIsClicked(true);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
  }

  openConfiguration() {
    this._interactionService.changeShowStateProjectDivLeft(true);
    this._interactionService.changeShowStateProjectDivMiddle(true);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivUserScreen(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(true);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectUserScreenIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
  }

  openNetworkStatistics() {
    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivNetwork(true);
    this._interactionService.changeShowStateProjectDivUserScreen(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(true);
    this._interactionService.changeStateProjectUserScreenIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
  }

  openNotifications() {
    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivUserScreen(false);
    this._interactionService.changeShowStateProjectDivNotifications(true);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectUserScreenIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(true);
  }

  showUseDropout() {
    if (this.reTrainState == true) {
      this.useDropout.nativeElement.style.display = "block";
    }
    else {
      this.useDropout.nativeElement.style.display = "none";
    }
  }

  showInferenceButton() {
    if (this.reTrainState == true) {
      this.inference.nativeElement.style.display = "none";
    }
    else {
      this.inference.nativeElement.style.display = "block";
    }
  }

  changeUseDropoutCheckedState() {
    this.useDropoutCheckedState = !this.useDropoutCheckedState;
  }

  changeLearningRateValue(event) {
    this.learningRateValue = event.target.value;
  }

  changeStateReTrainToggle() {
    if (this.reTrainState == true) {
      //this.disabledInferenceButton = false;
      this.inference.nativeElement.style.display = "block";
      this._interactionService.changeCheckedStateReTrainButton(false);
      this.dataAugmentation.forEach(item => item.selected = false);
      this.dataAugmentationSection.nativeElement.style.display = "none";
      this.learningRate.nativeElement.style.display = "none";
      this.loss.nativeElement.style.display = "none";
      this.epochs.nativeElement.style.display = "none";
      this.batchSize.nativeElement.style.display = "none";
      this.useDropout.nativeElement.style.display = "none";
      this.inputHeight.nativeElement.style.display = "none";
      this.inputWidth.nativeElement.style.display = "none";

      this.trainingAugmentations.nativeElement.style.display = "none";
      this.validationAugmentations.nativeElement.style.display = "none";
      this.testAugmentations.nativeElement.style.display = "block";
    }
    else {

      //this.disabledInferenceButton = true;
      this.inference.nativeElement.style.display = "none";
      this._interactionService.changeCheckedStateReTrainButton(true);
      this.dataAugmentation.forEach(item => item.selected = false);
      this.dataAugmentationSection.nativeElement.style.display = "block";
      this.learningRate.nativeElement.style.display = "block";
      this.loss.nativeElement.style.display = "block";
      this.batchSize.nativeElement.style.display = "block";
      this.epochs.nativeElement.style.display = "block";
      this.useDropout.nativeElement.style.display = "block";
      this.inputHeight.nativeElement.style.display = "block";
      this.inputWidth.nativeElement.style.display = "block";

      this.trainingAugmentations.nativeElement.style.display = "block";
      this.validationAugmentations.nativeElement.style.display = "block";
      this.testAugmentations.nativeElement.style.display = "none";
    }
  }

  //train & inference functions
  trainModel() {
    this.process_type = "training";
    this.disabledStopButton = false;
    this.trainProcessStarted = true;
    this.trainSpinner = false;

    let selectedProperties: PropertyInstance[] = [];
    let learning = new PropertyInstance;
    learning.name = "Learning rate";
    learning.value = this.learningRateValue;
    if (learning.value >= 0) {
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
        if (result && this.trainProcessStarted == true) {
          this._dataService.trainModel(selectedDatasetId, selectedModelId, selectedWeightId, selectedProperties, this.currentProject.id).subscribe(data => {
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
            process.processId = data.body.process_id;
            process.process_status =ProcessStatus.running;
            process.process_type = this.process_type;
            process.unread = true;
            this.runningProcesses.push(process);
            this.checkStatusTrain(process);
          })
        }
      });
    }
    else {
      this.openSnackBar(this.translate.instant('project.errorStartedTrainProcessMessage'));
      this.trainProcessStarted = false;
      this.trainSpinner = false;
      this.showTrainButton = true;
      //this.showStopButton = false;
      console.log('Canceled');
    }
  }

  inferenceModel() {
    this.process_type = "inference";
    this.disabledStopButton = false;
    this.inferenceProcessStarted = true;

    let selectedModelWeightsId;
    if (this.selectedOptionModel) {
      let modelList = this._interactionService.getModelsByTaskArray();
      modelList.forEach(model => {
        if (model.name == this.selectedOptionModel) {
          selectedModelWeightsId = model.id;
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
        this._dataService.inferenceModel(selectedModelWeightsId, selectedDatasetId, this.currentProject.id).subscribe(data => {
          if (data.body.result == "ok") {
            this.disabledInferenceButton = true;
          }
          this.openSnackBar(this.translate.instant('project.startedInferenceProcessMessage'));
          let process = new ProcessingObject;
          this.inferenceProcessStarted = true;
          this.showStopButton = true;
          process.processId = data.body.process_id;
          process.process_status = ProcessStatus.running;
          process.process_type = this.process_type;
          process.unread = true;
          this.runningProcesses.push(process);
          this.checkStatusInference(process);
          this.getOutputResultsOfInference(process);
        })
      }
      else {
        this.inferenceProcessStarted = false;
        console.log('Canceled');
      }
    });
  }

  // inferenceSingle() {
  //   this.process_type = "inference";

  //   this.inferenceProcessStarted = true;

  //   let selectedModelWeightsId;
  //   if (this.selectedOptionModel) {
  //     let modelList = this._interactionService.getModelsByTaskArray();
  //     modelList.forEach(model => {
  //       if (model.name == this.selectedOptionModel) {
  //         selectedModelWeightsId = model.id;
  //       }
  //     });
  //   }

    // let selectedImageUrl;
    // let imageUrlList = this._interactionService.getDatasetResponseData();
    // if (this.selectedUrl) {
    //   imageUrlList.forEach(dataset => {
    //     if (dataset.path == this.selectedUrl) {
    //       selectedImageUrl = dataset.path;
    //     }
    //   })
    // }
    // else {
    //   selectedImageUrl = undefined;
    // }

  //   let selectedImageUrl = "https://url/my-image.png";

  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.data = {
  //     dialogTitle: this.translate.instant('project.inference'),
  //     dialogContent: this.translate.instant('project.areYouSureInference'),
  //     trainingTime: this.translate.instant('project.estimatedTimePreTrain'),
  //     modelSelected: this.selectedOptionModel,
  //     datasetSelected: this.selectedOptionDataset,
  //     process_type: this.process_type
  //   }

  //   let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     console.log(result);
  //     if (result && this.selectedOptionModel != null && this.selectedOptionDataset != null) {
  //       this._dataService.inferenceSingle(selectedModelWeightsId, selectedImageUrl, this.currentProject.id).subscribe(data => {
  //         if (data.body.result == "ok") {
  //           this.disabledInferenceButton = true;
  //         }
  //         this.openSnackBar(this.translate.instant('project.startedInferenceProcessMessage'));
  //         let process = new ProcessingObject;
  //         this.inferenceProcessStarted = true;
  //         this.showStopButton = true;
  //         process.processId = data.body.process_id;
  //         process.process_status = ProcessStatus.running;
  //         process.process_type = this.process_type;
  //         process.unread = true;
  //         this.runningProcesses.push(process);
  //         this.checkStatusInference(process);
  //         this.getOutputResultsOfInference(process);
  //       })
  //     }
  //     else {
  //       this.inferenceProcessStarted = false;
  //       console.log('Canceled');
  //     }
  //   });
  // }

  checkStatusTrain(process) {
    console.log(process);
    this._dataService.status(process.processId).subscribe(data => {
      let status: any = data.status;
      process.process_type = status.process_type;
      process.process_status = status.process_status;
      if (process.process_status == "running") {
        console.log(process.process_status);
        setTimeout(() => {
          this.checkStatusTrain(process)
        }, 10 * 1000);
      }
      if (process.process_status == "finished") {
        this.openSnackBar(this.translate.instant('project.finishedTrainProcessMessage'));
        this.trainProcessStarted = false;
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
      process.process_data = status.process_data;
      process.process_type = status.process_type;
      process.process_status = status.process_status;

      if (process.process_status == "running") {
        console.log(process.process_status);
        setTimeout(() => {
          this.checkStatusInference(process)
        }, 10 * 1000);
      }
      if (process.process_status == "finished") {
        this.openSnackBar(this.translate.instant('project.finishedInferenceProcessMessage'));
        this.inferenceProcessStarted = false;
        this.trainSpinner = false;
        this._interactionService.increaseNotificationsNumber();
      }
      this.inferenceMessage = "The process of the type " + process.process_type + ", with the id " + process.processId + ", has the status: " + process.process_status;
    })
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
      // this._dataService.getModels(this.selectedTaskId).subscribe(data => {
      //   this.updateModelsList(data)
      // });
      this._interactionService.initialiseModelDropdown(this.selectedTaskId);
      this.weightDropdown = [];

      console.log("task id: " + this.selectedTaskId);
      console.log("the checked task: " + checkedButton.name);

      // this.tasks.forEach(task => {
      //   if (task.name == checkedButton.name || this.currentProject.task_id == checkedButton.id) {
      //     task.checked = true;
      //   }
      //   else {
      //     task.checked = false;
      //   }
      // })

      // let newSelectors = [];
      // newSelectors.push("model");
      // newSelectors.push("dataset");
      // this.fillDropdowns(newSelectors, this.currentProject.id);
    }
  }

  //weights functions
  getWeights(modelName: string) {
    let modelId;
    let modelList = this._interactionService.getModelsByTaskArray();
    modelList.forEach(model => {
      if (model.name == modelName) {
        modelId = model.id;
      }
    });
    this._dataService.getWeights(modelId).subscribe(data => {
      // update weight selector
      this.updateWeightsList(data);
    })

    //this._dataService.getDropDownDetails(this.currentProject.id, "model").subscribe(data => {
    // this.updatemodelsResponseData(data.body);
    // console.log(data.body);
    // data.body.forEach(element => {
    // if (element.name == modelName) {
    //  modelId = element.id;
    //}
    // });
    //})
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

  //old stop function
  // stopModel() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.data = {
  //     dialogTitle: this.translate.instant('project.stopTraining'),
  //     dialogContent: this.translate.instant('project.areYouSureStop'),
  //     trainingTime: ""
  //   }

  //   let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     console.log(result);
  //     if (result) {
  //       this.showTrainButton = true;
  //       this.showStopButton = false;
  //       this.trainSpinner = false;
  //       console.log("stop");
  //       this.trainProcessStarted = false;
  //     }
  //     else {
  //       console.log('Canceled');
  //     }
  //   });
  // }
  
  stopProcess(processId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('project.stopTraining'),
      dialogContent: this.translate.instant('project.areYouSureStop'),
      trainingTime: ""
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        this._dataService.stopProcess(processId).subscribe(data => {
          if (data.statusText == "OK") {
            this.openSnackBar(this.translate.instant('project.stoppedProcessMessage'));
            // let process = new ProcessingObject;
            // let status: any = data.status;
            // process.process_status = data.body.process_status;
            // if(data.body.process_status == "finished") {
            //   this.disabledStopButton = true;
            // }
            this.trainProcessStarted = false;
            this.disabledStopButton = true;
            this.inferenceProcessStarted = false;
            this._interactionService.changeCheckedStateStopButton(true);
          }
        });
      }
      else {
        console.log('Canceled');
      }
    });
  }

  //notification functions
  markNotificationAsRead(process) {
    if (process.unread == true) {
      process.unread = false;
      this._interactionService.decreaseNotificationsNumber();
    }
  }

  openSnackBar(message) {
    this.snackBar.open(message, "close", {
      duration: 3500,
    });
  }

  //dropdown functions
  fillDropdowns() {
    // if (this.currentProject)
    //   selectorList.forEach(selector => {
    //     this._dataService.getDropDownDetails(this.currentProject.id, selector).subscribe(data => {
    //       console.log(data);
    //       if (data.body != undefined || data != undefined) {
    //         this.populateSelector(selector, data);
    //       }
    //     })
    //   });
    // else {
    //   selectorList.forEach(selector => {
    //     this._dataService.getDropDownDetails(currentProjectId, selector).subscribe(data => {
    //       console.log(data);
    //       if (data.body != undefined || data != undefined) {
    //         this.populateSelector(selector, data.body);
    //       }
    //     })
    //   });
    // }
  }

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
    this._dataService.updateProject(this.currentProject.name, this.currentProject.id,
      this.currentProject.modelweights_id, taskId).subscribe(data => {
        this._interactionService.resetProjectsList(data.body);
        console.log(data.body);
      })
  }

  triggerSelectedModel(event) {
    this.weightDropdown = [];
    var selectedModel = event.value;
    this.getWeights(selectedModel);
    this.getAllowedProperties(selectedModel);
  }

}
