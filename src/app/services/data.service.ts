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

  allowedProperties(modelId, propertyId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat("/allowedProperties?model_id=");
    url += modelId;
    url += "&property_id=";
    url += propertyId;
    return this.httpClient.get<any>(url);
  }

  properties(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/properties");
    return this.httpClient.get<any>(url);
  }

  propertiesById(propertyId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat("/properties/");
    url += propertyId;
    return this.httpClient.get<any>(url);
  }

  getTasks(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat("/tasks");
    return this.httpClient.get<any>(url);
  }

  getModels(taskId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/models');
    if (taskId != undefined) {
      url += "?task_id=";
      url += taskId;
    }
    console.log(url);
    return this.httpClient.get<any>(url);
  }

  //models for swagger-stub
  // getModels(taskId): Observable<HttpResponse<any>> {
  //   let url = this.apiUrl.concat('/models');
  //   const payload = {
  //     task_id: taskId
  //   }
  //   return this.httpClient.post<any>(url, payload, { observe: 'response' });
  // }

  getWeights(modelId): Observable<HttpResponse<any>> {
    console.log(modelId);
    // const url = this.NEWswaggerApiUrl.concat("/weights?model_id=");
    // url.concat(modelId);
    let url = this.apiUrl.concat("/weights?model_id=");
    url += modelId;
    return this.httpClient.get<any>(url);
  }

  //weigths for swagger-stub
  // getWeights(modelId: number): Observable<HttpResponse<any>> {
  //   let url = this.apiUrl.concat("/weights");
  //   let payload = {
  //     model_id: modelId
  //   }
  //   return this.httpClient.post<any>(url, payload, { observe: 'response' });
  // }

  trainModel(selectedDatasetId, selectedModelId, selectedWeightId, selectedProperties, selectedPretrainingId, selectedProjectId): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/train');
    const payload = {
      dataset_id: selectedDatasetId,
      model_id: selectedModelId,
      pretraining_id: selectedPretrainingId,
      project_id: selectedProjectId,
      properties: selectedProperties,
      weights_id: selectedWeightId
      //finetuning_id: selectedFineTuningId
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  trainingSettings(modelWeightsId, propertyId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/trainingSettings?modelweights_id=');
    url += modelWeightsId;
    url += '&property_id=';
    url += propertyId;
    return this.httpClient.get<any>(url);
  }

  inferenceModel(selectedModelWeightsId, selectedDatasetId, selectedProjectId): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/inference');
    const payload = {
      modelweights_id: selectedModelWeightsId,
      dataset_id: selectedDatasetId,
      project_id: selectedProjectId
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  status(processId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/status?process_id=');
    url += processId;
    return this.httpClient.get<any>(url);
  }

  //status for swagger-stub
  // status(processId): Observable<HttpResponse<any>> {
  //   let url = this.apiUrl.concat('/status');
  //   const payload = {
  //     process_id: processId
  //   }
  //   return this.httpClient.post<any>(url, payload, { observe: 'response' });
  // }

  //get all the projects
  projects(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/projects');
    return this.httpClient.get<any>(url);
  }

  //create new project
  addProject(projectName: string, modelWeights_id: number, task_id: number): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/projects');
    const payload = {
      name: projectName,
      modelweights_id: modelWeights_id,
      task_id: task_id
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  //update a project
  updateProject(projectName: string, projectId: number, modelWeights_id: number, task_id: number): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/projects');
    const payload = {
      id: projectId,
      name: projectName,
      task_id: task_id,
      modelweights_id: modelWeights_id
    };
    console.log(payload);
    return this.httpClient.put<any>(url, payload, { observe: 'response' });
  }

  //dropdown for swagger-stub
  getDropDownDetails(projectId, dropdownName: string): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/dropDownDetails');
    const payload = {
      project_id: projectId,
      dropdown_name: dropdownName
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  // getDropDownDetails(projectId, dropdownName: string): Observable<HttpResponse<any>> {
  //   let url = this.apiUrl.concat('/dropDownDetails?project_id=');
  //   url += projectId;
  //   url += '&dropdown_name=';
  //   url += dropdownName;
  //   return this.httpClient.get<any>(url);
  // }

  getDatasets(): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat("/datasets");
    return this.httpClient.get<any>(url);
  }


}
