import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAllowedPropertiesDialogComponent } from './create-allowed-properties-dialog.component';

describe('CreateAllowedPropertiesDialogComponent', () => {
  let component: CreateAllowedPropertiesDialogComponent;
  let fixture: ComponentFixture<CreateAllowedPropertiesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAllowedPropertiesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAllowedPropertiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
