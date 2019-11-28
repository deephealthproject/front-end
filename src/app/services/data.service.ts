import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  apiUrl = environment.apiBaseUrl;
  NEWswaggerApiUrl = "https://jenkins-master-deephealth-unix01.ing.unimore.it/backend";
  swaggerApiUrl = "https://virtserver.swaggerhub.com/pritt/DeepHealthToolkitAPI/1.0.0"

  constructor(private httpClient: HttpClient) { }

  processImage(fileLocation: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/processImage');
    const payload = { location: fileLocation };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  // properties(): Observable<HttpResponse<any>> {
  //   const url = this.NEWswaggerApiUrl.concat("/properties");
  //   return this.httpClient.get<any>(url);
  // }

  getTasks(): Observable<HttpResponse<any>> {
    const url = this.NEWswaggerApiUrl.concat("/tasks");
    return this.httpClient.get<any>(url);
  }

  // getModels(taskName): Observable<HttpResponse<any>> {
  //   let url = this.NEWswaggerApiUrl.concat('/models');
  //   if (taskName != undefined) {
  //     url += "?task=";
  //     url += taskName;
  //   }
  //   return this.httpClient.get<any>(url);
  // }

  getWeights(modelId): Observable<HttpResponse<any>> {
    console.log(modelId);
    // const url = this.NEWswaggerApiUrl.concat("/weights?model_id=");
    // url.concat(modelId);
    let url = this.NEWswaggerApiUrl.concat("/weights?model_id=");
    url += modelId;
    return this.httpClient.get<any>(url);
  }

  trainModel(selectedModelId, selectedWeightId, selectedProperties, selectedPretrainingId, selectedFineTuningId): Observable<HttpResponse<any>> {
    const url = this.NEWswaggerApiUrl.concat('/train');
    const payload = {
      model_id: selectedModelId,
      weigths_id: selectedWeightId,
      properties: selectedProperties,
      pretraining_id: selectedPretrainingId,
      finetuning_id: selectedFineTuningId
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  inferenceModel(selectedWeightId, selectedFineTuningId): Observable<HttpResponse<any>> {
    const url = this.swaggerApiUrl.concat('/inference');
    const payload = {
      weights_id: selectedWeightId,
      finetuning_id: selectedFineTuningId
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  status(processId): Observable<HttpResponse<any>> {
    let url = this.swaggerApiUrl.concat('/status?process_id=');
    url += processId;
    return this.httpClient.get<any>(url);
  }

  //get all the projects
  projects(): Observable<HttpResponse<any>> {
    const url = this.NEWswaggerApiUrl.concat('/projects');
    return this.httpClient.get<any>(url);
  }

  //create new project
  project(projectName: string, projectId: number, modelweights_id: number, task_id: number): Observable<HttpResponse<any>> {
    const url = this.NEWswaggerApiUrl.concat('/projects');
    const payload = {
      name: projectName,
      id: projectId,
      modelweights_id: modelweights_id,
      task:  task_id
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  //update a project
  updateProject(projectName: string, projectId: number, modelweights_id: number, task_id: number): Observable<HttpResponse<any>> {
    const url = this.NEWswaggerApiUrl.concat('/projects');
    const payload = {
      id: projectId,
      name: projectName,
      task:  task_id,
      modelweights_id: modelweights_id
    };
    return this.httpClient.put<any>(url, payload, { observe: 'response' });
  }

  getDropDownDetails(projectId, dropdownName: string): Observable<HttpResponse<any>> {
    let url = this.NEWswaggerApiUrl.concat('/dropDownDetails?project_id=');
    url += projectId;
    url += '&dropdown_name=';
    url += dropdownName;
    return this.httpClient.get<any>(url);
  }

  // getDatasets(taskName, isPretraining): Observable<HttpResponse<any>> {
  //   let url = this.NEWswaggerApiUrl.concat("/datasets?task=");
  //   url += taskName;
  //   if (isPretraining != undefined) {
  //     url += "&pretraining=";
  //     url += isPretraining;
  //   }
  //   return this.httpClient.get<any>(url);
  // }
}
