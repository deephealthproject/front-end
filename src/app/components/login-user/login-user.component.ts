import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { MatSnackBar } from '../../../../node_modules/@angular/material';

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
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.initialiseUserData();
    this.initialiseLoginButton();
  }

  @ViewChild('username') username: ElementRef;
  @ViewChild('password') password: ElementRef;

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

  openSnackBar(message) {
    this.snackBar.open(message, "close", {
      duration: 5000,
    });
  }

  login(username, password) {
    this._authService.login(username, password).subscribe(data => {
      if (data.statusText == "OK") {
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
      this.openSnackBar(this.translate.instant('login.errorBadCredentialsLogin'));
    });
  }
}
