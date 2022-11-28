import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../core/services/translate.service';
import { ChartType } from 'angular-google-charts';
import { BasvuruSubjectService } from '../../../../views/services/basvuru-subject.service';
import { SinavBasvuru } from '../../../../views/models/sinavBasvuru';
import { BasvuruService } from '../../../services/basvuru.service';

@Component({
  selector: 'kt-sinav-detay-layout',
  templateUrl: './sinav-detay-layout.component.html',
  styleUrls: ['./sinav-detay-layout.component.scss']
})
export class SinavDetayLayoutComponent implements OnInit {

  sinavBasvuru: SinavBasvuru = new SinavBasvuru();
  columnDefs: any;
  chart: any;
  loader: boolean;

  activeBtnId: number = 1;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private basvuruSubjectService: BasvuruSubjectService,
    private basvuruService: BasvuruService,

  ) { }

  ngOnInit(): void {

    this.basvuruSubjectService.currentSinav.subscribe(basvuru => {

      console.log(' currentSinavBasvuru', basvuru)
      this.sinavBasvuru = basvuru;
    });

    this.chart = {
      type: ChartType.PieChart,
      data: [
        [this.translate.instant('TEXT.basvuran_ogrenci_sayisi'), 22],
        [this.translate.instant('TEXT.sinava_giren_ogrenci_sayisi'), 34],
      ],
      columnNames: ['Element', 'Density'],

      options: {
        is3D: true,
        legend: 'none',
        pieSliceText: 'label',
        width: "200",
        pieStartAngle: 100,
        slices: {
          0: { color: '#dd4477' },
          1: { color: '#0099c6' }
        },
        animation: {
          duration: 250,
          startup: true,
        }
      }
    };
  }

  basvuruOgrenciler(id) {
    this.activeBtnId = 1;
    this.router.navigate(['student/' + id], { relativeTo: this.activatedRoute });
  }

  editData() {
    this.activeBtnId = 2;
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  sinavMerkezler(id) {
    this.activeBtnId = 3;
    this.router.navigate(['sinav-merkezleri'], { state: id, relativeTo: this.activatedRoute });
  }

  bildirimGonderme(id) {
    this.activeBtnId = 4;
    this.router.navigate(['bildirim/' + id], { relativeTo: this.activatedRoute });
  }

  islemler(id) {
    this.activeBtnId = 5;
    this.router.navigate(['islemler/' + id], { relativeTo: this.activatedRoute });
  }
  
  raporlar(id) {
    this.activeBtnId = 6;
    this.router.navigate(['raporlar/' + id], { relativeTo: this.activatedRoute });
  }
}
