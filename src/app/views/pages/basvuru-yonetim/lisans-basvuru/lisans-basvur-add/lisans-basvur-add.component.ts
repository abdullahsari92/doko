import { Component, OnInit } from '@angular/core';
import { BasvuruTurEnum } from '../../../../../core/Enums/BasvuruTurEnum';

@Component({
  selector: 'kt-lisans-basvur-add',
  templateUrl: './lisans-basvur-add.component.html',
  styleUrls: ['./lisans-basvur-add.component.scss']
})
export class LisansBasvurAddComponent implements OnInit {

  constructor() { }
  basvuruTurEnum = BasvuruTurEnum;
  ngOnInit(): void {

  }


}
