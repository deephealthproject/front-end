import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { InteractionService } from '../../services/interaction.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  emailValue;
  newPasswordValue;
  resetCodeValue;


  constructor(public _authService: AuthService, private _interactionService: InteractionService, private router: Router, private snackBar: MatSnackBar,
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

  openSnackBar(message) {
    this.snackBar.open(message, "close", {
      duration: 5000,
    });
  }

  goToLogin(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }

  sendEmailToResetPassword(email) {
    this._interactionService.divSendEmail = true;
    this._interactionService.divResetPassword = false;
  }

  resetPassword(newPassword, confirmNewPassword) {
    // this._interactionService.divSendEmail = false;
    // this._interactionService.divResetPassword = true;
    this._authService.resetPassword(newPassword, confirmNewPassword).subscribe(data => {
      if (data.statusText == "OK") {
        this.openSnackBar(this.translate.instant('reset-password.successMeessageResetPassword'));
        this.router.navigate(['']);
      }
    }, error => {
      this.openSnackBar(this.translate.instant('reset-password.errorMessageResetPassword'));
    });
  }
}
