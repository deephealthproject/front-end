import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOutputDetailsDialogComponent } from './show-output-details-dialog.component';

describe('ShowOutputDetailsDialogComponent', () => {
  let component: ShowOutputDetailsDialogComponent;
  let fixture: ComponentFixture<ShowOutputDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowOutputDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOutputDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
