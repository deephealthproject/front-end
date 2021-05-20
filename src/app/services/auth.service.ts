import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";

import { AppConfigService } from "../services/config.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private config: AppConfigService
  ) {}

  get apiUrl() {
    return this.config.getConfig()["apiBaseUrl"];
  }

  get clientID() {
    return this.config.getConfig()["clientId"];
  }

  public getAuthorizationToken(): string {
    return localStorage.getItem("accessToken");
  }

  public getRefreshToken(): string {
    return localStorage.getItem("refreshToken");
  }

  refreshToken(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/token/");
    const clientId = this.clientID;
    const data = "grant_type=refresh_token" + "&refresh_token=" + this.getRefreshToken() + "&client_id=" + clientId;
    const reqHeader = new HttpHeaders({ 'Content-Type':'application/x-www-form-urlencoded'});
    return this.httpClient.post<any>(url, data, { headers: reqHeader, observe: 'response' });
  }

  login(username: string, password: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/token/");
    const clientId = this.clientID;
    const data = "grant_type=password" + "&username="+ username + "&password=" + password + "&client_id=" + clientId;
    const reqHeader = new HttpHeaders({ 'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'});
    return this.httpClient.post<any>(url, data, { headers: reqHeader, observe: 'response' });
  }

  createUser(username, email, password, firstName, lastName): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/auth/user/');
    const payload = {
      username: username,
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName
    }
    return this.httpClient.post(url, payload, { observe: 'response'});
  }

  getCurrentUser(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/user/");
    return this.httpClient.get<any>(url);
  }

  getUsers(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/users/");
    return this.httpClient.get<any>(url);
  }

  //TODO
  getUserById(userId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat("/auth/user/");
    url += userId;
    return this.httpClient.get<any>(url);
  }

  changePassword(oldPassword: string, newPassword: string, confirmNewPassword: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/change-password/");
    const payload = {
      old_password: oldPassword,
      new_password1: newPassword,
      new_password2: confirmNewPassword
    };
    return this.httpClient.put<any>(url, payload, { observe: 'response' });
  }

  resetPassword(userEmail: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/password_reset/");
    const payload = {
      email: userEmail
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  resetPasswordConfirm(newPassword: string, resetToken: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/password_reset/confirm/");
    const payload = {
      password: newPassword,
      token: resetToken
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  updateUserData(username: string, email: string, firstName: string, lastName: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/auth/user/');
    const payload = {
      username: username,
      email: email,
      first_name: firstName,
      last_name: lastName
    };
    return this.httpClient.put<any>(url, payload, { observe: 'response' });
  }

  deleteUser(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/user/");
    return this.httpClient.delete<any>(url, { observe: 'response' });
  }

  //TODO
  convertToken(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/convert-token/");
    const clientId = this.clientID;
    const data = "grant_type=password" + "&client_id=" + clientId;
    const reqHeader = new HttpHeaders({ 'Content-Type':'application/x-www-form-urlencoded'});
    return this.httpClient.post<any>(url, data, { headers: reqHeader, observe: 'response' });
  }

  //TODO 
  revokeToken(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/revoke-token/");
    const clientId = this.clientID;
    const data = "grant_type=password" + "&client_id=" + clientId;
    const reqHeader = new HttpHeaders({ 'Content-Type':'application/x-www-form-urlencoded'});
    return this.httpClient.post<any>(url, data, { headers: reqHeader, observe: 'response' });
  }

  //TODO
  invalidateSessions(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/auth/invalidate-sessions/");
    const clientId = this.clientID;
    const data = "grant_type=password" + "&client_id=" + clientId;
    const reqHeader = new HttpHeaders({ 'Content-Type':'application/x-www-form-urlencoded'});
    return this.httpClient.post<any>(url, data, { headers: reqHeader, observe: 'response' });
  }
}