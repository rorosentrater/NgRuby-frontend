import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceComm1Component } from './service-comm1.component';

describe('ServiceComm1Component', () => {
  let component: ServiceComm1Component;
  let fixture: ComponentFixture<ServiceComm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceComm1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceComm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
