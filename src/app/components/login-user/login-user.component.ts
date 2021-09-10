import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerDialogComponent } from '../progress-spinner-dialog/progress-spinner-dialog.component';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {
  userNameValue;
  firstNameValue;
  lastNameValue;
  passwordValue;
  disabledLoginButton = false;

  constructor(private _authService: AuthService, private _interactionService: InteractionService,
    private router: Router,
    public dialog: MatDialog,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.initialiseUserData();
    this.initialiseLoginButton();
  }

  @ViewChild('username', { static: true }) username: ElementRef;
  @ViewChild('password', { static: true }) password: ElementRef;

  initialiseUserData() {
    this._interactionService.usernameValue$.subscribe(
      state => {
        this.userNameValue = state;
      }
    );
    this._interactionService.passwordValue$.subscribe(
      state => {
        this.passwordValue = state;
      }
    );
  }

  initialiseLoginButton() {
    this._interactionService.loginButtonState$.subscribe(
      state => {
        this.disabledLoginButton = state;
      }
    )
  }

  goToRegister(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }

  goToResetPassword(pageName: string) {
    this._interactionService.divSendEmail = false;
    this._interactionService.divResetPassword = true;
    this.router.navigate([`${pageName}`]);
  }

  login(username, password) {
    let encodedPassword = encodeURIComponent(password);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    this._authService.login(username, encodedPassword).subscribe(data => {
      if (data.statusText == "OK") {
        dialogRef.close();
        localStorage.setItem('accessToken', data.body.access_token);
        localStorage.setItem('refreshToken', data.body.refresh_token);
        localStorage.setItem('username', username);
        this.router.navigate(['/power-user']);
        this._interactionService.username = username;
        this._interactionService.showUserTab("Home Page");
        this._interactionService.showProjectTab(null);
        this._interactionService.changeCheckedStateLogoutButton(true);
      }
    }, error => {
      dialogRef.close();
      this.userNameValue = "";
      this.passwordValue = "";
      this._interactionService.openSnackBarBadRequest(this.translate.instant('login.errorBadCredentialsLogin'));
    });
  }
}
