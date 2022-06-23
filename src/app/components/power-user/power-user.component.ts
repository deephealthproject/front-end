import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from '../create-project-dialog/create-project-dialog.component';
import { InteractionService } from '../../services/interaction.service';
import { DataService } from '../../services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ProgressSpinnerDialogComponent } from '../progress-spinner-dialog/progress-spinner-dialog.component';

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
  users: Array<User>;
}

export class User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  permission: string;
}

export enum PermissionStatus {
  OWN,
  VIEW
}

export class Dataset {
  id: number;
  name: string;
  path: string;
  task_id: number;
  color: string;
  users: Map<string, string>;
  datasetPublic: boolean;
  ctype: string;
  ctype_gt: string;
  classes: string;
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
  public: boolean;
  users: Map<string, string>;
  weightPublic: boolean;
  process_id: string;
  layer_to_remove: string;
  classes: string;
  is_active: string;
}

export class PropertyInstance {
  id: number;
  name: string;
  values;
  value;
  default;
}

export enum ProcessStatus {
  PENDING,
  STARTED,
  RETRY,
  FAILURE,
  SUCCESS,
  REVOKED
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
  modelweights_id;
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

export class ItemToDelete {
  type: string;
  deletedItem: any;
}

export enum TypeOfItemToDelete {
  project,
  model,
  dataset,
  weight,
  users
}

@Component({
  selector: 'app-power-user',
  templateUrl: './power-user.component.html',
  styleUrls: ['./power-user.component.css']
})

export class PowerUserComponent implements OnInit {
  projectName: string;
  projectTaskId;
  projectId: number = 1;
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
  modelName;
  modelTaskId;
  modelId: number = 1;

  username: string;
  users = [];
  usersArray: Array<User> = [];
  projectOwnerIcon = "checkedOwner";

  customCollapsedHeight: string = "32px";
  customExpandedHeight: string = "32px";
  isWeightListEmpty: boolean = false;

  constructor(public _interactionService: InteractionService, public _authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog,
    private _dataService: DataService,
    public translate: TranslateService,
    private router: Router) {
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
    this.matIconRegistry.addSvgIcon(
      'checkedOwner',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/done-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/delete-24px.svg')
    );
  }

  @ViewChild('modelsList', { static: true }) modelsList: ElementRef;
  @ViewChild('weightsListId') weightsListId: ElementRef;
  @ViewChild('datasetsList', { static: true }) datasetsList: ElementRef;
  @ViewChild('messageCreateProject') messageCreateProject: ElementRef;

  ngOnInit() {
    this.initialiseProjectsList();
    this.initialiseUsersList();
    this._interactionService.getProjects();
    this.getUsers();
    this.models = this.getModels(undefined);
    this.modelsList.nativeElement.style.display = "none";
    this.weightsShowStatus = false;
    this.weights = [];
    this.datasets = this.getDatasets(undefined);
    this.datasetsList.nativeElement.style.display = "none";
    this.setTasksList();
    if (localStorage.getItem('accessToken') == null) {
      this.router.navigate(['/']);
    }
  }

  initialiseProjectsList() {
    this._interactionService.projectsList$.subscribe(
      projects => {
        this._interactionService.projects = projects;
      }
    );
  }

  initialiseUsersList() {
    this._interactionService.usersList$.subscribe(
      usersArray => {
        this.usersArray = usersArray;
      }
    );
  }

  createNewProject(): void {
    this.taskList = [];
    this.users = [];
    this._dataService.getTasks().subscribe(data => {
      this.createNewProjectWithTask(data);
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
      selectedUsername: null,
      taskDropdown: data
    };

    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

    let dialogRef = this.dialog.open(CreateProjectDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
      if (result) {
        if (result.inputValue) {
          let thatProjectExist = false;
          for (let currentProject of this._interactionService.projects) {
            if (currentProject.name == result.inputValue)
              thatProjectExist = true;
          }
          if (thatProjectExist == false) {
            this.projectName = result.inputValue;
            this.projectTaskId = result.selectedOptionTask;
            for (let currentUser of this.usersArray) {
              if (currentUser.username == this._interactionService.username) {
                this.users.push({
                  "username": currentUser.username,
                  "permission": PermissionStatus[0]
                });
              }
            }
            this.projectId++;
            console.log("Project " + this.projectName + " created");
            this.addProject(this.projectName, this.projectTaskId, this.users);
            this._interactionService.projectName = this.projectName;
            dialogRefSpinner.close();
          }
          else {
            dialogRefSpinner.close();
            console.log('Project already exists');
            this._interactionService.openSnackBarBadRequest(this.translate.instant('powerUser.errorCreatedNewProject'));
          }
        }
      }
      else {
        dialogRefSpinner.close();
      }
    });
  }

  addProject(projectName, task_id, users) {
    this._dataService.addProject(projectName, task_id, users).subscribe(data => {
      if (data.statusText == "Created") {
        this._interactionService.getProjects();
        this._interactionService.openSnackBarOkRequest(this.translate.instant('powerUser.successMessageCreatedNewProject'));
      }
    }, error => {
      this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
    })
  }

  createNewModel(): void {
    this.taskList = [];
    this.users = [];
    this._dataService.getTasks().subscribe(data => {
      this.createNewModelWithTask(data);
    });
  }

  createNewModelWithTask(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      inputValue: this.projectName,
      dialogTitle: this.translate.instant('powerUser.createNewModel'),
      inputPlaceHolder: this.translate.instant('powerUser.modelName'),
      selectedOptionTask: null,
      selectedUsername: null,
      taskDropdown: data
    };

    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

    let dialogRef = this.dialog.open(CreateProjectDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
      if (result) {
        if (result.inputValue) {
          let thatModelExist = false;
          for (let currentModel of this.models) {
            if (currentModel.name == result.inputValue)
              thatModelExist = true;
          }
          if (thatModelExist == false) {
            this.modelName = result.inputValue;
            this.modelTaskId = result.selectedOptionTask;
            this.modelId++;
            console.log("Model " + this.modelName + " created");
            this.createModel(this.modelName, this.modelTaskId);
            dialogRefSpinner.close();
          }
          else {
            dialogRefSpinner.close();
            console.log('Model already exists');
            this._interactionService.openSnackBarBadRequest(this.translate.instant('powerUser.errorCreatedNewModel'));
          }
        }
      }
      else {
        dialogRefSpinner.close();
      }
    });
  }

  createModel(modelName, task_id) {
    this._dataService.createModel(modelName, task_id).subscribe(data => {
      if (data.statusText == "Created") {
        this.models = this.getModels(undefined);
        this._interactionService.openSnackBarOkRequest(this.translate.instant('powerUser.successMessageCreatedNewModel'));
      }
    }, error => {
      this._interactionService.openSnackBarBadRequest("Error: " + error.statusText);
    })
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

  initialiseCurrentProject(currentProject) {
    this._interactionService.selectedTaskId = currentProject.task_id;
    this._interactionService.usersList = [];
    this._interactionService.usersAssociatedArray = [];
    this._interactionService.runningProcesses = [];
    this._interactionService.projectOwner = null;
    let contentData = null;

    if (this._interactionService.usersList.length == 0) {
      this._interactionService.usersList = this.usersArray;
    }
    this._interactionService.currentProject = currentProject;
    currentProject.users.forEach(user => {
      if (user.permission == PermissionStatus[0]) {
        this._interactionService.projectOwner = user.username;
        this._interactionService.usersList = this._interactionService.usersList.filter(item => item.username !== this._interactionService.projectOwner);
        this._interactionService.usersAssociatedArray = this._interactionService.usersAssociatedArray.filter(item => item.username !== this._interactionService.projectOwner);
      }
      else {
        this._interactionService.usersAssociatedArray.push({ "username": user.username, "permission": PermissionStatus[1] });
        this._interactionService.usersList = this._interactionService.usersList.filter(item => item.username !== user.username);
      }
    });
    this._dataService.pastTrainingProcesses(currentProject.id, null).subscribe(data => {
      contentData = data;
      for (let process of contentData) {
        let trainingProcess = new ProcessingObject;
        trainingProcess.process_created_date = process.created;
        trainingProcess.process_updated_date = process.updated;
        trainingProcess.projectId = process.project_id;
        trainingProcess.processId = process.celery_id;
        trainingProcess.training_id = process.id;
        trainingProcess.modelweights_id = process.modelweights_id;
        trainingProcess.process_status = ProcessStatus[4];
        trainingProcess.process_type = "training";
        trainingProcess.unread = false;
        this._interactionService.changeStopButton(trainingProcess);
        this._interactionService.runningProcesses.push(trainingProcess);
      }
      //id: 50, celery_id: "0883b0a5-2333-401d-a78e-d362183784ed", project_id: 79, modelweights_id: 443}
    })

    this._dataService.pastInferenceProcesses(currentProject.id).subscribe(data => {
      contentData = data;
      for (let process of contentData) {
        let inferenceProcess = new ProcessingObject;
        inferenceProcess.process_created_date = process.created;
        inferenceProcess.process_updated_date = process.updated;
        inferenceProcess.projectId = process.project_id;
        inferenceProcess.processId = process.celery_id;
        inferenceProcess.process_status = ProcessStatus[4];
        inferenceProcess.process_type = "inference";
        inferenceProcess.unread = false;
        this._interactionService.changeStopButton(inferenceProcess);
        this._interactionService.runningProcesses.push(inferenceProcess);
      }
    });

    //??? inference Single intoarce aceleasi procese ca inference
    this._dataService.pastInferenceSingleProcesses(currentProject.id).subscribe(data => {
      contentData = data;
      for (let process of contentData) {
        let inferenceSingleProcess = new ProcessingObject;
        inferenceSingleProcess.process_created_date = process.created;
        inferenceSingleProcess.process_updated_date = process.updated;
        inferenceSingleProcess.projectId = process.project_id;
        inferenceSingleProcess.processId = process.celery_id;
        inferenceSingleProcess.process_status = ProcessStatus[4];
        inferenceSingleProcess.process_type = "inferenceSingle";
        inferenceSingleProcess.unread = false;
        this._interactionService.changeStopButton(inferenceSingleProcess);
        this._interactionService.runningProcesses.push(inferenceSingleProcess);
      }
    });
  }

  showProject(selectedProject: Project) {
    this._interactionService.showProjectTab(selectedProject.name);
    this._interactionService.changeCurrentProject(selectedProject);
    this._interactionService.resetProject();
    this._interactionService.resetSelectedOptions();

    this._interactionService.changeShowStateProjectDivLeft(true);
    this._interactionService.changeShowStateProjectDivMiddle(true);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(true);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(false);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this.router.navigate(['/project']);
  }

  getProjectsById(projectId) {
    this._dataService.projectsById(projectId).subscribe(data => {
      //this._interactionService.showProjectTab(data.body.name);
      console.log(data);
    })
  }

  insertProject(contentData) {
    let p = new Project;
    p.id = contentData.id;
    p.name = contentData.name;
    p.task_id = contentData.task_id;
    p.modelweights_id = contentData.modelweights_id;
    p.inference_id = contentData.inference_id;
    p.users = contentData.users;
    this._interactionService.projects.push(p);
    this._interactionService.openSnackBarOkRequest(this.translate.instant('powerUser.successMessageCreatedNewProject'));
  };

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
      dialogItemType: this.translate.instant('delete-dialog.deleteProjectItem'),
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
        this._interactionService.getProjects();
      }
    });
  }

  //models functions
  getModels(taskId) {
    this._dataService.getModels(taskId).subscribe(data => {
      this.updateModelsList(data);
    })
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
    this.getWeights(model, null);
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

  getWeights(model: Model, dataset: Dataset) {
    let modelId = model.id;
    let datasetId;
    if(dataset != null || dataset != undefined) {
      datasetId = dataset.id;
    }
    this._dataService.getWeights(modelId, datasetId).subscribe(data => {
      if (data[0] != undefined) {
        this.updateWeightsList(model, data);
        this.isWeightListEmpty = false;
      } else {
        this.isWeightListEmpty = true;
      }
    })
  }

  updateWeightsList(model: Model, contentData) {
    model.weightsList = [];
    for (let entry of contentData) {
      model.weightsList.push(entry);
    }
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

  deleteDataset(dataset) {
    let itemToDelete = new ItemToDelete();
    itemToDelete.type = TypeOfItemToDelete[2];
    itemToDelete.deletedItem = dataset;
    let taskId;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('delete-dialog.deleteDatasetTitle'),
      dialogDeletedItem: itemToDelete.deletedItem.name,
      dialogItemType: this.translate.instant('delete-dialog.deleteDatasetItem'),
      deletedItemInputPlaceHolder: this.translate.instant('project.datasetName'),
      dialogContent: this.translate.instant('delete-dialog.areYouSureDeleteDataset'),
      deleteObject: itemToDelete
    }

    let dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        this._dataService.getDatasets(taskId).subscribe(data => {
          this.updateDatasetsList(data);
        });
      }
    })
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
}
