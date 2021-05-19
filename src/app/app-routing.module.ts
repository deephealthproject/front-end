import { AppConfigService } from "./services/config.service";

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
    ProgressSpinnerDialogComponent,
    ProcessFilterPipe,
    DropdownComponent,
    InputTextComponent,
    InputIntegerComponent,
    InputFloatComponent,
    BooleanComponent
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
    ProgressSpinnerDialogComponent,
    DropdownComponent, 
    InputIntegerComponent, 
    InputFloatComponent, 
    InputTextComponent,
    BooleanComponent
  ],
  providers: [
    AppConfigService,
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