import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeepHealthComponent } from './components/deep-health/deep-health.component';
import { AppTabsComponent } from './components/app-tabs/app-tabs.component';
import { PowerUserComponent } from './components/power-user/power-user.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppMaterialModule } from './app-material/app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectComponent } from './components/project/project.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogTrainComponent } from './components/confirm-dialog-train/confirm-dialog-train.component';
import { CreateProjectDialogComponent } from './components/create-project-dialog/create-project-dialog.component';
import { UploadDatasetsDialogComponent } from './components/upload-datasets-dialog/upload-datasets-dialog.component';
import { UpdateWeightDialogComponent } from './components/update-weight-dialog/update-weight-dialog.component';
import { ShowOutputDetailsDialogComponent } from './components/show-output-details-dialog/show-output-details-dialog.component';
import { InterceptorService } from './services/interceptor.service';
import { AuthService } from './services/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { ShowProfileDetailsDialogComponent } from './components/show-profile-details-dialog/show-profile-details-dialog.component';
import { AuthGuard } from './auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FilterPipe } from './components/pipes/filter.pipe';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ProgressSpinnerDialogComponent } from './components/progress-spinner-dialog/progress-spinner-dialog.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const routes: Routes = [
  { path: '', component: LoginUserComponent },
  { path: 'power-user', component: PowerUserComponent, canActivate: [AuthGuard] },
  { path: 'project', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterUserComponent },
  { path: 'reset-password', component: ResetPasswordComponent }
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
    ProgressSpinnerDialogComponent
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
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    OAuthModule.forRoot()
  ],
  exports: [RouterModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
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
    ProgressSpinnerDialogComponent
  ],
  providers: [AuthService, AuthGuard,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
    }
  ]
})
export class AppRoutingModule {
  constructor(public translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
}