import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeepHealthComponent } from './components/deep-health/deep-health.component';
import { AppTabsComponent } from './components/app-tabs/app-tabs.component';
import { PowerUserComponent } from './components/power-user/power-user.component';
import { HttpClientModule } from '@angular/common/http';
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

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const routes: Routes = [
  { path: '', component: DeepHealthComponent },
  { path: 'project', component: ProjectComponent }
];

@NgModule({
  declarations: [
    DeepHealthComponent,
    AppTabsComponent,
    PowerUserComponent,
    ProjectComponent,
    ConfirmDialogComponent,
    ConfirmDialogTrainComponent
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
    })
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
    ConfirmDialogTrainComponent
  ]
})
export class AppRoutingModule {
  constructor(public translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
}