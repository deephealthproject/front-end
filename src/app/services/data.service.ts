import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { AppConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Weight } from '../components/power-user/power-user.component';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(
    private httpClient: HttpClient,
    private config: AppConfigService
  ) { }

  get apiUrl() {
    return this.config.getConfig()["apiBaseUrl"];
  }


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

  createAllowedProperties(allowedValue: string, defaultValue: string, propertyId: number, modelId: number, datasetId: number): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/allowedProperties/');
    const payload = {
      allowed_value: allowedValue,
      default_value: defaultValue,
      property_id: propertyId,
      model_id: modelId,
      dataset_id: datasetId
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  updateAllowedProperties(allowedPropertyId: number, allowedValue: string, defaultValue: string, propertyId: number, modelId: number, datasetId: number): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/allowedProperties/');
    url += allowedPropertyId;
    const payload = {
      allowed_value: allowedValue,
      default_value: defaultValue,
      property_id: propertyId,
      model_id: modelId,
      dataset_id: datasetId
    };
    return this.httpClient.put<any>(url, payload, { observe: 'response' });
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

  createModel(modelName: string, task_id: number): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/models');
    const payload = {
      name: modelName,
      task_id: task_id
    };
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  uploadModelWeight(formData): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/weights/');
    return this.httpClient.post<any>(url, formData, { observe: 'response' });
  }

  uploadModelWeightFromURL(modelWeightName: string, model_id: number, dataset_id: number, onnx_url: string, layer_to_remove: string, classes: string): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/weights/');
    const payload = {
      name: modelWeightName,
      model_id: model_id,
      dataset_id: dataset_id,
      onnx_url: onnx_url,
      layer_to_remove: layer_to_remove,
      classes: classes
    }
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  uploadModelWeightStatus(processId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/weightsStatus');
    if (processId != undefined) {
      url += "?process_id=";
      url += processId;
    }
    return this.httpClient.get<any>(url);
  }

  getWeights(modelId, datasetId): Observable<HttpResponse<any>> {
    console.log(modelId);
    let url = this.apiUrl.concat("/weights?model_id=");
    url += modelId;
    if (datasetId != undefined) {
      url += '&dataset_id=';
      url += datasetId;
    }
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

  downloadWeight(weightId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/weightsDownload?modelweights_id=');
    if (weightId != undefined) {
      url += weightId;
    }
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/onnx' });
    return this.httpClient.get<any>(url, { headers: reqHeader, responseType: 'blob' as 'json', observe: 'response' });
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

  uploadDataset(datasetName, taskId, datasetPath, users, publicDataset, colorTypeImage, colorTypeGroundTruth): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/datasets');
    const payload = {
      name: datasetName,
      task_id: taskId,
      path: datasetPath,
      users: users,
      public: publicDataset,
      ctype: colorTypeImage,
      ctype_gt: colorTypeGroundTruth
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

  trainModel(selectedDatasetId, selectedWeightId, selectedProperties, selectedProjectId, taskManager): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/train');
    const payload = {
      dataset_id: selectedDatasetId,
      weights_id: selectedWeightId,
      properties: selectedProperties,
      project_id: selectedProjectId,
      task_manager: taskManager
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  trainModelStreamFlow(selectedDatasetId, selectedWeightId, selectedProperties, selectedProjectId, taskManager, env): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/inference');
    const payload = {
      dataset_id: selectedDatasetId,
      weights_id: selectedWeightId,
      project_id: selectedProjectId,
      properties: selectedProperties,
      task_manager: taskManager,
      env: env
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  pastTrainingProcesses(project_id, modelweights_id): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/trainings/?project_id=');
    url += project_id;
    if (modelweights_id != null || modelweights_id != undefined) {
      url += '&modelweights_id=';
      url += modelweights_id;
    }
    return this.httpClient.get<any>(url);
  }

  trainingSettings(trainingId, propertyId): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/trainingSettings?training_id=');
    if (trainingId != undefined) {
      url += trainingId;
    }
    if (propertyId != undefined) {
      url += '&property_id=';
      url += propertyId;
    }
    return this.httpClient.get<any>(url);
  }

  inferenceModelStreamFlow(selectedWeightId, selectedDatasetId, selectedProjectId, taskManager, env): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/inference');
    const payload = {
      modelweights_id: selectedWeightId,
      dataset_id: selectedDatasetId,
      project_id: selectedProjectId,
      task_manager: taskManager,
      env: env
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  inferenceModel(selectedWeightId, selectedDatasetId, selectedProjectId, taskManager): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/inference');
    const payload = {
      modelweights_id: selectedWeightId,
      dataset_id: selectedDatasetId,
      project_id: selectedProjectId,
      task_manager: taskManager
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  pastInferenceProcesses(project_id): Observable<HttpResponse<any>> {
    let url = this.apiUrl.concat('/inference?project_id=');
    url += project_id;
    return this.httpClient.get<any>(url);
  }

  inferenceSingle(selectedWeightId, datasetImagePath, datasetImageData, selectedProjectId, taskManager): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/inferenceSingle');
    const payload = {
      modelweights_id: selectedWeightId,
      image_url: datasetImagePath,
      image_data: datasetImageData,
      project_id: selectedProjectId,
      task_manager: taskManager
    }
    console.log(payload);
    return this.httpClient.post<any>(url, payload, { observe: 'response' });
  }

  inferenceSingleStreamFlow(selectedWeightId, datasetImagePath, datasetImageData, selectedProjectId, taskManager, env): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/inferenceSingle');
    const payload = {
      modelweights_id: selectedWeightId,
      image_url: datasetImagePath,
      image_data: datasetImageData,
      project_id: selectedProjectId,
      task_manager: taskManager,
      env: env
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

  addProject(projectName: string, task_id: number, users: Map<String, String>): Observable<HttpResponse<any>> {
    const url = this.apiUrl.concat('/projects');
    const payload = {
      name: projectName,
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