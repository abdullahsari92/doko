import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasvuruIslemlerComponent } from './basvuru-islemler.component';

describe('BasvuruIslemlerComponent', () => {
  let component: BasvuruIslemlerComponent;
  let fixture: ComponentFixture<BasvuruIslemlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasvuruIslemlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasvuruIslemlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
