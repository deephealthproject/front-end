import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { InteractionService } from '../../services/interaction.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProgressSpinnerDialogComponent } from '../progress-spinner-dialog/progress-spinner-dialog.component';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  userNameValue;
  emailValue;
  firstNameValue;
  lastNameValue;
  passwordValue;
  confirmPasswordValue;
  registerButton = false;

  constructor(private _authService: AuthService, private _interactionService: InteractionService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router) {
  }

  ngOnInit() {
    this.initialiseUserData();
    this.initialiseRegisterButton();
  }

  @ViewChild('username', { static: true }) username: ElementRef;
  @ViewChild('email', { static: true }) email: ElementRef;
  @ViewChild('firstName', { static: true }) firstName: ElementRef;
  @ViewChild('lastName', { static: true }) lastName: ElementRef;
  @ViewChild('password', { static: true }) password: ElementRef;
  @ViewChild('confirmPassword', { static: true }) confirmPassword: ElementRef;

  initialiseUserData() {
    this._interactionService.usernameValue$.subscribe(
      state => {
        this.userNameValue = state;
      }
    );
    this._interactionService.emailValue$.subscribe(
      state => {
        this.emailValue = state;
      }
    );
    this._interactionService.firstNameValue$.subscribe(
      state => {
        this.firstNameValue = state;
      }
    );
    this._interactionService.lastNameValue$.subscribe(
      state => {
        this.lastNameValue = state;
      }
    );
    this._interactionService.passwordValue$.subscribe(
      state => {
        this.passwordValue = state;
      }
    );
    this._interactionService.confirmPasswordValue$.subscribe(
      state => {
        this.confirmPasswordValue = state;
      }
    )
  }

  initialiseRegisterButton() {
    this._interactionService.registerButtonState$.subscribe(
      state => {
        this.registerButton = state;
      }
    )
  }

  goToLogin(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }

  createUser(username, email, password, firstName, lastName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog.open(ProgressSpinnerDialogComponent, dialogConfig);
    this._authService.createUser(username, email, password, firstName, lastName).subscribe(data => {
      if (data.statusText == "Created") {
        this.username = data.body.username;
        this.email = data.body.email;
        this.password = data.body.password;
        this.firstName = data.body.first_name;
        this.lastName = data.body.last_name;
        console.log(data.body);
        console.log("User " + this.username + " was created");
        dialogRef.close();
        this._interactionService.openSnackBarOkRequest(this.translate.instant('register.successMessageCreatedNewUser'));
      }
    }, error => {
      dialogRef.close();
      if (error.error.username) {
        this._interactionService.openSnackBarBadRequest(this.translate.instant('register.errorMessageCreatedNewUser'));
      } else {
        this._interactionService.openSnackBarBadRequest("Error: " + error.error.Error);
      }
    });
  }
}
