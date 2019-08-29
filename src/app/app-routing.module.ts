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
    ConfirmDialogComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class AppRoutingModule { }