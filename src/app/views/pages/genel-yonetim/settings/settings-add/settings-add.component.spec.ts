import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAddComponent } from './settings-add.component';

describe('SettingsAddComponent', () => {
  let component: SettingsAddComponent;
  let fixture: ComponentFixture<SettingsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
