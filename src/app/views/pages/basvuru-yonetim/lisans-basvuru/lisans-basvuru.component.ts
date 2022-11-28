import { Component, OnInit } from '@angular/core';
import { BasvuruSubjectService } from '../../../../views/services/basvuru-subject.service';
import { BasvuruTurEnum } from '../../../../core/Enums/BasvuruTurEnum';

import { ActivatedRoute, Router } from '@angular/router';
import { birimBasvuru } from '../../../../views/models/birimBasvuru';

@Component({
  selector: 'kt-lisans-basvuru',
  templateUrl: './lisans-basvuru.component.html',
  styleUrls: ['./lisans-basvuru.component.scss']
})
export class LisansBasvuruComponent implements OnInit {

  basvuruTurEnum = BasvuruTurEnum;
  loader: boolean;

  constructor(

    private basvuruSubjectService: BasvuruSubjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }


  addLisansBasvuru() {

    this.basvuruSubjectService.basvuruDegistir(new birimBasvuru());

    this.router.navigate(['add'], { relativeTo: this.activatedRoute });

  }

}
