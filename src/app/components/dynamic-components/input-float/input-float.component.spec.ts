import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFloatComponent } from './input-float.component';

describe('InputFloatComponent', () => {
  let component: InputFloatComponent;
  let fixture: ComponentFixture<InputFloatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputFloatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFloatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
