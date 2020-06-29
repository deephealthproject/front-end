import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  private config: any = environment;
  constructor(private http: HttpClient) { }

  public async loadConfig() {
    if ("configFile" in environment) {
      try {
        const config = await this.http
          .get(environment["configFile"])
          .toPromise();
        this.config = Object.assign({}, environment, config);
        console.log(this.config);
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  getConfig() {
    return this.config;
  }
}
