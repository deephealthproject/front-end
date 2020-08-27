import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { CreateProjectDialogComponent } from 'src/app/components/create-project-dialog/create-project-dialog.component';
import { InteractionService } from 'src/app/services/interaction.service';
import { DataService } from 'src/app/services/data.service';
import { TranslateService } from '@ngx-translate/core';

export class Project {
  id: number;
  name: string;
  task_id: number;
  modelweights_id: number;
  inference_id;
  dataset_id: number;
  pretrained_on: number;
  model_id: number;
  weightName: string;
}

export class Dataset {
  id: number;
  name: string;
  path: string;
  dataset: string;
  task_id: number;
  color: string;
}

export class Model {
  id: number;
  name: string;
  location: string;
  task_id: number;
  weightsList: Array<Weight>;
  propertiesList: Array<PropertyInstance>;
  color: string;
}

export class Weight {
  id: number;
  name: string;
  color: string;
  task_id: number;
  dataset_id: number;
  pretrained_on: number;
  model_id: number;
  weightId: number;
  weightName: string;
}

export class PropertyInstance {
  id: number;
  name: string;
  values;
  value;
  default;
}

@Component({
  selector: 'app-power-user',
  templateUrl: './power-user.component.html',
  styleUrls: ['./power-user.component.css']
})

export class PowerUserComponent implements OnInit {
  projects: Array<Project> = [];
  projectName: string;
  projectTaskId;
  projectId: number = 2;
  task_id: number;
  selectedModel: Model;
  selectedDataset: Dataset;
  selectedWeight: Weight;
  errorMessage: string = "";
  models: Array<Model> = [];
  myModelsIcon = "folder";
  modelIcon = "folder";
  myDatasetsIcon = "folder";
  weightsIcon = "folder";
  weights: Array<Weight> = [];
  weightsShowStatus: boolean = false;
  datasets: Array<Dataset>;
  selectedDatasetColor;
  modelweights_id: number = -1;
  taskList = [];

  constructor(private _interactionService: InteractionService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog,
    private _dataService: DataService,
    public translate: TranslateService,
    private snackBar: MatSnackBar) {
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
    this.initialiseProjectsList();
    this.getProjects();
    this.models = this.getModels(undefined);
    this.modelsList.nativeElement.style.display = "none";
    this.weightsShowStatus = false;
    this.weights = [];
    this.datasets = this.getDatasets(undefined);
    this.datasetsList.nativeElement.style.display = "none";
    this.setTasksList();
  }

  initialiseProjectsList() {
    this._interactionService.projectsList$.subscribe(
      projects => {
        this.projects = projects;
      }
    );
  }

  createNewProject(): void {
    this.taskList = [];
    this._dataService.getTasks().subscribe(data => {
      console.log(data);
      if (data != undefined || data != null) {
        this.createNewProjectWithTask(data);
      }
    });
  }

  createNewProjectWithTask(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      inputValue: this.projectName,
      dialogTitle: this.translate.instant('powerUser.createNewProject'),
      inputPlaceHolder: this.translate.instant('powerUser.projectName'),
      selectedOptionTask: null,
      taskDropdown: data,
    };

    let dialogRef = this.dialog.open(CreateProjectDialogComponent, dialogConfig);
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
            this.projectTaskId = result.selectedOptionTask;
            this.projectId++;
            let newProject = new Project();
            console.log('Yes clicked');
            console.log("project " + this.projectName + " created");
            this.addProject(this.projectName, null, this.projectTaskId);
          }
          else
            console.log('Project already exists');
            this.openSnackBar(this.translate.instant('powerUser.errorCreatedNewProject'));
        }
      }
      else {
        console.log('Canceled');
        this.openSnackBar(this.translate.instant('powerUser.errorMessageNewProject'));
      }
    });

    // let dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   console.log(result);
    //   if (result) {
    //     if (result.inputValue) {
    //       let thatProjectExist = false;
    //       for (let currentProject of this.projects) {
    //         if (currentProject.name == result.inputValue)
    //           thatProjectExist = true;
    //       }
    //       if (thatProjectExist == false) {
    //         this.projectName = result.inputValue;
    //         this.projectId++;
    //         let newProject = new Project();
    //         console.log('Yes clicked');
    //         console.log("project " + this.projectName + " created");
    //         this.addProject(this.projectName, null, 1);
    //       }
    //       else
    //         console.log('Project already exists');
    //     }
    //   }
    //   else {
    //     console.log('Canceled');
    //   }
    // });
  }

  setTasksList() {
    this.taskList = [];
    this._dataService.getTasks().subscribe(data => {
      console.log(data);
      if (data != undefined || data != null) {
        this.taskList.push(data);
      }
    });
  }

  showProject(selectedProject: Project) {
    this._interactionService.changeShowStatePowerUser(false);
    this._interactionService.changeShowStateProject(true);
    this._interactionService.showProjectTab(selectedProject.name);
    // this._interactionService.showProjectIdTab(selectedProject.id);
    this._interactionService.changeCurrentProject(selectedProject);
    this._interactionService.resetProject();

    this._interactionService.changeShowStateProjectDivLeft(true);
    this._interactionService.changeShowStateProjectDivMiddle(true);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivUserScreen(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(true);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectUserScreenIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    //this.projects = this._interactionService.getProjectList();
  }

  getProjects() {
    this._dataService.projects().subscribe(data => {
      // this._interactionService.resetProjectsList(data);
      this.updateProjectsList(data);
    })
  }

  getProjectsById(propertyId) {
    this._dataService.projectsById(propertyId).subscribe(data => {
      //this._interactionService.showProjectIdTab(data.body.id);
      console.log(data);
    })
  }

  updateProjectsList(contentData) {
    this.projects = [];
    for (let entry of contentData) {
      this.projects.push(entry);
    }
    console.log(this.projects);
  }

  addProject(projectName, modelweights_id, task_id) {
    this._dataService.addProject(projectName, modelweights_id, task_id).subscribe(data => {
      // this._interactionService.resetProjectsList(data.body);
      if (data.body != undefined) {
        this.insertProject(data.body);
      }
      else {
        this.insertProject(data);
      }
    })
  }

  insertProject(contentData) {
    let p = new Project;
    p.id = contentData.id;
    p.name = contentData.name;
    p.task_id = contentData.task_id;
    p.modelweights_id = contentData.modelweights_id;
    p.inference_id = contentData.inference_id;
    this.projects.push(p);
    this.openSnackBar(this.translate.instant('powerUser.successMessageCreatedNewProject'));
  };

  updateWeightsList(model: Model, contentData) {
    model.weightsList = [];
    for (let entry of contentData) {
      model.weightsList.push(entry);
    }
    console.log(model.weightsList);
  }

  getWeights(model: Model) {
    let modelId = model.id;
    this._dataService.getWeights(modelId).subscribe(data => {
      this.updateWeightsList(model, data);
    })
  }

  selectWeight(weight) {
    this.selectedWeight = weight;
    this.updateBackgroundColorWeight();
    //this._interactionService.changeSelectedWeight(weight);
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
              weight.color = "#425463";
            }
          }
      }
    }
  }

  getDatasets(taskId) {
    this._dataService.getDatasets(taskId).subscribe(data => {
      this.updateDatasetsList(data);
    })
    console.log(this.datasets);
    return this.datasets;
  }

  updateDatasetsList(data) {
    this.datasets = [];
    for (let entry of data) {
      this.datasets.push(entry);
    }
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

  selectDataset(dataset) {
    this.selectedDataset = dataset;
    this.updateBackgroundColorsDataset()
    this._interactionService.changeSelectedDatasetId(dataset);
  }

  updateBackgroundColorsDataset() {
    if (this.datasets) {
      for (let dataset of this.datasets) {
        dataset.color = "#425463";
        if (this.selectedDataset == dataset) {
          dataset.color = "rgb(134, 154, 170)";
        }
      }
    }
  }

  //models functions
  getModels(taskId) {
    this._dataService.getModels(taskId).subscribe(data => {
      this.updateModelsList(data);
    })
    console.log(this.models);
    return this.models;
  }

  updateModelsList(data) {
    this.models = [];
    for (let entry of data) {
      this.models.push(entry);
    }
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

  selectModel(model) {
    this.selectedModel = model;
    this.updateBackgroundColorModel();
    this._interactionService.changeSelectedModel(model);
  }

  updateBackgroundColorModel() {
    if (this.models) {
      for (let model of this.models) {
        if (this.selectedModel == model) {
          model.color = "rgb(134, 154, 170)";
        }
        else {
          model.color = "#425463";
        }
      }
    }
  }

  openSnackBar(message) {
    this.snackBar.open(message, "close", {
      duration: 5000,
    });
  }
}
