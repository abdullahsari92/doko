import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DilAddComponent } from './dil-add.component';

describe('DilAddComponent', () => {
  let component: DilAddComponent;
  let fixture: ComponentFixture<DilAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DilAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DilAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
