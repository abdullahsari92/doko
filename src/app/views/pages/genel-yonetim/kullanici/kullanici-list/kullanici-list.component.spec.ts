import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciListComponent } from './kullanici-list.component';

describe('KullaniciListComponent', () => {
  let component: KullaniciListComponent;
  let fixture: ComponentFixture<KullaniciListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KullaniciListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KullaniciListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
