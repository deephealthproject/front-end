import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProfileDetailsDialogComponent } from './show-profile-details-dialog.component';

describe('ShowProfileDetailsDialogComponent', () => {
  let component: ShowProfileDetailsDialogComponent;
  let fixture: ComponentFixture<ShowProfileDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowProfileDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProfileDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
