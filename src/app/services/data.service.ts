import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = environment.apiBaseUrl;
  swaggerApiUrl = "https://virtserver.swaggerhub.com/pritt/DeepHealthToolkitAPI/1.0.0";
  
  constructor(private httpClient: HttpClient) { }

  processImage(fileLocation: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/processImage');
    const payload = { location: fileLocation };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  getProjects(): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat('/getProjects');
    return this.httpClient.get<any>(url);
  }

  addProject(projectName: string, projectId: number): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat('/addProject');
    const payload = {
      name: projectName,
      id: projectId
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  getDropDownDetails(taskName: string): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat('/getDropDownDetails?task=');
    url.concat(taskName);
    return this.httpClient.get<any>(url);
  }

  getModels(): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat('/models');
    return this.httpClient.get<any>(url);
  }

  getProperties(): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat("/properties");
    return this.httpClient.get<any>(url);
  }

  getWeights(modelId): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat("/weights?model_id=");
    url.concat(modelId);
    return this.httpClient.get<any>(url);
  }

  trainModel(selectedModel, selectedDataset, selectedProperties): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat('/train');
    const payload = {
      model_id: selectedModel,
      weigths_id: null,
      properties: selectedProperties,
      dataset: selectedDataset
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  getDatasets(): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat("/getDatasets");
    return this.httpClient.get<any>(url);
  }

  inferenceModel(selectedWeight, selectedDataset): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat('/inference');
    const payload = {
      weigths_id: selectedWeight.id,
      dataset: selectedDataset.dataset
    }
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  getStatus(processId): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat('/status?process_id=');
    url.concat(processId);
    return this.httpClient.get<any>(url);
  }
}
