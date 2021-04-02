import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputIntegerComponent } from './input-integer.component';

describe('InputIntegerComponent', () => {
  let component: InputIntegerComponent;
  let fixture: ComponentFixture<InputIntegerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputIntegerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputIntegerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
