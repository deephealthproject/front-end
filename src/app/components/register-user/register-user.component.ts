import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { InteractionService } from '../../services/interaction.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../power-user/power-user.component';

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
  users: Array<User> = [];
  currentUser: User;
  registerButton = false;

  constructor(private _authService: AuthService, private _interactionService: InteractionService,
    private translate: TranslateService,
    private router: Router) {
  }

  ngOnInit() {
    this.initialiseUserData();
    this.initialiseRegisterButton();
  }

  @ViewChild('username') username: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('firstName') firstName: ElementRef;
  @ViewChild('lastName') lastName: ElementRef;
  @ViewChild('password') password: ElementRef;
  @ViewChild('confirmPassword') confirmPassword: ElementRef;

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
    if (username == null || username == undefined || password == null || password == undefined || email == null || email == undefined) {
      this._interactionService.openSnackBar(this.translate.instant('register.errorFieldsAreIncomplete'));
    }
    else {
      this._authService.createUser(username, email, password, firstName, lastName).subscribe(data => {
        if (data.statusText == "Created") {
          if (data.body.username) {
            let thatUserExist = false;
            for (let currentUser of this.users) {
              if (currentUser.username == data.body.username)
                thatUserExist = true;
            }
            if (thatUserExist == false) {
              this.username = data.body.username;
              this.email = data.body.email;
              this.password = data.body.password;
              this.firstName = data.body.first_name;
              this.lastName = data.body.last_name;
              console.log(data.body);
              console.log("User " + this.username + " was created");
              this._interactionService.openSnackBar(this.translate.instant('register.successMessageCreatedNewUser'));
            } else {
              console.log('User already exists');
              this._interactionService.openSnackBar(this.translate.instant('register.errorMessageCreatedNewUser'));
            }
          }
        }
      }, error => {
        this._interactionService.openSnackBar("Error: " + error.statusText);
        this._interactionService.openSnackBar(this.translate.instant('register.errorMessageCreatedNewUser'));
      });
    }
  }
}
