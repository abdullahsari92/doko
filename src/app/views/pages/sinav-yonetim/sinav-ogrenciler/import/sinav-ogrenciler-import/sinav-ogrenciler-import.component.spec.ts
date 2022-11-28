import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinavOgrencilerImportComponent } from './sinav-ogrenciler-import.component';

describe('SinavOgrencilerImportComponent', () => {
  let component: SinavOgrencilerImportComponent;
  let fixture: ComponentFixture<SinavOgrencilerImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinavOgrencilerImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinavOgrencilerImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
