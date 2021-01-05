import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
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


  constructor(public _authService: AuthService, public _interactionService: InteractionService, private router: Router, private snackBar: MatSnackBar,
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

  resetPassword(resetCode, newPassword) {
    // this._interactionService.divSendEmail = false;
    // this._interactionService.divResetPassword = true;
    this._authService.resetPassword(resetCode, newPassword).subscribe(data => {
      if (data.statusText == "OK") {
        this.openSnackBar(this.translate.instant('reset-password.successMeessageResetPassword'));
        this.router.navigate(['']);
      }
    }, error => {
      this.openSnackBar(this.translate.instant('reset-password.errorMessageResetPassword'));
    });
  }
}
