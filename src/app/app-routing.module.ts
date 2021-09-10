import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";

import { AppConfigService } from "./services/config.service";
import { AppMaterialModule } from "./app-material/app-material.module";
import { AppTabsComponent } from "./components/app-tabs/app-tabs.component";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./services/auth.service";
import { BooleanComponent } from "./components/dynamic-components/boolean/boolean.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogTrainComponent } from "./components/confirm-dialog-train/confirm-dialog-train.component";
import { CreateProjectDialogComponent } from "./components/create-project-dialog/create-project-dialog.component";
import { DeepHealthComponent } from "./components/deep-health/deep-health.component";
import { DeleteDialogComponent } from "./components/delete-dialog/delete-dialog.component";
import { DropdownComponent } from "./components/dynamic-components/dropdown/dropdown.component";
import { FilterPipe } from "./components/pipes/filter.pipe";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { InputFloatComponent } from "./components/dynamic-components/input-float/input-float.component";
import { InputIntegerComponent } from "./components/dynamic-components/input-integer/input-integer.component";
import { InputTextComponent } from "./components/dynamic-components/input-text/input-text.component";
import { InterceptorService } from "./services/interceptor.service";
import { LoginUserComponent } from "./components/login-user/login-user.component";
import { NgModule } from "@angular/core";
import { OAuthModule } from "angular-oauth2-oidc";
import { PowerUserComponent } from "./components/power-user/power-user.component";
import { ProcessFilterPipe } from "./components/pipes/process-filter.pipe";
import { ProgressSpinnerDialogComponent } from "./components/progress-spinner-dialog/progress-spinner-dialog.component";
import { ProjectComponent } from "./components/project/project.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RegisterUserComponent } from "./components/register-user/register-user.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { ShowOutputDetailsDialogComponent } from "./components/show-output-details-dialog/show-output-details-dialog.component";
import { ShowProfileDetailsDialogComponent } from "./components/show-profile-details-dialog/show-profile-details-dialog.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateService } from "@ngx-translate/core";
import { UpdateWeightDialogComponent } from "./components/update-weight-dialog/update-weight-dialog.component";
import { UploadDatasetsDialogComponent } from "./components/upload-datasets-dialog/upload-datasets-dialog.component";
import { CreateAllowedPropertiesDialogComponent } from './components/create-allowed-properties-dialog/create-allowed-properties-dialog.component';
import { KeycloakAuth } from './keycloak-auth.guard';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function initConfig(appConfig: AppConfigService) {
  return (): Promise<any> => {
    return appConfig.loadConfig();
  };
}

const routes: Routes = [
  { path: "", component: PowerUserComponent, canActivate: [KeycloakAuth] }, 
  { path: "power-user", component: PowerUserComponent, canActivate: [KeycloakAuth] },
  { path: "project", component: ProjectComponent, canActivate: [KeycloakAuth] },
  { path: "register", component: PowerUserComponent, canActivate: [KeycloakAuth] }, 
  { path: "reset-password", component: ResetPasswordComponent }
];

@NgModule({
  declarations: [
    DeepHealthComponent,
    AppTabsComponent,
    PowerUserComponent,
    ProjectComponent,
    ConfirmDialogComponent,
    ConfirmDialogTrainComponent,
    CreateProjectDialogComponent,
    UploadDatasetsDialogComponent,
    UpdateWeightDialogComponent,
    ShowOutputDetailsDialogComponent,
    RegisterUserComponent,
    LoginUserComponent,
    ShowProfileDetailsDialogComponent,
    ResetPasswordComponent,
    FilterPipe,
    DeleteDialogComponent,
    ProgressSpinnerDialogComponent,
    ProcessFilterPipe,
    DropdownComponent,
    InputTextComponent,
    InputIntegerComponent,
    InputFloatComponent,
    BooleanComponent,
    CreateAllowedPropertiesDialogComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    OAuthModule.forRoot(),
  ],
  exports: [
    RouterModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    ConfirmDialogTrainComponent,
    CreateProjectDialogComponent,
    UploadDatasetsDialogComponent,
    UpdateWeightDialogComponent,
    ShowOutputDetailsDialogComponent,
    ShowProfileDetailsDialogComponent,
    DeleteDialogComponent,
    ProgressSpinnerDialogComponent,
    DropdownComponent,
    InputIntegerComponent,
    InputFloatComponent,
    InputTextComponent,
    BooleanComponent,
    CreateAllowedPropertiesDialogComponent
  ],
  providers: [
    AppConfigService,
    AuthService,
    AuthGuard,
    KeycloakAuth,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
})
export class AppRoutingModule {
  constructor(public translate: TranslateService) {
    translate.setDefaultLang("en");
    translate.use("en");
  }
}
