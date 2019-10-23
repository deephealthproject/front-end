import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { DataService } from 'src/app/services/data.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmDialogTrainComponent } from '../confirm-dialog-train/confirm-dialog-train.component';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PropertyInstance } from 'src/app/components/power-user/power-user.component';

export class ProcessingObject {
  processId;
  process_type;
  process_status: ProcessStatus;
}

enum ProcessStatus {
  none,
  running,
  finished,
  error
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

  //divs show status
  divMiddleShowStatus = true;
  divLeftShowStatus = true;
  divUserScreenShowStatus = false;
  divNetworkStatisticsShowStatus = false;
  divDetailsLeftSideShowStatus = false;

  //image input
  disabledProcessImageButton = false;

  //Task radio buttons
  checkedStateClassificationTask = false;
  checkedStateSegmentationTask = false;
  checkedStateGenerativeTask = false;
  checkedStateDetectionTask = false;

  //Input Type radio buttons
  checkedStateImageInputType = false;
  checkedStateTextInputType = false;
  checkedState3DInputType = false;
  checkedStateVideoInputType = false;

  public message: string;

  //selectors option list
  selectors: Array<string> = ["Model", "Pre-Training", "Fine-Tuning", "Input-Size", "Loss"];
  modelDropdown;
  preTrainingDropdown;
  fineTuningDropdown;
  inputSizeDropdown;
  lossDropdown;

  //selectors currently selected option
  selectedOptionModel = null;
  selectedOptionPreTraining = null;
  selectedOptionFineTuning = null;
  selectedOptionLoss = null;
  selectedOptionInputSize = null;

  //slide toggle
  reTrainState = false;

  //properties
  useDropoutCheckedState;
  learningRateValue;
  checked;

  //data augmentation
  flippingCheckedState;
  rotationCheckedState;
  colorJitterCheckedState;
  gaussianNoiseCheckedState;
  croppingCheckedState;
  scalingCheckedState;
  shiftingCheckedState;
  shearingCheckedState;

  dropDownDetailsResponseData = undefined;
  datasetsResponseData = undefined;

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
  selectedDataset;
  selectedWeight;

  trainProcessId;
  inferenceProcessId;

  searchIcon = "search";
  trainProcessStarted = false;
  disabledTrainButton = false;
  disabledInferenceButton = false;
  trainSpinner = false;
  //showTrainButton = true;
  //showStopButton = false;

  constructor(public _interactionService: InteractionService, private _dataService: DataService, public dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private translate: TranslateService) {
    this.matIconRegistry.addSvgIcon(
      'search',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-search-24px.svg')
    );
  }

  @ViewChild('loss') loss: ElementRef;
  @ViewChild('learningRate') learningRate: ElementRef;
  @ViewChild('useDropout') useDropout: ElementRef;
  @ViewChild('dataAugmentationSection') dataAugmentationSection: ElementRef;

  ngOnInit() {
    this.initialiseShowStatusProjectDivs();
    this.initialiseDivRightClickedButtons();

    this.initialiseTasks();
    this.initialiseInputTypes();
    this.initialiseImageInput();
    this.initialiseDropdowns();
    this.initiliaseSelectedOptions();
    this.initialiseReTrainSection();
    this.initialiseSelectedModel();
    this.initialiseSelectedDataset();
    this.initialiseFineTuning();
    this.initialiseInferenceButton();
    this.getProperties();
  }

  initialiseInferenceButton() {
    this._interactionService.inferenceButtonState$.subscribe(
      state => {
        this.disabledInferenceButton = state;
      }
    );
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
        this.reTrainState = state;
      }
    );
    this.dataAugmentationSection.nativeElement.style.display = "none";

    this.dataAugmentation.forEach(item => item.selected = false);
  }

  initialiseDropdowns() {
    this._interactionService.dropdownModel$.subscribe(
      state => {
        this.modelDropdown = state;
      }
    );

    this._interactionService.dropdownFineTuning$.subscribe(
      state => {
        this.fineTuningDropdown = state;
      }
    );

    // this._interactionService.dropdownInputSize$.subscribe(
    //   state => {
    //     this.inputSizeDropdown = state;
    //   }
    // );

    this._interactionService.dropdownPreTraining$.subscribe(
      state => {
        this.preTrainingDropdown = state;
      }
    );
  }

  initialiseFineTuning() {
    this._dataService.getDatasets().subscribe(data => {
      if (data.body != undefined || data != undefined) {
        this.populateFineTuning(data);
      }
    })
  }

  populateFineTuning(contentData) {
    var datasetsValuesNameList = [];
    this.datasetsResponseData = contentData;

    contentData.forEach(dataset => {
      datasetsValuesNameList.push(dataset.name);
    });
    this.fineTuningDropdown = datasetsValuesNameList;
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
  }

  initiliaseSelectedOptions() {
    this._interactionService.selectedOptionModel$.subscribe(
      state => {
        this.selectedOptionModel = state;
      }
    );

    this._interactionService.selectedOptionFineTuning$.subscribe(
      state => {
        this.selectedOptionFineTuning = state;
      }
    );

    this._interactionService.selectedOptionInputSize$.subscribe(
      state => {
        this.selectedOptionInputSize = state;
      }
    );

    this._interactionService.selectedOptionLoss$.subscribe(
      state => {
        this.selectedOptionLoss = state;
      }
    );

    this._interactionService.selectedOptionPreTraining$.subscribe(
      state => {
        this.selectedOptionPreTraining = state;
      }
    );
  }

  initialiseTasks() {
    this._interactionService.checkedStateClassification$.subscribe(
      state => {
        this.checkedStateClassificationTask = state;
      }
    );

    this._interactionService.checkedStateDetection$.subscribe(
      state => {
        this.checkedStateDetectionTask = state;
      }
    );

    this._interactionService.checkedStateGenerative$.subscribe(
      state => {
        this.checkedStateGenerativeTask = state;
      }
    );

    this._interactionService.checkedStateSegmentation$.subscribe(
      state => {
        this.checkedStateSegmentationTask = state;
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

  changeCheckedTask(checkedButton: any) {
    switch (checkedButton) {
      case "Segmentation":
        this.checkedStateSegmentationTask = true;
        break;
      case "Classification":
        this.checkedStateClassificationTask = true;
        break;
      case "Detection":
        this.checkedStateDetectionTask = true;
        break;
      case "Generative":
        this.checkedStateGenerativeTask = true;
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

  selectTask(selectedTask: string) {
    this.resetDropDownDetails();
    this._dataService.getDropDownDetails(selectedTask).subscribe(data => {
      if (data.body != undefined || data != undefined) {
        this.populateDropDownDetails(data);
        console.log(data);
      }
    })
  }

  populateDropDownDetails(contentData: any) {
    console.log(contentData);
    this.dropDownDetailsResponseData = contentData;
    this.modelDropdown = [];
    contentData.models.forEach(model => {
      this.modelDropdown.push(model.name);
    });
  }

  triggerSelectedModel(event) {
    this.preTrainingDropdown = [];
    var selectedAlgorithm = event.value;
    this.dropDownDetailsResponseData.models.forEach(model => {
      if (model.name == selectedAlgorithm) {
        this.selectedModel = model;
        model.pretraining.forEach(pretraining => {
          this.preTrainingDropdown.push(pretraining.name);
        });
      }

    });
  }

  triggerSelectedPreTraining(event) {
    var selectedPreTraining = event.value;
    this.dropDownDetailsResponseData.models.forEach(model => {
      model.pretraining.forEach(pretraining => {
        if (pretraining.name == selectedPreTraining) {
          this.selectedWeight = pretraining;
          console.log(this.selectedWeight.id);
          pretraining.properties.forEach(property => {
            switch (property.name) {
              case "Learning rate":
                this.learningRateValue = property.value;
                break;
              case "Loss function":
                this.selectedOptionLoss = property.value;
                break;
              case "Use dropout":
                this.useDropoutCheckedState = property.value;
                this.changeUseDropoutCheckedState(property.value);
                break;
            }
          })
        }
      });
    });
  }

  triggerSelectedFineTuning(event) {
    var selectedFineTuning = event.value;
    this.datasetsResponseData.forEach(dataset => {
      if (dataset.name == selectedFineTuning) {
        this.selectedDataset = dataset;
      }
    });
  }

  resetDropDownDetails() {
    this.modelDropdown = [];
    this.preTrainingDropdown = [];
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

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectUserScreenIsClicked(true);
  }

  openConfiguration() {
    this._interactionService.changeShowStateProjectDivLeft(true);
    this._interactionService.changeShowStateProjectDivMiddle(true);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivUserScreen(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(true);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectUserScreenIsClicked(false);
  }

  openNetworkStatistics() {
    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivNetwork(true);
    this._interactionService.changeShowStateProjectDivUserScreen(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(true);
    this._interactionService.changeStateProjectUserScreenIsClicked(false);
  }

  showUseDropout() {
    if (this.reTrainState == true) {
      this.useDropout.nativeElement.style.display = "block";
    }
    else {
      this.useDropout.nativeElement.style.display = "none";
    }
  }

  changeUseDropoutCheckedState(checked) {
    this.useDropoutCheckedState = checked;
  }

  changeLearningRateValue(event) {
    this.learningRateValue = event.target.value;
  }

  changeStateReTrainToggle() {
    if (this.reTrainState == true) {
      this.disabledInferenceButton = false;
      this._interactionService.changeCheckedStateReTrainButton(false);
      this.dataAugmentation.forEach(item => item.selected = false);
      this.dataAugmentationSection.nativeElement.style.display = "none";
      this.learningRate.nativeElement.style.display = "none";
      this.loss.nativeElement.style.display = "none";
      this.useDropout.nativeElement.style.display = "none";
    }
    else {
      this.disabledInferenceButton = true;
      this._interactionService.changeCheckedStateReTrainButton(true);
      this.dataAugmentation.forEach(item => item.selected = false);
      this.dataAugmentationSection.nativeElement.style.display = "block";
      this.learningRate.nativeElement.style.display = "block";
      this.loss.nativeElement.style.display = "block";
      this.useDropout.nativeElement.style.display = "block";
    }
  }

  searchProperty(data) {
    for (let entry of data) {
      switch (entry.name) {
        case this.translate.instant('project.learningRate'):
          this.learningRate.nativeElement.style.display = "none";
          this.learningRateValue = entry.default;
        case this.translate.instant('project.loss'):
          this.loss.nativeElement.style.display = "none";
          this.lossDropdown = entry.values;
          this.selectedOptionLoss = entry.default;
        case this.translate.instant('project.useDropout'):
          this.useDropout.nativeElement.style.display = "none";
          this.useDropoutCheckedState = entry.default;
      }
    }
  }

  getProperties() {
    this._dataService.getProperties().subscribe(data => {
      console.log(data);
      this.searchProperty(data);
    })
  }

  trainModel(selectedModel, selectedDataset) {
    if (selectedModel != null && selectedDataset != null) {
      console.log("The model: " + selectedModel.id);
      console.log("The dataset: " + selectedDataset.dataset);
    }
    this.trainProcessStarted = true;
    this.trainSpinner = true;

    let selectedProperties: PropertyInstance[] = [];
    let learning = new PropertyInstance;
    learning.name = "Learning rate";
    learning.value = this.learningRateValue;
    selectedProperties.push(learning);
    let loss = new PropertyInstance;
    loss.name = "Loss function";
    loss.value = this.selectedOptionLoss;
    selectedProperties.push(loss);
    let dropout = new PropertyInstance;
    dropout.name = "Use dropout";
    dropout.value = this.useDropoutCheckedState;
    selectedProperties.push(dropout);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('project.trainNewModel'),
      dialogContent: this.translate.instant('project.areYouSureTrain'),
      trainingTime: this.translate.instant('project.estimatedTimeTrain'),
      modelSelected: selectedModel,
      datasetSelected: selectedDataset
    }

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result && selectedModel != null && selectedDataset != null) {
        this._dataService.trainModel(selectedModel.id, selectedDataset.dataset, selectedProperties).subscribe(data => {
          if (data.body.result == "ok")
            this.trainSpinner = false;
          this.disabledTrainButton = true;
          //this.trainProcessStarted = true;
          //this.showTrainButton = false;
          //this.showStopButton = true;
          let process = new ProcessingObject;
          process.processId = data.body.process_id;
          process.process_status = ProcessStatus.none;
          this.checkStatus(process);
        })
      }
      else {
        this.trainProcessStarted = false;
        this.trainSpinner = false;
        console.log('Canceled');
      }
    });
  }

  stopModel() {
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
        //this.showTrainButton = true;
        //this.showStopButton = false;
        console.log("stop");
        this.trainProcessStarted = false;
      }
      else {
        console.log('Canceled');
      }
    });
  }

  inferenceModel(selectedWeight, selectedDataset) {
    this.disabledInferenceButton = true;
    if (selectedDataset != null && selectedWeight != null) {
      this._dataService.inferenceModel(selectedWeight, selectedDataset).subscribe(data => {
        console.log(data.body);
        this.inferenceProcessId = data.body.process_id;
        console.log(this.inferenceProcessId);
      });
    }
  }

  checkStatus(process) {
    this._dataService.getStatus(process.process_id).subscribe(data => {
      let status: any = data.status;
      process.process_type = status.process_type;
      process.process_status = status.process_status;
      if (this.trainProcessStarted == true) {
        if (process.process_status == "running") {
          console.log(process.process_status);
          setTimeout(() => {
            this.checkStatus(process)
          }, 2 * 1000);
        }
        if (process.process_status == "finished") {
          this.trainProcessStarted = false;
        }
      }
    })
  }
}