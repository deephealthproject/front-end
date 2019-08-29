import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerUserComponent } from './power-user.component';

describe('PowerUserComponent', () => {
  let component: PowerUserComponent;
  let fixture: ComponentFixture<PowerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
