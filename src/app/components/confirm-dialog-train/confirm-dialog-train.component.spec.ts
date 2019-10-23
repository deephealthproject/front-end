import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogTrainComponent } from './confirm-dialog-train.component';

describe('ConfirmDialogTrainComponent', () => {
  let component: ConfirmDialogTrainComponent;
  let fixture: ComponentFixture<ConfirmDialogTrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogTrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
