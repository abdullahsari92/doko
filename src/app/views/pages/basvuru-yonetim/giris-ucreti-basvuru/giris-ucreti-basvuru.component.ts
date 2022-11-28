import { Component, OnInit } from '@angular/core';
import { BasvuruSubjectService } from '../../../services/basvuru-subject.service';
import { BasvuruTurEnum } from '../../../../core/Enums/BasvuruTurEnum';
import { ActivatedRoute, Router } from '@angular/router';
import { birimBasvuru } from '../../../models/birimBasvuru';

@Component({
  selector: 'kt-giris-ucreti-basvuru',
  templateUrl: './giris-ucreti-basvuru.component.html',
  styleUrls: ['./giris-ucreti-basvuru.component.scss']
})
export class GirisUcretiBasvuruComponent implements OnInit {

  basvuruTurEnum = BasvuruTurEnum;
  loader: boolean;
  constructor(
    private basvuruSubjectService: BasvuruSubjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

  }

  addGirisUcretiBasvuru() {

    this.basvuruSubjectService.basvuruDegistir(new birimBasvuru());

    this.router.navigate(['add'], { relativeTo: this.activatedRoute });

  }

}
