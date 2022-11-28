import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasvuruBildirimlerAddComponent } from './basvuru-bildirimler-add.component';

describe('BasvuruBildirimlerAddComponent', () => {
  let component: BasvuruBildirimlerAddComponent;
  let fixture: ComponentFixture<BasvuruBildirimlerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasvuruBildirimlerAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasvuruBildirimlerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
