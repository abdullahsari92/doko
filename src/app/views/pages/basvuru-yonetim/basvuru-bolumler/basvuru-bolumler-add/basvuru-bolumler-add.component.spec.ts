import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasvuruBolumlerAddComponent} from './basvuru-bolumler-add.component';

describe('BasvuruBolumAddComponent', () => {
  let component: BasvuruBolumlerAddComponent;
  let fixture: ComponentFixture<BasvuruBolumlerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasvuruBolumlerAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasvuruBolumlerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
