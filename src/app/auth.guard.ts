import { CanActivate, Router } from "@angular/router";

import { AuthService } from "./services/auth.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(): boolean {
    if (this._authService.getAuthorizationToken()) {
      return true;
    } else {
      this._router.navigate([""]);
      return false;
    }
  }
}
