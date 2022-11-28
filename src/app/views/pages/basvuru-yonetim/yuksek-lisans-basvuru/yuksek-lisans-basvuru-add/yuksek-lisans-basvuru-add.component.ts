import { Component, OnInit } from '@angular/core';
import { BasvuruTurEnum } from '../../../../../core/Enums/BasvuruTurEnum';


@Component({
  selector: 'kt-yuksek-lisans-basvuru-add',
  templateUrl: './yuksek-lisans-basvuru-add.component.html',
  styleUrls: ['./yuksek-lisans-basvuru-add.component.scss']
})
export class YuksekLisansBasvuruAddComponent implements OnInit {
  constructor() { }
  basvuruTurEnum = BasvuruTurEnum;
  ngOnInit(): void {

  }
}
