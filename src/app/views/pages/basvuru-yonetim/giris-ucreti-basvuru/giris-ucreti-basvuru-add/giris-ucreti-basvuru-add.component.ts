import { Component, OnInit } from '@angular/core';
import { BasvuruTurEnum } from '../../../../../core/Enums/BasvuruTurEnum';

@Component({
  selector: 'kt-giris-ucreti-basvuru-add',
  templateUrl: './giris-ucreti-basvuru-add.component.html',
  styleUrls: ['./giris-ucreti-basvuru-add.component.scss']
})
export class GirisUcretiBasvuruAddComponent implements OnInit {

  constructor() { }
  basvuruTurEnum = BasvuruTurEnum;
  ngOnInit(): void {

  }

}
