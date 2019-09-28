import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  processImage(fileLocation: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/processImage');
    const payload = { location: fileLocation };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  getProjects(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/getProjects');
    return this.httpClient.get<any>(url);
  }

  addProject(projectName: string, projectId: number): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/addProject');
    const payload = {
      name: projectName,
      id: projectId
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  getDropDownDetails(taskName: string, selectorName: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/getDropDownDetails');
    const payload = {
      task: taskName,
      selector: selectorName
    }
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  getModels(): Observable<HttpResponse<any>> {
    const url = "https://virtserver.swaggerhub.com/pritt/DeepHealthToolkitAPI/1.0.0/models";
    return this.httpClient.get<any>(url);
  }

  getProperties(): Observable<HttpResponse<any>> {
    const url = "https://virtserver.swaggerhub.com/pritt/DeepHealthToolkitAPI/1.0.0/properties";
    return this.httpClient.get<any>(url);
  }

  getWeights(modelId): Observable<HttpResponse<any>> {
    const baseUrl = "https://virtserver.swaggerhub.com/pritt/DeepHealthToolkitAPI/1.0.0/weights?model_id=";
    const url = baseUrl.concat(modelId);
    return this.httpClient.get<any>(url);
  }
}
