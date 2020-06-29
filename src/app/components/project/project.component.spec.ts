import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectComponent } from './project.component';
import { DebugElement } from '../../../../node_modules/@angular/core';
import { By } from '../../../../node_modules/@angular/platform-browser';
import { DataService } from '../../services/data.service';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectComponent ],
      providers: [ DataService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Train button should call method trainModel()', () => {
    spyOn(component, 'trainModel');

    let trainButton = fixture.debugElement.nativeElement.querySelector('button');
    trainButton.click();
    fixture.whenStable().then(() => {
      expect(component.trainModel).toHaveBeenCalled();
    });
  });
});
