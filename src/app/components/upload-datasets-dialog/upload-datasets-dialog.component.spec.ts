import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDatasetsDialogComponent } from './upload-datasets-dialog.component';

describe('UploadDatasetsDialogComponent', () => {
  let component: UploadDatasetsDialogComponent;
  let fixture: ComponentFixture<UploadDatasetsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDatasetsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDatasetsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
