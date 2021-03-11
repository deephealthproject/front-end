import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Weight } from '../components/power-user/power-user.component';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  apiUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  allowedProperties(modelId, propertyId, datasetId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat("/allowedProperties?model_id=");
    url += modelId;
    url += "&property_id=";
    url += propertyId;
    if (datasetId != undefined) {
      url += "&dataset_id=";
      url += datasetId;
    }
    return this.httpClient.get<any>(url);
  }

  //TODO
  createAllowedProperties(allowedValue: string, defaultValue: string, propertyId: number, modelId: number): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/models/');
    const payload = {
      allowed_value: allowedValue,
      default_value: defaultValue,
      property_id: propertyId,
      model_id: modelId
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
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

  //TODO
  getTasksById(taskId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat("/tasks/");
    url += taskId;
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

  uploadModel(formData): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/models/');
    return this.httpClient.post<any>(url, formData, { observe: 'response' });
  }

  uploadModelStatus(processId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/modelStatus');
    if (processId != undefined) {
      url += "?process_id=";
      url += processId;
    }
    return this.httpClient.get<any>(url);
  }

  getWeights(modelId): Observable<HttpResponse<any>> {
    console.log(modelId);
    let url = this.apiUrl.concat("/weights?model_id=");
    url += modelId;
    return this.httpClient.get<any>(url);
  }

  getWeightsArray(modelId): Observable<Weight[]> {
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

  updateWeight(weightId: number, weightName: string, modelId: number, datasetId: number, pretrained_on: number, publicWeight: boolean, users): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/weights/');
    url += weightId;
    const payload = {
      name: weightName,
      model_id: modelId,
      dataset_id: datasetId,
      pretrained_on: pretrained_on,
      public: publicWeight,
      users: users
    };
    console.log(payload);
    return this.httpClient.put<any>(url, payload, { observe: 'response' });
  }

  deleteWeight(weightId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/weights/');
    if (weightId != undefined) {
      url += weightId;
    }
    return this.httpClient.delete<any>(url);
  }

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

  uploadDataset(datasetName, taskId, datasetPath, users, publicDataset): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/datasets');
    const payload = {
      name: datasetName,
      task_id: taskId,
      path: datasetPath,
      users: users,
      public: publicDataset
    }
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  deleteDataset(datasetId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/datasets/');
    if (datasetId != undefined) {
      url += datasetId;
    }
    return this.httpClient.delete<any>(url);
  }

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

  pastTrainingProcesses(project_id): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/trainings/?project_id=');
    url += project_id;
    return this.httpClient.get<any>(url);
  }

  trainingSettings(trainingId, propertyId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/trainingSettings?training_id=');
    url += trainingId;
    if(propertyId != undefined) {
      url += '&property_id=';
      url += propertyId;
    }
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

  pastInferenceProcesses(project_id): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/inference?project_id=');
    url += project_id;
    return this.httpClient.get<any>(url);
  }

  inferenceSingle(selectedWeightId, datasetImagePath, datasetImageData, selectedProjectId): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/inferenceSingle');
    const payload = {
      modelweights_id: selectedWeightId,
      image_url: datasetImagePath,
      image_data: datasetImageData,
      project_id: selectedProjectId
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  pastInferenceSingleProcesses(project_id): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/inferenceSingle?project_id=');
    url += project_id;
    return this.httpClient.get<any>(url);
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

  getOutput(processId) {
    let url = this.apiUrl.concat("/output?process_id=");
    url += processId;
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

  projects(): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/projects');
    return this.httpClient.get<any>(url);
  }

  projectsById(projectId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/projects/');
    url += projectId;
    return this.httpClient.get<any>(url);
  }

  addProject(projectName: string, modelWeights_id: number, task_id: number, users: Map<String, String>): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/projects');
    const payload = {
      name: projectName,
      modelweights_id: modelWeights_id,
      task_id: task_id,
      users: users
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  updateProject(projectName: string, projectId: number, task_id: number, users): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/projects/');
    const payload = {
      name: projectName,
      task_id: task_id,
      users: users
    };
    url += projectId;
    console.log(payload);
    return this.httpClient.put<any>(url, payload, { observe: 'response' });
  }

  deleteProject(projectId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/projects/');
    if (projectId != undefined) {
      url += projectId;
    }
    return this.httpClient.delete<any>(url);
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
}