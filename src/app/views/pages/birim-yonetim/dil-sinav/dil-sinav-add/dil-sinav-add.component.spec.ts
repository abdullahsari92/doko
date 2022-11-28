import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DilSinavAddComponent } from './dil-sinav-add.component';

describe('DilSinavAddComponent', () => {
  let component: DilSinavAddComponent;
  let fixture: ComponentFixture<DilSinavAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DilSinavAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DilSinavAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
