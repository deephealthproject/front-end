import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { CreateProjectDialogComponent } from '../create-project-dialog/create-project-dialog.component';
import { InteractionService } from '../../services/interaction.service';
import { DataService } from '../../services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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
  owners: Map<string, string>;
  datasetPublic: boolean;
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
  owners: Map<string, string>;
  weightPublic: boolean;
}

export class PropertyInstance {
  id: number;
  name: string;
  values;
  value;
  default;
}

export enum ProcessStatus {
  none,
  running,
  finished,
  error
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

  username: string;
  users = [];
  usersArray: Array<User> = [];
  projectOwnerIcon = "checkedOwner";

  constructor(private _interactionService: InteractionService, public _authService: AuthService,
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

  @ViewChild('modelsList') modelsList: ElementRef;
  @ViewChild('weightsListId') weightsListId: ElementRef;
  @ViewChild('datasetsList') datasetsList: ElementRef;
  @ViewChild('messageCreateProject') messageCreateProject: ElementRef;

  ngOnInit() {
    this.initialiseProjectsList();
    this.initialiseUsersList();
    this.getProjects();
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
        this.projects = projects;
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
            this.addProject(this.projectName, null, this.projectTaskId, this.users);
            this._interactionService.projectName = this.projectName;
          }
          else
            console.log('Project already exists');
          this._interactionService.openSnackBar(this.translate.instant('powerUser.errorCreatedNewProject'));
        }
      }
      else {
        console.log('Canceled');
        this._interactionService.openSnackBar(this.translate.instant('powerUser.errorMessageNewProject'));
      }
    });
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
    this._interactionService.selectedTask = currentProject.task_id;
    this._interactionService.usersList = [];
    this._interactionService.usersAssociatedArray = [];
    this._interactionService.projectOwner = null;
    this._interactionService.runningProcesses = [];
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
    this._dataService.pastTrainingProcesses(currentProject.id).subscribe(data => {
      contentData = data;
      for (let process of contentData) {
        let trainingProcess = new ProcessingObject;
        trainingProcess.projectId = process.project_id;
        trainingProcess.processId = process.id;
        trainingProcess.process_status = ProcessStatus[2];
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
        inferenceProcess.projectId = process.project_id;
        inferenceProcess.processId = process.id;
        inferenceProcess.process_status = ProcessStatus[2];
        inferenceProcess.process_type = "inference";
        inferenceProcess.unread = false;
        this._interactionService.changeStopButton(inferenceProcess);
        this._interactionService.runningProcesses.push(inferenceProcess);
      }
    });
    this._dataService.pastInferenceSingleProcesses(currentProject.id).subscribe(data => {
      contentData = data;
      for (let process of contentData) {
        let inferenceSingleProcess = new ProcessingObject;
        inferenceSingleProcess.projectId = process.project_id;
        inferenceSingleProcess.processId = process.id;
        inferenceSingleProcess.process_status = ProcessStatus[2];
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

  getProjects() {
    this._dataService.projects().subscribe(data => {
      // this._interactionService.resetProjectsList(data);
      this.updateProjectsList(data);
    })
  }

  getProjectsById(projectId) {
    this._dataService.projectsById(projectId).subscribe(data => {
      //this._interactionService.showProjectTab(data.body.name);
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

  addProject(projectName, modelweights_id, task_id, users) {
    this._dataService.addProject(projectName, modelweights_id, task_id, users).subscribe(data => {
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
    p.users = contentData.users;
    this.projects.push(p);
    this._interactionService.openSnackBar(this.translate.instant('powerUser.successMessageCreatedNewProject'));
  };

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
        this._dataService.projects().subscribe(data => {
          this.updateProjectsList(data);
        })
      }
    });
  }

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

  deleteDataset(dataset) {
    let itemToDelete = new ItemToDelete();
    itemToDelete.type = "dataset";
    itemToDelete.deletedItem = dataset;
    let taskId;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('delete-dialog.deleteDatasetTitle'),
      dialogDeletedItem: itemToDelete.deletedItem.name,
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
