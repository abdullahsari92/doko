import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ChartType } from 'angular-google-charts';
import { EgitimDonemi } from '../../../models/egitimDonemi';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { SinavBasvuru, SinavBasvuruList } from '../../../models/sinavBasvuru';
import { StatusDisplayEnum } from '../../../partials/ag-grid/StatusDisplay.enum';
import { BasvuruService } from '../../../services/basvuru.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteEntityDialogComponent } from '../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { BasvuruSubjectService } from '../../../../views/services/basvuru-subject.service';
import { finalize, tap } from 'rxjs/operators';
@Component({
  selector: 'kt-sinav-basvuru',
  templateUrl: './sinav-basvuru.component.html',
  styleUrls: ['./sinav-basvuru.component.scss']
})
export class SinavBasvuruComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any
  sinavBasvuruList: SinavBasvuruList[] = [];
  egitimDonemi: EgitimDonemi;
  chart: any;
  loader: boolean = false;
  sonucText: any;
  constructor(

    private translate: TranslateService,
    private basvuruService: BasvuruService,
    private router: Router,
    private localStorageService: LocalStorageService,
    public Datepipe: DatePipe,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private basvuruSubjectService: BasvuruSubjectService,
    private cdf:ChangeDetectorRef
  ) {
    this.basvuruSubjectService.sinavDegistir(new SinavBasvuru());
  }

  ngOnInit(): void {

    this.agGridInit();
    this.getList();

    this.chart = {
      // title: 'Sınav Öğrenci Sayısı',
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
          //easing: 'ease-in-out',
          startup: true,
          // is3D: true,
        }
      }
    };
  }

  SinavBasvuruList: any[] = [];

  getList() {
    this.egitimDonemi = this.localStorageService.getItem('egitimDonemi') as EgitimDonemi;
    this.basvuruService.getSinavList(this.egitimDonemi.id).pipe(tap(res=>{
      var badstatu: string;
      var statudetail: string;
      var disableDelete: boolean;
      if (res.result) {

        this.sinavBasvuruList = res.data;
        this.sinavBasvuruList.forEach((sb: any) => {

          if (sb.sonuclari_goster === 1) {
            this.sonucText = this.translate.instant('TEXT.goster')
          } else {
            this.sonucText = this.translate.instant('TEXT.GIZLI')
          }

          if (sb.durumu === 1) {
            if (this.Datepipe.transform(sb.bitis_tarihi, 'yyyy-MM-dd') >= this.Datepipe.transform(new Date, 'yyyy-MM-dd')) {
              statudetail = this.translate.instant('TEXT.ACTIVE');
              badstatu = "success";
            } else {
              statudetail = this.translate.instant('TEXT.suresi_gecti');
              badstatu = "warning";
            }
          } else {
            statudetail = this.translate.instant('TEXT.PASSIVE');
            badstatu = "danger";
          }
          sb.basvuran_ogrenci_sayisi = Math.floor(sb.basvuran_ogrenci_sayisi);
          sb.sinava_giren_ogrenci_sayisi = Math.floor(sb.basvuran_ogrenci_sayisi);

          var deger = [
            [this.translate.instant('TEXT.basvuran_ogrenci_sayisi'), sb.basvuran_ogrenci_sayisi],
            [this.translate.instant('TEXT.sinava_giren_ogrenci_sayisi'), sb.sinava_giren_ogrenci_sayisi],
          ]

          disableDelete = false;
          if (sb.basvuran_ogrenci_sayisi > 0) {
            disableDelete = true;
          }

          sb.data = deger;
          sb.badstatu = badstatu;
          sb.statudetail = statudetail;
          sb.disableDelete = disableDelete;
        })

      }
    }),finalize(()=>{
      this.cdf.markForCheck();

    })).subscribe();

  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  editData(id) {

    this.basvuruService.getSinavById(id).subscribe(res => {

      this.basvuruSubjectService.sinavDegistir(res.data);

      if (res.result) {

        res.data.id = id;

        var badstatu: string;
        var statudetail: string;
        var disableDelete: boolean;
        this.sinavBasvuruList.forEach((sb: any) => {

          if (sb.sonuclari_goster === 1) {
            this.sonucText = this.translate.instant('TEXT.goster')
          } else {
            this.sonucText = this.translate.instant('TEXT.GIZLI')
          }

          if (sb.durumu === 1) {
            if (this.Datepipe.transform(sb.bitis_tarihi, 'yyyy-MM-dd') >= this.Datepipe.transform(new Date, 'yyyy-MM-dd')) {
              statudetail = this.translate.instant('TEXT.ACTIVE');
              badstatu = "success";
            } else {
              statudetail = this.translate.instant('TEXT.suresi_gecti');
              badstatu = "warning";
            }
          } else {
            statudetail = this.translate.instant('TEXT.PASSIVE');
            badstatu = "danger";
          }
          sb.basvuran_ogrenci_sayisi = Math.floor(sb.basvuran_ogrenci_sayisi);
          sb.sinava_giren_ogrenci_sayisi = Math.floor(sb.basvuran_ogrenci_sayisi);

          var deger = [
            [this.translate.instant('TEXT.basvuran_ogrenci_sayisi'), sb.basvuran_ogrenci_sayisi],
            [this.translate.instant('TEXT.sinava_giren_ogrenci_sayisi'), sb.sinava_giren_ogrenci_sayisi],
          ]

          disableDelete = false;

          if (sb.basvuran_ogrenci_sayisi > 0) {
            disableDelete = true;
          }

          res.data.deger = deger;
          res.data.badstatu = badstatu;
          res.data.statudetail = statudetail;
          res.data.disableDelete = disableDelete;
        })

        this.router.navigate(['student/'+id], { relativeTo: this.activatedRoute });

      }
    })
  }

  sinavMerkezler(id) {
    this.router.navigate(['../sinav-merkezleri'], { state: id, relativeTo: this.activatedRoute });
  }

  bildirimGonderme(id) {
    this.router.navigate(['../bildirim'], { state: id, relativeTo: this.activatedRoute });
  }

  basvuruOgrenciler(id) {
    this.router.navigate(['../basvuru-ogrenciler'], { state: id, relativeTo: this.activatedRoute });
  }

  remove(data) {
    //console.log('data',data);
    var description = this.translate.instant('TEXT.DELETE_WANT');
    var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');
    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      //  data: { title, description, waitDesciption },
      width: '440px',
    });
    dialogRef.afterClosed().subscribe(refData => {
      //this.agGrid.api.deselectAll();
      if (!refData) {
        //burada modal kapanıyor
        return;
      }
      this.basvuruService.getSinavDelete(data).subscribe(res => {
        if (res.result) {
          location.reload();
        }
      })
    });
  }

  agGridInit() {

    //	console.log(' bankaValid:',this.translate.instant('TEXT.TRUE', {name: name}));
    this.columnDefs = [
      { headerName: "id", sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 40 },
      { field: 'basvuru_turu', headerName: "basvuru_turu", sortable: true, cellStyle: { color: 'green' } },
      { field: 'egitim_donemi_id', headerName: this.translate.instant('TEXT.egitim_donemi_id'), sortable: true, cellStyle: { color: '#ccce75' } },
      { field: 'adi_tr', headerName: this.translate.instant('TEXT.adi_tr'), sortable: true },
      { field: 'adi_en', headerName: this.translate.instant('TEXT.adi_en'), minWidth: 150 },
      { field: 'baslangic_tarihi', headerName: this.translate.instant("TEXT.baslangic_tarihi"), minWidth: 150 },
      { field: 'bitis_tarihi', headerName: this.translate.instant("TEXT.bitis_tarihi"), minWidth: 150 },
      {
        field: 'dil_bilgisi_durumu', headerName: this.translate.instant("TEXT.dil_bilgisi_durumu"), minWidth: 150, cellRenderer: 'changeStatus',
        cellEditorParams: {
          values: StatusDisplayEnum.trueFalse,
        }
      },
      {
        field: 'vize_bilgisi_durumu', headerName: this.translate.instant("TEXT.vize_bilgisi_durumu"), minWidth: 150, cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.trueFalse }
      },
      { field: 'ucret', headerName: this.translate.instant("TEXT.ucret"), minWidth: 150 },
      { field: 'ucret_zamani', headerName: this.translate.instant("TEXT.ucret_zamani"), minWidth: 150 },
      {
        field: 'ucret_odeme_turu', headerName: this.translate.instant("TEXT.ucret_odeme_turu"), cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.onlineDekont }, minWidth: 150
      },
      { field: 'ucret_son_odeme_tarihi', headerName: this.translate.instant("TEXT.ucret_son_odeme_tarihi"), minWidth: 150 },
      { field: 'odeme_bankasi', headerName: this.translate.instant("TEXT.odeme_bankasi"), minWidth: 150 },
      { field: 'ucret_aciklama_tr', headerName: this.translate.instant("TEXT.ucret_aciklama_tr"), minWidth: 150 },
      { field: 'ucret_aciklama_en', headerName: this.translate.instant("TEXT.ucret_aciklama_en"), minWidth: 150 },
      {
        field: 'uyruk_bilgisi_durumu', headerName: this.translate.instant("TEXT.uyruk_bilgisi_durumu"), cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.trueFalse }, minWidth: 150
      },
      {
        field: 'kayit_turu_durumu', headerName: this.translate.instant("TEXT.kayit_turu_durumu"), cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.trueFalse }, minWidth: 150
      },
      { field: 'kullanim_kosulu_metni_tr', headerName: this.translate.instant("TEXT.kullanim_kosulu_metni_tr"), minWidth: 150 },
      { field: 'kullanim_kosulu_metni_en', headerName: this.translate.instant("TEXT.kullanim_kosulu_metni_en"), minWidth: 150 },
      { field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), cellRenderer: 'changeStatus', minWidth: 150 },
      { field: 'id', headerName: this.translate.instant('TEXT.SETTINGS'), minWidth: 150, cellRenderer: 'agGridActionComponent', },

    ];

  }

}
