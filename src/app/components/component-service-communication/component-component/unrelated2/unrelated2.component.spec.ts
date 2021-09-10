import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Unrelated2Component } from './unrelated2.component';

describe('Unrelated2Component', () => {
  let component: Unrelated2Component;
  let fixture: ComponentFixture<Unrelated2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Unrelated2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Unrelated2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
