import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamInformationComponent } from './exam-information.component';

describe('ExamInformationComponent', () => {
  let component: ExamInformationComponent;
  let fixture: ComponentFixture<ExamInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
