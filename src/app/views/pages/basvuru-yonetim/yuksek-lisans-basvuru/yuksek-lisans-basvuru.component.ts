import { Component, OnInit } from '@angular/core';
import { BasvuruSubjectService } from '../../../../views/services/basvuru-subject.service';
import { BasvuruTurEnum } from '../../../../core/Enums/BasvuruTurEnum';

import { ActivatedRoute, Router } from '@angular/router';
import { birimBasvuru } from '../../../../views/models/birimBasvuru';
@Component({
  selector: 'kt-yuksek-lisans-basvuru',
  templateUrl: './yuksek-lisans-basvuru.component.html',
  styleUrls: ['./yuksek-lisans-basvuru.component.scss']
})
export class YuksekLisansBasvuruComponent implements OnInit {


  basvuruTurEnum = BasvuruTurEnum;
  loader: boolean;
  constructor(
    private basvuruSubjectService: BasvuruSubjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }


  addYuksekLisansBasvuru() {

    this.basvuruSubjectService.basvuruDegistir(new birimBasvuru());

    this.router.navigate(['add'], { relativeTo: this.activatedRoute });

  }

}
