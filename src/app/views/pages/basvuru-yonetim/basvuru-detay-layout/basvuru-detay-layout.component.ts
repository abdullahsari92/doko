import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../core/services/translate.service';
import { birimBasvuru } from '../../../../views/models/birimBasvuru';
import { ChartType } from 'angular-google-charts';
import { BasvuruSubjectService } from '../../../../views/services/basvuru-subject.service';
import { BasvuruService } from '../../../services/basvuru.service';
import { BasvuruTurEnum } from '../../../../core/Enums/BasvuruTurEnum';

@Component({
  selector: 'kt-basvuru-detay-layout',
  templateUrl: './basvuru-detay-layout.component.html',
  styleUrls: ['./basvuru-detay-layout.component.scss']
})
export class BasvuruDetayLayoutComponent implements OnInit {
  @Input() basvuruTuru: any;
  birimBasvuru: birimBasvuru = new birimBasvuru();
  columnDefs: any;
  chart: any;
  loader: boolean;
  activeBtnId: number = 2;
  SolMenuAktif=true;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private basvuruSubjectService: BasvuruSubjectService,
    private basvuruService: BasvuruService,

  ) { }

  ngOnInit(): void {

    this.basvuruSubjectService.currentBirim.subscribe(basvuru => {
      this.birimBasvuru = basvuru;
    });

    this.chart = {
      type: ChartType.PieChart,
      data: [
        [this.translate.instant('TEXT.basvuran_ogrenci_sayisi')],
        [this.translate.instant('TEXT.sinava_giren_ogrenci_sayisi')],
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

  editData(id) {
    //basvuru tur alanına göre add öncesi yönlendirme almalı

    this.activeBtnId = 2;
             
   // this.router.navigate(['lisans-basvuru/add'], { state: this.birimBasvuru , relativeTo: this.activatedRoute });


    if (this.birimBasvuru.basvuru_turu == BasvuruTurEnum.lisans) {
      this.router.navigate(['lisans-basvuru/add'], { state: this.birimBasvuru, relativeTo: this.activatedRoute });

    }
    console.log(' this.birimBasvuru.',this.birimBasvuru)
    if (this.birimBasvuru.basvuru_turu == BasvuruTurEnum.yuksekLisans) {
      this.router.navigate(['yuksek-lisans-basvuru/add'], { state: this.birimBasvuru, relativeTo: this.activatedRoute });
    }

    if (this.birimBasvuru.basvuru_turu == BasvuruTurEnum.doktora) {
      this.router.navigate(['doktora-basvuru/add'], { state: this.birimBasvuru, relativeTo: this.activatedRoute });
    }
  
    if (this.birimBasvuru.basvuru_turu == BasvuruTurEnum.girisUcreti) {
      this.router.navigate(['giris-ucreti-basvuru/add'], { state: this.birimBasvuru, relativeTo: this.activatedRoute });
    }

   // this.router.navigate(['basvuru/add/' + id], { relativeTo: this.activatedRoute });
  }

  tercihYerleri(id) {
    this.activeBtnId = 3;
    this.router.navigate(['bolumler/' + id], { state: id, relativeTo: this.activatedRoute });
  }

  bildirimGonderme(id) {

    this.activeBtnId = 4;
    this.router.navigate(['bildirim/' + id], { relativeTo: this.activatedRoute });
  }

  islemler(id) {
    this.activeBtnId = 5;
    this.router.navigate(['islemler/' + id], { relativeTo: this.activatedRoute });
  }

  

  //data: any;
  // changeSonuc(id, e) {
  //   const chec = e == 0 ? 1 : 0;
  //   this.data = { id: id, sonuclari_goster: chec };
  //   this.basvuruService.getSinavSonucUpdate(this.data).subscribe(res => {
  //     console.log(res);
  //     if (res.result) {
  //       const _messageType = MessageType.Update;
  //     }
  //   })
  // }


}
