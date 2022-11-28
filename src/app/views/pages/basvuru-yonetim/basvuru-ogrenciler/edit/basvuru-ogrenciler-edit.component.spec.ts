import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasvuruOgrencilerEditComponent } from './basvuru-ogrenciler-edit.component';

describe('BasvuruOgrencilerEditComponent', () => {
  let component: BasvuruOgrencilerEditComponent;
  let fixture: ComponentFixture<BasvuruOgrencilerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasvuruOgrencilerEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasvuruOgrencilerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
