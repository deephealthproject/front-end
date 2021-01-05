import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { throwError, empty } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  refreshingAccessToken: Boolean;

  constructor(public _authService: AuthService, private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (this._authService.getAuthorizationToken() != null || this._authService.getAuthorizationToken() != undefined) {
      let requestCloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this._authService.getAuthorizationToken()}`
        }
      })
      return next.handle(requestCloned).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          if (error.status == 401 && error.error.detail == "Invalid token header. No credentials provided." && !this.refreshingAccessToken) {
            return this.refreshAccessToken().pipe(
              catchError((error: any) => {
                console.log(error);
                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = true;
                dialogConfig.autoFocus = true;
                dialogConfig.data = {
                  dialogTitle: this.translate.instant('login.errorMessageSessionExpired'),
                }
                if (this.dialog.openDialogs.length == 0) {
                  let dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
                }
                return empty();
              }))
          }
          return throwError(error);
        })
      )
    } else {
      return next.handle(request);
    }
  }

  refreshAccessToken() {
    this.refreshingAccessToken = true;
    return this._authService.refreshToken().pipe(
      tap(() => {
        this.refreshingAccessToken = false;
        console.log("Access token refreshed!");
      })
    )
  }
}
