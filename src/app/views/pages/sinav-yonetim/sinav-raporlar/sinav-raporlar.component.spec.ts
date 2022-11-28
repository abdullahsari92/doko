import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinavRaporlarComponent } from './sinav-raporlar.component';

describe('SinavRaporlarComponent', () => {
  let component: SinavRaporlarComponent;
  let fixture: ComponentFixture<SinavRaporlarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinavRaporlarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinavRaporlarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
