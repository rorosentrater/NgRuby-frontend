import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceComm2Component } from './service-comm2.component';

describe('ServiceComm2Component', () => {
  let component: ServiceComm2Component;
  let fixture: ComponentFixture<ServiceComm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceComm2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceComm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
