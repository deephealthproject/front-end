import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { InteractionService } from '../../services/interaction.service';
import { MatDialogConfig, MatDialog } from '../../../../node_modules/@angular/material';
import { ProgressSpinnerDialogComponent } from '../progress-spinner-dialog/progress-spinner-dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  emailValue;
  newPasswordValue;
  resetCodeValue;


  constructor(public _authService: AuthService, public _interactionService: InteractionService, private router: Router, public dialog: MatDialog,
    private translate: TranslateService) { }

  ngOnInit() {
    this.initialisePasswords();
  }

  initialisePasswords() {
    this._interactionService.emailValueResetPasswordValue$.subscribe(
      state => {
        this.emailValue = state;
      }
    );
    this._interactionService.newResetPasswordValue$.subscribe(
      state => {
        this.newPasswordValue = state;
      }
    );
    this._interactionService.resetCodeValue$.subscribe(
      state => {
        this.resetCodeValue = state;
      }
    );
  }

  goToLogin(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }

  sendEmailToResetPassword(email) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    this._authService.resetPassword(email).subscribe(data => {
      this._interactionService.divSendEmail = true;
      this._interactionService.divResetPassword = false;
      dialogRef.close();
      this._interactionService.openSnackBar(this.translate.instant('reset-password.successSendEmailForResetPassword'));
    }, error => {
      this._interactionService.divSendEmail = false;
      this._interactionService.divResetPassword = true;
      dialogRef.close();
      this._interactionService.openSnackBar(this.translate.instant('reset-password.errorMessageEmailForResetPassword'));
    });
  }

  resetPassword(newPassword, resetToken) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    this._authService.resetPasswordConfirm(newPassword, resetToken).subscribe(data => {
      if (data.statusText == "OK") {
        dialogRef.close();
        this._interactionService.openSnackBar(this.translate.instant('reset-password.successMessageResetPassword'));
        this._interactionService.divSendEmail = false;
        this._interactionService.divResetPassword = true;
        this.router.navigate(['']);
      }
    }, error => {
      this._interactionService.divSendEmail = true;
      this._interactionService.divResetPassword = false;
      dialogRef.close();
      this._interactionService.openSnackBar(this.translate.instant('reset-password.errorMessageResetPassword'));
    });
  }
}
