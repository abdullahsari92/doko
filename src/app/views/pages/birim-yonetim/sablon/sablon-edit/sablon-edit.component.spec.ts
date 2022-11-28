import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SablonEditComponent } from './sablon-edit.component';

describe('SablonEditComponent', () => {
  let component: SablonEditComponent;
  let fixture: ComponentFixture<SablonEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SablonEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SablonEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
