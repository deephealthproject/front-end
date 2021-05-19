import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  private config: any = { ...environment };
  constructor(private http: HttpClient) {}

  public async loadConfig() {
    if ("configFile" in environment) {
      const data = await this.http
        .get(environment["configFile"])
        .toPromise()
        .then((config) => {
          this.config = Object.assign({}, environment, config);
          console.debug(
            "Configuration updated from " + environment["configFile"]
          );
        })
        .catch((reason) => {
          console.warn("Unable to load configuration from server", reason);
        });
    }
  }

  public getConfig() {
    return this.config;
  }
}
