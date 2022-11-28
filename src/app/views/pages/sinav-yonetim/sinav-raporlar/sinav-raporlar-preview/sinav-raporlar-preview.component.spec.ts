import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinavRaporlarPreviewComponent } from './sinav-raporlar-preview.component';

describe('SinavRaporlarPreviewComponent', () => {
  let component: SinavRaporlarPreviewComponent;
  let fixture: ComponentFixture<SinavRaporlarPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinavRaporlarPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinavRaporlarPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
