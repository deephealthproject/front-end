import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepHealthComponent } from './deep-health.component';

describe('DeepHealthComponent', () => {
  let component: DeepHealthComponent;
  let fixture: ComponentFixture<DeepHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeepHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeepHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
