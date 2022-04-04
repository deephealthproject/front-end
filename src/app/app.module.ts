import { APP_INITIALIZER, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: 'https://identity.test-odh.di.unito.it/auth/',
        realm: 'opendeephealth',
        clientId: 'deephealth-toolkit',
      },
      initOptions: {
        checkLoginIframe: true,
        checkLoginIframeInterval: 25, 
      },
      loadUserProfileAtStartUp: true 
    });
}

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, KeycloakAngularModule],

  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService], 
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
