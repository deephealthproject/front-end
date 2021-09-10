import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InteractionService } from '../../services/interaction.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { ShowProfileDetailsDialogComponent } from '../show-profile-details-dialog/show-profile-details-dialog.component';
import { AuthService } from '../../services/auth.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  username;

  constructor(public _interactionService: InteractionService, private _authService: AuthService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private translate: TranslateService,
    public dialog: MatDialog,
    private keycloakService: KeycloakService) {
    this.matIconRegistry.addSvgIcon(
      'user',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/person-24px.svg')
    );
  }

  ngOnInit() {
    this.initialiseLogoutButton();
    // if(localStorage.getItem('accessToken') != null) {
    //   this._interactionService.getUsername();
    // }

    this._interactionService.username = this.keycloakService.getUsername(); 
  }

  initialiseLogoutButton() {
    this._interactionService.logoutButtonState$.subscribe(
      state => {
        this._interactionService.userLoggedOut = state;
      }
    )
    if(this.keycloakService.getToken() != null)  {
      this._interactionService.userLoggedOut = true;
    }
  }

  viewProfileDetails() {
    this._authService.getCurrentUser().subscribe(data => {
      if (data != undefined || data != null) {
        this.viewProfile(data);
      }
    });
  }

  viewProfile(data) {
    this._interactionService.userProfileDetails = data;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogTitle: this.translate.instant('profile-details-dialog.dialogTitle'),
    };
    let dialogRef = this.dialog.open(ShowProfileDetailsDialogComponent, dialogConfig);
  }

  logout() {
     localStorage.removeItem('accessToken');
     localStorage.removeItem('refreshToken');
     this._interactionService.userLoggedOut = false;
    // this._interactionService.changeCheckedStateLogoutButton(false);
    // this.router.navigate(['/']);

    this.keycloakService.logout();
  }
}
