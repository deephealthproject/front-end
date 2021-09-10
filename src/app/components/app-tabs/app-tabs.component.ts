import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../../services/interaction.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ProcessingObject, ProcessStatus, User } from '../power-user/power-user.component';
import { PermissionStatus } from '../delete-dialog/delete-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-app-tabs',
  templateUrl: './app-tabs.component.html',
  styleUrls: ['./app-tabs.component.css']
})
export class AppTabsComponent implements OnInit {
  usersArray: Array<User> = [];

  constructor(private _dataService: DataService, private _interactionService: InteractionService, public _authService: AuthService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
    private router: Router) {
    this.matIconRegistry.addSvgIcon(
      'notification',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/notifications-24px.svg')
    );
  }

  tabs = this._interactionService.tabs;
  unreadNotifications = this._interactionService.unreadNotificationsNumber;

  ngOnInit() {
    this._interactionService.showUserTab("Home Page");
    this.initialiseUnreadNotificationsNumber();
    this.initialiseUsersList();
    this.getUsers();
  }

  initialiseUnreadNotificationsNumber() {
    this._interactionService.unreadNotificationsNumber$.subscribe(
      number => {
        this.unreadNotifications = number;
      }
    )
  }

  initialiseUsersList() {
    this._interactionService.usersList$.subscribe(
      usersArray => {
        this.usersArray = usersArray;
      }
    );
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

  returnToUser() {
    this.router.navigate(['/power-user']);
  }

  returnToProject(projectName) {
    if (projectName == this._interactionService.currentProject.name) {
      let currentProject = this._interactionService.currentProject;
      this._interactionService.selectedTaskId = currentProject.task_id;
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
          trainingProcess.process_created_date = process.created;
          trainingProcess.process_updated_date = process.updated;
          trainingProcess.projectId = process.project_id;
          trainingProcess.processId = process.celery_id;
          trainingProcess.process_status = ProcessStatus[4];
          trainingProcess.process_type = "training";
          trainingProcess.unread = false;
          this._interactionService.changeStopButton(trainingProcess);
          this._interactionService.runningProcesses.push(trainingProcess);
        }
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
      this._interactionService.initialiseModelDropdown(currentProject.task_id);
      this._interactionService.initialiseProperties();
      this._interactionService.initialiseDatasetDropdown(currentProject.task_id);
      this._interactionService.changeCheckedTask(currentProject.task_id);
      this._interactionService.changeWeightName(currentProject.weightName);
      this._interactionService.changeCheckedStateStopButton(true);
      this.router.navigate(['/project']);
    }
  }

  openNotifications() {
    this._interactionService.cleanProcessesList();
    this._interactionService.changeShowStateProjectDivLeft(false);
    this._interactionService.changeShowStateProjectDivMiddle(false);
    this._interactionService.changeShowStateProjectDivEditProject(false);
    this._interactionService.changeShowStateProjectDivNetwork(false);
    this._interactionService.changeShowStateProjectDivNotifications(true);
    this._interactionService.changeShowStateProjectDivEditWeights(false);
    this._interactionService.changeShowStateProjectDivOutputResults(false);

    this._interactionService.changeStateProjectConfigurationIsClicked(false);
    this._interactionService.changeStateProjectEditProjectIsClicked(false);
    this._interactionService.changeStateProjectNetworkIsClicked(false);
    this._interactionService.changeStateProjectNotificationsIsClicked(true);
    this._interactionService.changeStateProjectEditWeightsIsClicked(false);
    this._interactionService.changeStateProjectOutputResultsIsClicked(false);

    this._interactionService.showProcesses();
  }

}
