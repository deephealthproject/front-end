import { TestBed, getTestBed, async } from '@angular/core/testing';

import { DataService } from './data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpResponse, HttpParams } from '@angular/common/http';
import { ExpectedConditions } from 'protractor';
import { inject } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientTestingBackend } from '@angular/common/http/testing/src/backend';

fdescribe('DataService', () => {
  let injector: TestBed;
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        DataService
      ],
    }).compileComponents();

    injector = getTestBed();
    service = injector.get(DataService);
    httpMock = injector.get(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  const dummyProjectListResponse = [
    { id: 0, name: 'firstProjectName', task_id: 1, modelweights_id: 146865, inference_id: null },
    { id: 1, name: 'secondProjectName', task_id: 1, modelweights_id: 324678, inference_id: null },
    { id: 2, name: 'thirdProjectName', task_id: 1, modelweights_id: null, inference_id: null }
  ]

  const resultDummyProject = { id: 1, name: 'secondProjectName', task_id: 1, modelweights_id: 324678, inference_id: null }

  const dummyTasksListResponse = [
    { id: 1, name: "Classification" },
    { id: 2, name: "Segmentation" }
  ]

  const dummyModelsListResponse = [
    { id: 1, name: "LeNet" },
    { id: 2, name: "vgg" }
  ]

  const dummyDatasetsListResponse = [
    { id: 1, name: "MNIST", path: "/mnt/data/DATA/mnist/mnist.yml", task_id: 1 },
    { id: 12, name: "single-image-dataset", path: "/mnt/data/backend/data/datasets/single_image_dataset_12.yml", task_id: 1 },
    { id: 13, name: "single-image-dataset", path: "/mnt/data/backend/data/datasets/single_image_dataset_13.yml", task_id: 2 }
  ]

  const dummyWeightsListResponse = [
    { "id": 137, "name": "DeepLabV3+_MNIST_2020-03-06_11:17:52" },
    { "id": 140, "name": "DeepLabV3+_MNIST_2020-03-06_11:33:26" },
    { "id": 149, "name": "DeepLabV3+_MNIST_2020-03-10_14:29:24" },
  ]

  it('should be created', () => {
    const service: DataService = TestBed.get(DataService);
    expect(service).toBeTruthy();
  });

  it('getProject() should return the list of projects', () => {
    service.projects().subscribe((res: any) => {
      expect(res).toEqual(dummyProjectListResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/projects`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProjectListResponse);
  });

  it('getProjects() should throw with an error message when API returns an error', () => {
    service.projects().subscribe({
      error(actualError) {
        expect(of(actualError)).toBeTruthy();
        expect(actualError).not.toBeNull();
        expect(actualError).not.toBeUndefined();
      }
    });

    const req = httpMock.expectOne(`${service.apiUrl}/projects`);
    expect(req.request.method).toEqual('GET');

    req.flush({ errorMessage: 'Error' }, { status: 500, statusText: 'Server Error' });
    httpMock.verify();
  });

  it('getProject(id) should return the specific project', () => {
    service.projectsById('1').subscribe((res) => {
      expect(res).toEqual(resultDummyProject);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/projects/1`);
    expect(req.request.method).toBe('GET');
    req.flush(resultDummyProject);
  });

  it('getProject(id) should match the right data', () => {
    const mockProjectListResponse = [
      { id: 0, name: 'firstProjectName', task_id: 1, modelweights_id: 146865, inference_id: null }
    ];

    service.projectsById(1).subscribe(res => {
      expect(res[0].id).toEqual(0);
      expect(res[0].name).toEqual('firstProjectName');
      expect(res[0].task_id).toEqual(1);
      expect(res[0].modelweights_id).toEqual(146865);
      expect(res[0].inference_id).toEqual(null);
      expect(res).toEqual(mockProjectListResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/projects/1`);
    req.flush(mockProjectListResponse);
  })

  it('getTask should return the specific tasks', () => {
    service.getTasks().subscribe((res) => {
      expect(res).toEqual(dummyTasksListResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasksListResponse);
  })

  it('getModels(taskId) should return the list of models', () => {
    service.getModels('1').subscribe((res) => {
      expect(res).toEqual(dummyModelsListResponse);
      expect(res[0].id).toEqual(1);
      expect(res[0].name).toEqual("LeNet");
    });

    const req = httpMock.expectOne(`${service.apiUrl}/models?task_id=1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyModelsListResponse);
  });

  it('getDatasets(taskId) should return the list of the datasets', () => {
    service.getDatasets(1).subscribe((res) => {
      expect(res).toEqual(dummyDatasetsListResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/datasets?task_id=1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDatasetsListResponse);
  });

  it('getModels(taskId) should return a collection of models', () => {
    let response;
    spyOn(service, 'getModels').and.returnValue(of(dummyModelsListResponse));

    service.getModels('1').subscribe(res => {
      response = res;
    });

    expect(response).toEqual(dummyModelsListResponse);
  });

  it('addProject should be POST and create a new project', () => {
    const newProject = { name: 'newProjectName', modelweights_id: 1, task_id: 1 };

    // service.addProject("newProjectName", 1, 1).subscribe(res => {
    //   expect(res).toEqual(newProject, 'should return the project'), fail;
    // });

    const req = httpMock.expectOne(`${service.apiUrl}/projects`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newProject);

    let expectedResponse;
    expectedResponse = new HttpResponse({
      status: 200, statusText: 'created', body: req.event(expectedResponse)
    });
  });

  it('getWeights should return the list of weights', () => {
    service.getWeights('3').subscribe(res => {
      expect(res).toEqual(dummyWeightsListResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/weights?model_id=3`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyWeightsListResponse);
  })

  it('getWeights should throw an error if model_id is not defined', () => {
    service.getWeights('undefined').subscribe(() => { }, err => {
      expect(err).toBe(`Searching for unknown is not supported`);
    });

    httpMock.expectOne(`${service.apiUrl}/weights?model_id=undefined`);
  });

});
