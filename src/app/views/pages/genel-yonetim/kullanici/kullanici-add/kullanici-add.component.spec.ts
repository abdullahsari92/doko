import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciAddComponent } from './kullanici-add.component';

describe('KullaniciAddComponent', () => {
  let component: KullaniciAddComponent;
  let fixture: ComponentFixture<KullaniciAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KullaniciAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KullaniciAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
