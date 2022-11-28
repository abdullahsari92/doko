import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasvuruOgrencilerImportComponent } from './basvuru-ogrenciler-import.component';

describe('BasvuruOgrencilerImportComponent', () => {
  let component: BasvuruOgrencilerImportComponent;
  let fixture: ComponentFixture<BasvuruOgrencilerImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasvuruOgrencilerImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasvuruOgrencilerImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
