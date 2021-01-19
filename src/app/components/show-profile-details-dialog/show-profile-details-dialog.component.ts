import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { InteractionService } from '../../services/interaction.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogTrainComponent } from '../confirm-dialog-train/confirm-dialog-train.component';
import { Router } from '@angular/router';
import { ProgressSpinnerDialogComponent } from '../progress-spinner-dialog/progress-spinner-dialog.component';

export interface ProfileDetailsData {
  dialogTitle: string;
  inputValueUsername: string;
  inputValueFirstName: string;
  inputValueLastName: string;
  inputValueEmail: string;
}

@Component({
  selector: 'app-show-profile-details-dialog',
  templateUrl: './show-profile-details-dialog.component.html',
  styleUrls: ['./show-profile-details-dialog.component.css']
})
export class ShowProfileDetailsDialogComponent implements OnInit {
  dialogTitle: string;
  inputValueUsername: string;
  inputValueFirstName: string;
  inputValueLastName: string;
  inputValueEmail: string;
  oldPasswordValue: string;
  newPasswordValue: string;
  confirmNewPasswordValue: string;
  isChangePasswordClicked: Boolean = false;
  disabledChangePasswordButton: Boolean = false;
  disabledActionButton: Boolean = false
  isUpdateProfileClicked: Boolean = false;
  disabledUpdateProfileButton: Boolean = false;
  disabledDeleteAccountButton: Boolean = false;

  constructor(public dialogRef: MatDialogRef<ShowProfileDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileDetailsData, public _authService: AuthService, public _interactionService: InteractionService,
    public translate: TranslateService,
    public dialog: MatDialog,
    private router: Router) {
    this.dialogTitle = data.dialogTitle;
  }

  ngOnInit() {
    this.initialisePasswordFields();
  }

  initialisePasswordFields() {
    this._interactionService.oldPasswordValue$.subscribe(
      state => {
        this.oldPasswordValue = state;
      }
    );

    this._interactionService.newPasswordValue$.subscribe(
      state => {
        this.newPasswordValue = state;
      }
    );

    this._interactionService.confirmNewPasswordValue$.subscribe(
      state => {
        this.confirmNewPasswordValue = state;
      }
    );
  }

  save() {
    this.data.inputValueUsername = this._interactionService.userProfileDetails.username;
    this.data.inputValueFirstName = this._interactionService.userProfileDetails.first_name;
    this.data.inputValueLastName = this._interactionService.userProfileDetails.last_name;
    this.data.inputValueEmail = this._interactionService.userProfileDetails.email;
    this.dialogRef.close(this.data);
  }

  changePassword() {
    this.isChangePasswordClicked = true;
    this.isUpdateProfileClicked = false;
    this.disabledChangePasswordButton = true;
    this.disabledUpdateProfileButton = false;
    this.disabledDeleteAccountButton = true;
    this.disabledActionButton = true;
  }

  savePassword(oldPassword, newPassword, confirmNewPassword) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    this._authService.changePassword(oldPassword, newPassword, confirmNewPassword).subscribe(data => {
      if (data.statusText == "OK") {
        dialogRef.close();
        this._interactionService.openSnackBar(this.translate.instant('profile-details-dialog.successMeessageChangePassword'));
        this.isChangePasswordClicked = false;
        this.disabledChangePasswordButton = false;
        this.disabledDeleteAccountButton = false;
        this.disabledActionButton = false;
        this.oldPasswordValue = null;
        this.newPasswordValue = null;
        this.confirmNewPasswordValue = null;
      }
    }, error => {
      dialogRef.close();
      if (error.error.old_password) {
        this._interactionService.openSnackBar(this.translate.instant('profile-details-dialog.errorMessageOldPassword'));
      }
      if (error.error.non_field_errors) {
        this._interactionService.openSnackBar(this.translate.instant('profile-details-dialog.errorMessageInvalidNewPassword'));
      }
    });
  }

  cancelChangePassword() {
    this.isChangePasswordClicked = false;
    this.disabledChangePasswordButton = false;
    this.disabledUpdateProfileButton = false;
    this.disabledDeleteAccountButton = false;
    this.disabledActionButton = false;
    this.oldPasswordValue = null;
    this.newPasswordValue = null;
    this.confirmNewPasswordValue = null;
  }

  updateProfile() {
    this.isUpdateProfileClicked = true;
    this.isChangePasswordClicked = false;
    this.disabledUpdateProfileButton = true;
    this.disabledChangePasswordButton = false;
    this.disabledDeleteAccountButton = true;
    this.disabledActionButton = true;
    this.oldPasswordValue = null;
    this.newPasswordValue = null;
    this.confirmNewPasswordValue = null;
  }

  saveUpdateProfile(username, email, firstName, lastName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);

    this._authService.updateUserData(username, email, firstName, lastName).subscribe(data => {
      if (data.statusText == "OK") {
        dialogRef.close();
        this._interactionService.resetUserProfileDetails(data.body);
        this._interactionService.openSnackBar(this.translate.instant('profile-details-dialog.succesMessageUpdateProfile'));
        this.isUpdateProfileClicked = false;
        this.disabledUpdateProfileButton = false;
        this.disabledDeleteAccountButton = false;
        this.disabledActionButton = false;
      }
    }), error => {
      dialogRef.close();
      this._interactionService.openSnackBar("Error:" + error.statusText);
    }
  }

  cancelUpdateProfile() {
    this._authService.getCurrentUser().subscribe(data => {
      if (data != undefined || data != null) {
        this.resetProfileData(data);
      }
    });
  }

  resetProfileData(data) {
    this._interactionService.resetUserProfileDetails(data);
    this.isUpdateProfileClicked = false;
    this.disabledUpdateProfileButton = false;
    this.disabledChangePasswordButton = false;
    this.disabledDeleteAccountButton = false;
    this.disabledActionButton = false;
  }

  deleteAccount() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('profile-details-dialog.deleteAccountDialogTitle'),
      dialogContent: this.translate.instant('profile-details-dialog.areYouSureDeleteAccount'),
      trainingTime: ""
    }

    const dialogConfigSpinner = new MatDialogConfig();
    dialogConfigSpinner.disableClose = true;
    dialogConfigSpinner.autoFocus = true;

    let dialogRef = this.dialog.open(ConfirmDialogTrainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        let dialogRefSpinner = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfigSpinner);
        this._authService.deleteUser().subscribe(data => {
          if (data.status == 204) {
            console.log(data);
            dialogRefSpinner.close();
            this._interactionService.openSnackBar(this.translate.instant('profile-details-dialog.succesMessageDeleteAccount'));
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            this._interactionService.userLoggedOut = false;
            this.dialog.closeAll();
            this.router.navigate(['/']);
          }
        }, error => {
          dialogRefSpinner.close();
          this._interactionService.openSnackBar("Error:" + error.statusText);
        })
      }
      else {
        console.log('Canceled');
      }
    });
  }
}
