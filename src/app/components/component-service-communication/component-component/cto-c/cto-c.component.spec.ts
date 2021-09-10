import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtoCComponent } from './cto-c.component';

describe('CtoCComponent', () => {
  let component: CtoCComponent;
  let fixture: ComponentFixture<CtoCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtoCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtoCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
