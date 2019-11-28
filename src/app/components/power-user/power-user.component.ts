import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { InteractionService } from 'src/app/services/interaction.service';
import { DataService } from 'src/app/services/data.service';
import { TranslateService } from '@ngx-translate/core';

export class Project {
  id: number;
  name: string
  modelweights_id: number;
}

export class Dataset {
  id: number;
  name: string;
  path: string;
  ispretraining: boolean;
  color: string;
}

export class Model {
  id: number;
  name: string;
  location: string;
  task_id: number;
  weightsList: Array<Weight>;
  color: string;
}

export class Weight {
  id: number;
  location: string;
  model_id: number;
  pretraining_id: number;
  properties: Array<PropertyInstance>;
  //name: string;
  color: string;
}

export class PropertyInstance {
  name: string;
  value;
}

@Component({

  selector: 'app-power-user',
  templateUrl: './power-user.component.html',
  styleUrls: ['./power-user.component.css']
})
export class PowerUserComponent extends Project implements OnInit {

  projects: Array<Project> = [];
  projectName: string;
  projectId: number = -1;
  task_id: number;
  selectedModel: Model;
  selectedFineTuning: Dataset;
  selectedWeight: Weight;
  errorMessage: string = "";
  models: Array<Model> = [];
  myModelsIcon = "folder";
  modelIcon = "folder";
  myDatasetsIcon = "folder";
  weights: Array<Weight> = [];
  weightsShowStatus: boolean = false;
  datasets: Array<Dataset>;
  selectedFineTuningColor;
  modelweights_id: number = -1;

  constructor(private _interactionService: InteractionService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog,
    private _dataService: DataService,
    public translate: TranslateService) {
    super();
    this.matIconRegistry.addSvgIcon(
      'folder',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-folder-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'new-folder',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-create_new_folder-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'open-folder',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-folder_open-24px.svg')
    );
  }

  @ViewChild('modelsList') modelsList: ElementRef;
  @ViewChild('weightsListId') weightsListId: ElementRef;
  @ViewChild('datasetsList') datasetsList: ElementRef;
  @ViewChild('messageCreateProject') messageCreateProject: ElementRef;

  ngOnInit() {
    this.projects = this.getProjects();
    // this.models = this.getModels();
    this.modelsList.nativeElement.style.display = "none";
    this.weightsShowStatus = false;
    this.weights = [];
    // this.datasets = this.getDatasets();
    this.datasetsList.nativeElement.style.display = "none";
  }

  createNewProject(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      inputValue: this.projectName,
      dialogTitle: this.translate.instant('powerUser.createNewProject'),
      inputPlaceHolder: this.translate.instant('powerUser.projectName'),
    };

    let dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        if (result.inputValue) {
          let thatProjectExist = false;
          for (let currentProject of this.projects) {
            if (currentProject.name == result.inputValue)
              thatProjectExist = true;
          }
          if (thatProjectExist == false) {
            this.projectName = result.inputValue;
            this.projectId++;
            let newProject = new Project();
            console.log('Yes clicked');
            console.log("project " + this.projectName + " created");
            newProject.name = this.projectName;
            newProject.id = this.projectId;
            newProject.modelweights_id = this.modelweights_id;
            // newProject.modelId = this.selectedModel.id;
            // newProject.datasetId = this.selectedFineTuning.id;
            // newProject.weight = this.selectedWeight;
            // this.addProject(this.projectName, this.projectId, this.selectedModel.id, this.selectedFineTuning.id, this.selectedWeight);
            this.addProject(this.projectName, this.projectId, this.modelweights_id, this.task_id);
          }
          else
            console.log('Project already exists');
        }
      }
      else {
        console.log('Canceled');
      }
    });
  }

  showProject(selectedProject: Project) {
    this._interactionService.changeShowStatePowerUser(false);
    this._interactionService.changeShowStateProject(true);
    this._interactionService.showProjectTab(selectedProject.name);
    this._interactionService.changeCurrentProject(selectedProject);
    //this._interactionService.resetProject();

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

  getProjects(): Array<Project> {
    this._dataService.projects().subscribe(data => {
      this.updateProjectsList(data);
    })
    return this.projects;
  }

  addProject(projectName, projectId, modelweights_id, task_id) {
    this._dataService.project(projectName, projectId, modelweights_id, task_id).subscribe(data => {
      console.log(data.body);
      this.projects = data.body;
    })
  }

  updateProjectsList(data) {
    this.projects = [];
    for (var entry of data) {
      this.projects.push(entry);
    }
  }

  updateModelsList(data) {
    this.models = [];
    for (let entry of data) {
      this.models.push(entry);
    }
  }

  // getModels() {
  //   let str: string = undefined;
  //   this._dataService.getModels(str).subscribe(data => {
  //     this.updateModelsList(data);
  //   })
  //   return this.models;
  // }

  expandModels() {
    if (this.modelsList.nativeElement.style.display == "none") {
      this.modelsList.nativeElement.style.display = "block";
      this.myModelsIcon = "open-folder";
    } else {
      this.modelsList.nativeElement.style.display = "none";
      this.myModelsIcon = "folder";
    }
  }

  updateWeightsList(model: Model, data) {
    model.weightsList = [];
    console.log(model.weightsList);
    for (let entry of data) {
      model.weightsList.push(entry);
    }
    console.log(model.weightsList);
  }

  getWeights(model: Model) {
    let modelId = model.id;
    console.log(modelId);
    this._dataService.getWeights(modelId).subscribe(data => {
      this.updateWeightsList(model, data);
    })
  }

  expandDatasets() {
    if (this.datasetsList.nativeElement.style.display == "none") {
      this.datasetsList.nativeElement.style.display = "block";
      this.myDatasetsIcon = "open-folder";
    } else {
      this.datasetsList.nativeElement.style.display = "none";
      this.myDatasetsIcon = "folder";
    }
  }

  selectModel(model) {
    this.selectedModel = model;
    this.updateBackgroundColorModel();
    this._interactionService.changeSelectedModel(model);
  }

  selectDataset(dataset) {
    this.selectedFineTuning = dataset;
    this.updateBackgroundColorsDataset()
    this._interactionService.changeSelectedFineTuningId(dataset);
  }

  selectWeight(weight) {
    this.selectedWeight = weight;
    this.updateBackgroundColorWeight();
    //this._interactionService.changeSelectedWeight(weight);
  }

  // updateDatasetsList(data) {
  //   this.datasets = [];
  //   for (let entry of data) {
  //     this.datasets.push(entry);
  //   }
  // }

  // getDatasets() {
  //   let bool: boolean;
  //   this._dataService.getDatasets("classification", bool).subscribe(data => {
  //     this.updateDatasetsList(data);
  //   })
  //   return this.datasets;
  // }

  updateBackgroundColorModel() {
    if (this.models) {
      for (let model of this.models) {
        if (this.selectedModel == model) {
          model.color = "rgb(134, 154, 170)";
        }
        else {
          model.color = "#5B6D7C";
        }
      }
    }
  }

  updateBackgroundColorWeight() {
    if (this.models) {
      for (let model of this.models) {
        if (model.weightsList)
          for (let weight of model.weightsList) {
            if (this.selectedWeight == weight) {
              weight.color = "rgb(134, 154, 170)";
            }
            else {
              weight.color = "#5B6D7C";
            }
          }
      }
    }
  }

  updateBackgroundColorsDataset() {
    if (this.datasets) {
      for (let dataset of this.datasets) {
        dataset.color = "#5B6D7C";
        if (this.selectedFineTuning == dataset) {
          dataset.color = "rgb(134, 154, 170)";
        }
      }
    }
  }
}
