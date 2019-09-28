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
}

export class Model {
  id;
  name;
  location;
  task;
  weightsList: Array<Weight>;
}

export class Weight {
  id: number;
  model_id: number;
  name: string;
  location: string;
  propertioes: Array<PropertyInstance>;
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
  models: Array<Model> = [];
  myModelsIcon = "folder";
  modelIcon = "folder";
  weights: Array<Weight> = [];
  weightsShowStatus: boolean = false;

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

  ngOnInit() {
    this.projects = this.getProjects();
    this.models = this.getModels();
    this.modelsList.nativeElement.style.display = "none";
    this.weightsShowStatus = false;
    this.weights = [];
  }

  createNewProject(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      inputValue: this.projectName,
      dialogTitle: this.translate.instant('powerUser.createNewProject'),
      inputPlaceHolder: this.translate.instant('powerUser.projectName')
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

  showProject(selectedProjectName: string) {
    this._interactionService.changeShowStatePowerUser(false);
    this._interactionService.changeShowStateProject(true);
    this._interactionService.showProjectTab(selectedProjectName);
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
}
