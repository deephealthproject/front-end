import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { InteractionService } from 'src/app/services/interaction.service';
import { DataService } from 'src/app/services/data.service';

export class Project {
  name: string
  id: number;
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

  constructor(private _interactionService: InteractionService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer, public dialog: MatDialog,
    private _dataService: DataService) {
    super();
    this.matIconRegistry.addSvgIcon(
      'folder',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-folder-24px.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'new-folder',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/baseline-create_new_folder-24px.svg')
    );
  }

  createNewProject(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      inputValue: this.projectName,
      dialogTitle: "Create new project",
      inputPlaceHolder: "Project name"
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

  ngOnInit() {
    this.projects = this.getProjects();
  }
}
