import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinavIslemlerComponent } from './sinav-islemler.component';

describe('SinavIslemlerComponent', () => {
  let component: SinavIslemlerComponent;
  let fixture: ComponentFixture<SinavIslemlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinavIslemlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinavIslemlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
