import { Component, OnInit } from '@angular/core';
import { BasvuruTurEnum } from '../../../../../core/Enums/BasvuruTurEnum';


@Component({
  selector: 'kt-doktora-basvuru-add',
  templateUrl: './doktora-basvuru-add.component.html',
  styleUrls: ['./doktora-basvuru-add.component.scss']
})
export class DoktoraBasvuruAddComponent implements OnInit {

  constructor() { }
  basvuruTurEnum = BasvuruTurEnum;
  ngOnInit(): void {

  }

}
