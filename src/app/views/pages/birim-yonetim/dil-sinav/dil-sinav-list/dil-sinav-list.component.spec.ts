import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DilSinavListComponent } from './dil-sinav-list.component';

describe('DilSinavListComponent', () => {
  let component: DilSinavListComponent;
  let fixture: ComponentFixture<DilSinavListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DilSinavListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DilSinavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
