import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { InteractionService } from 'src/app/services/interaction.service';
import { DataService } from 'src/app/services/data.service';
import { TranslateService } from '@ngx-translate/core';

export class Project {
  name: string
  id: number;
  // modelId: number;
  // datasetId: number;
  // weight: Weight;
}

export class Dataset {
  id;
  name;
  dataset;
  color: string;
}

export class Model {
  id;
  name;
  location;
  task;
  weightsList: Array<Weight>;
  color: string;
}

export class Weight {
  id: number;
  model_id: number;
  name: string;
  location: string;
  propertioes: Array<PropertyInstance>;
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
  selectedModel: Model;
  selectedDataset: Dataset;
  selectedWeight: Weight;
  errorMessage: string = "";
  models: Array<Model> = [];
  myModelsIcon = "folder";
  modelIcon = "folder";
  myDatasetsIcon = "folder";
  weights: Array<Weight> = [];
  weightsShowStatus: boolean = false;
  datasets: Array<Dataset>;
  selectedDatasetColor;

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
    this.models = this.getModels();
    this.modelsList.nativeElement.style.display = "none";
    this.weightsShowStatus = false;
    this.weights = [];
    this.datasets = this.getDatasets();
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
            // newProject.modelId = this.selectedModel.id;
            // newProject.datasetId = this.selectedDataset.id;
            // newProject.weight = this.selectedWeight;
            // this.addProject(this.projectName, this.projectId, this.selectedModel.id, this.selectedDataset.id, this.selectedWeight);
            this.addProject(this.projectName, this.projectId);
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
    this._interactionService.initialiseFineTuning();
    // //TODO: de sters
    // if (selectedProject.name == "newProjectName") {
    //   if (selectedProject.modelId == null || selectedProject.modelId == undefined) {
    //     selectedProject.modelId = this.selectedModel.id;
    //     console.log("currently selected model: " + selectedProject.modelId);
    //   }
    //   if (selectedProject.datasetId == null || selectedProject.datasetId == undefined) {
    //     selectedProject.datasetId = this.selectedDataset.dataset;
    //     console.log("currently selected dataset: " + selectedProject.datasetId);
    //   }
    // }
    // //
    // else {
    //   this._interactionService.changeSelectedModel(selectedProject.modelId);
    //   console.log("currently selected model: " + selectedProject.modelId);
    //   this._interactionService.changeSelectedDatasetId(selectedProject.datasetId);
    //   console.log("currently selected dataset: " + selectedProject.modelId);
    // }

  }

  getProjects(): Array<Project> {
    this._dataService.getProjects().subscribe(data => {
      this.updateProjectsList(data);
    })
    return this.projects;
  }

  addProject(projectName, projectId) {
    this._dataService.addProject(projectName, projectId).subscribe(data => {
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

  getModels() {
    this._dataService.getModels().subscribe(data => {
      this.updateModelsList(data);
    })
    return this.models;
  }

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
    for (let entry of data) {
      model.weightsList.push(entry);
    }
  }

  getWeights(model: Model) {
    this._dataService.getWeights(model.id).subscribe(data => {
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
    this.hideMessageCreateNewProject();
  }

  selectDataset(dataset) {
    this.selectedDataset = dataset;
    this.updateBackgroundColorsDataset()
    this._interactionService.changeSelectedDatasetId(dataset);
    this.hideMessageCreateNewProject();

  }

  selectWeight(weight) {
    this.selectedWeight = weight;
    this.updateBackgroundColorWeight();
    //this._interactionService.changeSelectedWeight(weight);
  }

  updateDatasetsList(data) {
    this.datasets = [];
    for (let entry of data) {
      this.datasets.push(entry);
    }
  }

  getDatasets() {
    this._dataService.getDatasets().subscribe(data => {
      this.updateDatasetsList(data);
    })
    return this.datasets;
  }

  hideMessageCreateNewProject() {
    if (this.selectedModel && this.selectedDataset)
      this.messageCreateProject.nativeElement.style.display = "none";
  }

  updateBackgroundColorModel() {
    if (this.models) {
      for (let model of this.models) {
        if (this.selectedModel == model) {
          model.color = "rgb(189,222,228)";
        }
        else {
          model.color = "white";
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
              weight.color = "rgb(189,222,228)";
            }
            else {
              weight.color = "white";
            }
          }
      }
    }
  }

  updateBackgroundColorsDataset() {
    if (this.datasets) {
      for (let dataset of this.datasets) {
        dataset.color = "white";
        if (this.selectedDataset == dataset) {
          dataset.color = "rgb(189,222,228)";
        }
      }
    }
  }
}
