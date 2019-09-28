import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { DataService } from 'src/app/services/data.service';

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
  selectors: Array<string> = ["Algorithm", "Pre-Training", "Fine-Tuning", "Input-Size", "Loss"];
  algorithmDropdown;
  preTrainingDropdown;
  fineTuningDropdown;
  inputSizeDropdown;
  lossDropdown;

  //selectors currently selected option
  selectedOptionAlgorithm = null;
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

  constructor(public _interactionService: InteractionService, private _dataService: DataService) { }

  @ViewChild('loss') loss: ElementRef;
  @ViewChild('learningRate') learningRate: ElementRef;
  @ViewChild('useDropout') useDropout: ElementRef;

  ngOnInit() {
    this.initialiseShowStatusProjectDivs();
    this.initialiseDivRightClickedButtons();
    this.initialiseTasks();
    this.initialiseInputTypes();
    this.initialiseImageInput();
    this.initialiseDropdowns();
    this.initiliaseSelectedOptions();
    this.initialiseReTrainButton();

    this.learningRate.nativeElement.style.display = "none";
    this.loss.nativeElement.style.display = "none";
    this.useDropout.nativeElement.style.display = "none";
  }

  initialiseReTrainButton() {
    this._interactionService.reTrainButtonCheckedState$.subscribe(
      state => {
        this.reTrainState = state;
      }
    );
  }

  initialiseDropdowns() {
    this._interactionService.dropdownAlgorithm$.subscribe(
      state => {
        this.algorithmDropdown = state;
      }
    );

    this._interactionService.dropdownFineTuning$.subscribe(
      state => {
        this.fineTuningDropdown = state;
      }
    );

    this._interactionService.dropdownInputSize$.subscribe(
      state => {
        this.inputSizeDropdown = state;
      }
    );

    this._interactionService.dropdownPreTraining$.subscribe(
      state => {
        this.preTrainingDropdown = state;
      }
    );
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
    this._interactionService.selectedOptionAlgorithm$.subscribe(
      state => {
        this.selectedOptionAlgorithm = state;
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
    for (var selector of this.selectors) {
      switch (selector) {
        case "Algorithm":
          this._dataService.getDropDownDetails(selectedTask, selector).subscribe(data => {
            this.algorithmDropdown = data.body.values;
            console.log(data.body);
          })
          break;

        case "Pre-Training":
          this._dataService.getDropDownDetails(selectedTask, selector).subscribe(data => {
            this.preTrainingDropdown = data.body.values;
            console.log(data.body);
          })
          break;

        case "Fine-Tuning":
          this._dataService.getDropDownDetails(selectedTask, selector).subscribe(data => {
            this.fineTuningDropdown = data.body.values;
            console.log(data.body);
          })
          break;
        case "Input-Size":
          this._dataService.getDropDownDetails(selectedTask, selector).subscribe(data => {
            this.inputSizeDropdown = data.body.values;
            console.log(data.body);
          })
          break;
      }
    }
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
      this._interactionService.changeCheckedStateReTrainButton(false);
    }
    else {
      this._interactionService.changeCheckedStateReTrainButton(true);
      this.getProperties();
    }
  }

  searchProperty(data) {
    for (let entry of data) {
      switch (entry.name) {
        case "Learning rate":
          this.learningRate.nativeElement.style.display = "block";
          this.learningRateValue = entry.default;
        case "Loss function":
          this.loss.nativeElement.style.display = "block";
          this.lossDropdown = entry.values;
          this.selectedOptionLoss = entry.default;
        case "Use dropout":
          this.useDropout.nativeElement.style.display = "block";
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

}
