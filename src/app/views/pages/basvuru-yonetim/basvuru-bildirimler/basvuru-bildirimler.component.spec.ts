import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasvuruBildirimlerComponent } from './basvuru-bildirimler.component';

describe('BasvuruBildirimlerComponent', () => {
  let component: BasvuruBildirimlerComponent;
  let fixture: ComponentFixture<BasvuruBildirimlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasvuruBildirimlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasvuruBildirimlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
