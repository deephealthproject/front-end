import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Weight } from '../components/power-user/power-user.component';

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
    let url = this.apiUrl.concat("/weights?model_id=");
    url += modelId;
    return this.httpClient.get<any>(url);
  }

  getWeights2(modelId): Observable<Weight[]> {
    console.log(modelId);
    let url = this.apiUrl.concat("/weights?model_id=");
    url += modelId;
    return this.httpClient.get<Weight[]>(url);
  }

  getWeightById(weightId): Observable<HttpResponse<any>> {
    console.log(weightId);
    let url = this.apiUrl.concat("/weights/");
    url += weightId;
    return this.httpClient.get<any>(url);
  }

  getOutput(processId) {
    console.log(processId);
    let url = this.apiUrl.concat("/output?process_id=");
    url += processId;
    return this.httpClient.get<any>(url);
  }

  updateWeight(weightId: number, datasetId: number, weightName: string, modelId: number, pretrained_on: number): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/weights');
    const payload = {
      id: weightId,
      dataset_id: datasetId,
      name: weightName,
      model_id: modelId,
      pretrained_on: pretrained_on,
    };
    console.log(payload);
    return this.httpClient.put<any>(url, payload, { observe: 'response' });
  }

  //weigths for swagger-stub
  // getWeights(modelId: number): Observable<HttpResponse<any>> {
  //   let url = this.apiUrl.concat("/weights");
  //   let payload = {
  //     model_id: modelId
  //   }
  //   return this.httpClient.post<any>(url, payload, { observe: 'response' });
  // }

  trainModel(selectedDatasetId, selectedModelId, selectedWeightId, selectedProperties, selectedProjectId): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/train');
    const payload = {
      model_id: selectedModelId,
      project_id: selectedProjectId,
      properties: selectedProperties,
      weights_id: selectedWeightId,
      dataset_id: selectedDatasetId
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  //todo
  trainingSettings(modelWeightsId, propertyId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/trainingSettings?modelweights_id=');
    url += modelWeightsId;
    url += '&property_id=';
    url += propertyId;
    return this.httpClient.get<any>(url);
  }

  inferenceModel(selectedWeightId, selectedDatasetId, selectedProjectId): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/inference');
    const payload = {
      modelweights_id: selectedWeightId,
      dataset_id: selectedDatasetId,
      project_id: selectedProjectId
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  inferenceSingle(selectedWeightId, datasetImagePath, selectedProjectId): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/inferenceSingle');
    const payload = {
      modelweights_id: selectedWeightId,
      image_url: datasetImagePath,
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

  statusCompleteForEvolution(processId, fullStatus): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/status?process_id=');
    url += processId;
    url += "&full=";
    url += fullStatus;
    return this.httpClient.get<any>(url);
  }

  output(processId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/output?process_id=');
    url += processId;
    return this.httpClient.get<any>(url);
  }

  stopProcess(processId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/stopProcess');
    const payload = {
      process_id: processId
    }
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  //status for swagger-stub
  // status(processId): Observable<HttpResponse<any>> {
  //   let url = this.apiUrl.concat('/status');
  //   const payload = {
  //     process_id: processId
  //   }
  //   return this.httpClient.post<any>(url, payload, { observe: 'response' });
  // }

  projects(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/projects');
    return this.httpClient.get<any>(url);
  }

  projectsById(projectId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/projects/');
    url += projectId;
    return this.httpClient.get<any>(url);
  }

  addProject(projectName: string, modelWeights_id: number, task_id: number): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/projects');
    const payload = {
      name: projectName,
      modelweights_id: modelWeights_id,
      task_id: task_id
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

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

  getDatasets(taskId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/datasets');
    if (taskId != undefined) {
      url += "?task_id=";
      url += taskId;
    }
    console.log(url);
    return this.httpClient.get<any>(url);
  }

  getDatasetById(datasetId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/datasets/');
    url += datasetId;
    return this.httpClient.get<any>(url);
  }

  uploadDataset(datasetName, taskId, datasetPath): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/datasets');
    const payload = {
      name: datasetName,
      task_id: taskId,
      path: datasetPath
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }
}
