import { APP_INITIALIZER, NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AppConfigService } from "./services/config.service";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";

export function initConfigService(appConfig: AppConfigService) {
  return (): Promise<any> => {
    return appConfig.loadConfig();
  };
}

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],

  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfigService,
      deps: [AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
