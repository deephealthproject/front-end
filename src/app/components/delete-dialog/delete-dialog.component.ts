import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '../../../../node_modules/@angular/material';
import { DataService } from '../../services/data.service';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { ItemToDelete } from '../power-user/power-user.component';
import { InteractionService } from '../../services/interaction.service';

export interface DeleteDialogData {
  dialogTitle: string;
  dialogDeletedItem: string;
  dialogContent: string;
  dialogDeletedItemInputValue: string;
  deletedItemInputPlaceHolder: string;
  deleteObject: ItemToDelete;
}

export enum PermissionStatus {
  OWN,
  VIEW
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {
  dialogTitle: string;
  dialogDeletedItem: any;
  dialogContent: string;
  dialogDeletedItemInputValue: string;
  deletedItemInputPlaceHolder: string;
  deleteObject: ItemToDelete;

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogComponent, private _dataService: DataService, public _interactionService: InteractionService,
    public translate: TranslateService) {
    this.dialogTitle = data.dialogTitle;
    this.dialogDeletedItem = data.dialogDeletedItem;
    this.dialogContent = data.dialogContent;
    this.deletedItemInputPlaceHolder = data.deletedItemInputPlaceHolder;
    this.dialogDeletedItemInputValue = data.dialogDeletedItemInputValue;
    this.deleteObject = data.deleteObject;
  }

  ngOnInit() {
  }

  deleteItem() {
    if (this.dialogDeletedItem == this.dialogDeletedItemInputValue) {
      switch (this.deleteObject.type) {
        case "project":
          this._dataService.deleteProject(this.deleteObject.deletedItem.id).subscribe(data => {
            this._interactionService.openSnackBar(this.translate.instant('delete-dialog.succesMessageDeleteProject'));
            this.dialogRef.close(this.data);
          }, error => {
            this._interactionService.openSnackBar("Error: " + error.error.Error);
          });
          break;
        case "dataset":
          this._dataService.deleteDataset(this.deleteObject.deletedItem.id).subscribe(data => {
            this._interactionService.openSnackBar(this.translate.instant('delete-dialog.succesMessageDeleteDataset'));
            this.dialogRef.close(this.data);
          }, error => {
            this._interactionService.openSnackBar("Error: " + error.statusText);
          });
          break;
        case "weight":
          this._dataService.deleteWeight(this.deleteObject.deletedItem.weightId).subscribe(data => {
            this._interactionService.openSnackBar(this.translate.instant('delete-dialog.succesMessageDeleteWeight'));
            this.dialogRef.close(this.data);
          }, error => {
            this._interactionService.openSnackBar("Error: " + error.statusText);
          });
          break;
        case "users":
          this._interactionService.usersAssociatedArray.push({ "username": this._interactionService.projectOwner, "permission": PermissionStatus[0] });
          this.dialogDeletedItem.forEach(selectedAssociatedUser => {
            this._interactionService.usersAssociatedArray = this._interactionService.usersAssociatedArray.filter(item => item.username != selectedAssociatedUser)
            this._dataService.updateProject(this.deleteObject.deletedItem, this._interactionService.currentProject.id, this._interactionService.currentProject.task_id,
              this._interactionService.usersAssociatedArray).subscribe(data => {
                switch (this.dialogDeletedItem.length) {
                  case 1:
                    this._interactionService.openSnackBar(this.translate.instant('delete-dialog.succesMessageDeleteAssociatedUser'));
                    break;
                  case 2:
                    this._interactionService.openSnackBar(this.translate.instant('delete-dialog.succesMessageDeleteAssociatedUsers'));
                    break;
                }
                this._interactionService.usersAssociatedArray = this._interactionService.usersAssociatedArray.filter(item => item.username != this._interactionService.projectOwner);
                this._interactionService.usersList.push({ "username": selectedAssociatedUser, "permission": PermissionStatus[1] });
                this.dialogRef.close(this.data);
              }, error => {
                this._interactionService.usersAssociatedArray.push({ "username": selectedAssociatedUser, "permission": PermissionStatus[1] });
                this._interactionService.openSnackBar("Error: " + error.statusText);
              });
          })
          break;
      }
    } else {
      this._interactionService.openSnackBar(this.translate.instant('delete-dialog.errorMessageDeleteItem'));
    }
  }
}
