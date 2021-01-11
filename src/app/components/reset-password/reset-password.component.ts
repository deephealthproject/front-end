import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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


  constructor(public _authService: AuthService, public _interactionService: InteractionService, private router: Router,
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
    this._authService.resetPassword(email).subscribe(data => {
      this._interactionService.divSendEmail = true;
      this._interactionService.divResetPassword = false;
      this._interactionService.openSnackBar(this.translate.instant('reset-password.successSendEmailForResetPassword'));
    }, error => {
      this._interactionService.divSendEmail = false;
      this._interactionService.divResetPassword = true;
      this._interactionService.openSnackBar(this.translate.instant('reset-password.errorMessageEmailForResetPassword'));
    });
  }

  resetPassword(newPassword, resetToken) {
    this._authService.resetPasswordConfirm(newPassword, resetToken).subscribe(data => {
      if (data.statusText == "OK") {
        this._interactionService.openSnackBar(this.translate.instant('reset-password.successMessageResetPassword'));
        this._interactionService.divSendEmail = false;
        this._interactionService.divResetPassword = true;
        this.router.navigate(['']);
      }
    }, error => {
      this._interactionService.divSendEmail = true;
      this._interactionService.divResetPassword = false;
      this._interactionService.openSnackBar(this.translate.instant('reset-password.errorMessageResetPassword'));
    });
  }
}
