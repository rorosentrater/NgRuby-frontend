import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChimeComponent } from './chime.component';

describe('ChimeComponent', () => {
  let component: ChimeComponent;
  let fixture: ComponentFixture<ChimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
