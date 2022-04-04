// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Base URL of the back-end server
  // apiBaseUrl: "http://localhost:8000/backend",
  // // OAuth Client ID that you can get registering the front-end at <apiBaseUrl>/backend/auth/applications/
  // clientId: "",
  // 'configFile' is the path of a JSON resource containing
  // the configuration properties that should be loaded
  // and set without rebuild (e.g., apiBaseUrl, clientId).
  // They overwrite the default environment settings defined at build-time
  // and are exposed by the `AppConfigService.getConfig()` method.
  //configFile: "/assets/config.json",
  apiBaseUrl: "https://jenkins-master-deephealth-unix01.ing.unimore.it/backend",
  clientId: "BnEOyrMrJ9qeMHeZO7lzF7kgpIFBLm2ZtBd8achT",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
