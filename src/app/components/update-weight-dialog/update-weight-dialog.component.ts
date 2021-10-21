import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { InteractionService } from '../../services/interaction.service';
import { DataService } from '../../services/data.service';
import { User } from '../power-user/power-user.component';

export interface UpdateWeightData {
  dialogTitle: string;
  dialogContent: string;
  inputValue: string;
  weightDisplayMode: Boolean;

  selectedUsername;
  userDropdown: User[];
}

@Component({
  selector: 'app-update-weight-dialog',
  templateUrl: './update-weight-dialog.component.html',
  styleUrls: ['./update-weight-dialog.component.css']
})

export class UpdateWeightDialogComponent implements OnInit {
  dialogTitle: string;
  dialogContent: string;
  formDataWeight;
  weightDisplayModeValue: boolean = true;
 
  selectedUsername;
  userDropdown: User[];

  constructor(public dialogRef: MatDialogRef<UpdateWeightDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateWeightData, public translate: TranslateService, public _interactionService: InteractionService, private _dataService: DataService) {
    this.dialogTitle = data.dialogTitle;
    this.dialogContent = data.dialogContent;
    this.selectedUsername = data.selectedUsername;
    this.userDropdown = [];

    let userProject: User;
    data.userDropdown.forEach(user => {
      userProject = {id: user.id, username: user.username, first_name: user.first_name, last_name: user.last_name, email: user.email, permission: user.permission};
      this.userDropdown.push(userProject);
    });
    this.userDropdown = this.userDropdown.filter(item => item.username != this._interactionService.username);
  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
    this._interactionService.formDataWeight.weightName = this.data.inputValue;
  }

  save() {
    this.data.selectedUsername = this.selectedUsername;
    this.data.inputValue = this._interactionService.formDataWeight.weightName;
    this.data.weightDisplayMode = this._interactionService.formDataWeight.weightPublic;
    this._interactionService.showWeightDetailsTable = false;
    this.dialogRef.close(this.data);
  }

  changeWeightDisplayModeCheckedState() {
    if (this.weightDisplayModeValue == true) {
      this._interactionService.formDataWeight.weightPublic = true;
    } else if (this.weightDisplayModeValue == false) {
      this._interactionService.formDataWeight.weightPublic = false;
    }
  }

}
