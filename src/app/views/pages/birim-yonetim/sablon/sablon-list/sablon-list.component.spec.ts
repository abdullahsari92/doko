import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SablonListComponent } from './sablon-list.component';

describe('SablonListComponent', () => {
  let component: SablonListComponent;
  let fixture: ComponentFixture<SablonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SablonListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SablonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
