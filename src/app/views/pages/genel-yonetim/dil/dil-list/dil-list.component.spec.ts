import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DilListComponent } from './dil-list.component';

describe('DilListComponent', () => {
  let component: DilListComponent;
  let fixture: ComponentFixture<DilListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DilListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DilListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
