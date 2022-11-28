import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinavOgrencilerEditComponent } from './sinav-ogrenciler-edit.component';

describe('SinavOgrencilerEditComponent', () => {
  let component: SinavOgrencilerEditComponent;
  let fixture: ComponentFixture<SinavOgrencilerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinavOgrencilerEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinavOgrencilerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
