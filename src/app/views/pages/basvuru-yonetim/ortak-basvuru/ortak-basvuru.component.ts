import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ChartType } from 'angular-google-charts';
import { BasvuruTurEnum } from '../../../../core/Enums/BasvuruTurEnum';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { LayoutConfigService, SplashScreenService } from '../../../../core/_base/layout';
import { birimBasvuru, birimBasvuruList } from '../../../models/birimBasvuru';
import { EgitimDonemi } from '../../../models/egitimDonemi';
import { StatusDisplayEnum } from '../../../partials/ag-grid/StatusDisplay.enum';
import { BasvuruService } from '../../../services/basvuru.service';
import { DatePipe } from '@angular/common';
import { DeleteEntityDialogComponent } from '../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { BasvuruSubjectService } from '../../../../views/services/basvuru-subject.service';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'kt-ortak-basvuru',
  templateUrl: './ortak-basvuru.component.html',
  styleUrls: ['./ortak-basvuru.component.scss']
})
export class OrtakBasvuruComponent implements OnInit {

  @Input() basvuruTuru: any;
  agGrid: AgGridAngular;
  columnDefs: any
  ortakBasvuruList: birimBasvuruList[] = [];
  egitimDonemi: EgitimDonemi;
  chart: any;
  loader: boolean;
  birimBasvuru:birimBasvuru = new birimBasvuru();
	private unsubscribe: Subject<any>;

  constructor(

    private translate: TranslateService,
    private basvuruService: BasvuruService,
    private router: Router,
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public Datepipe: DatePipe,
    private basvuruSubjectService:BasvuruSubjectService,
    private cdf:ChangeDetectorRef,
    private dialog: MatDialog) {
      this.basvuruSubjectService.basvuruDegistir(new birimBasvuru());
		this.unsubscribe = new Subject();

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

  getList() {
    this.ortakBasvuruList = []
    this.egitimDonemi = this.localStorageService.getItem('egitimDonemi') as EgitimDonemi;
    this.basvuruService.getOrtakBasvuruList(this.egitimDonemi.id, this.basvuruTuru).pipe(tap(res=>{ 
      console.log(res.data);
      console.log(res);
      var badstatu: string;
      var statudetail: string;
      var disableDelete: boolean;
      if (res.result) {
        this.ortakBasvuruList = res.data;
        this.ortakBasvuruList.forEach((ob: any) => {
          if (ob.durumu === 1) {
            if (this.Datepipe.transform(ob.bitis_tarihi, 'yyyy-MM-dd') >= this.Datepipe.transform(new Date, 'yyyy-MM-dd')) {
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
          ob.basvuran_ogrenci_sayisi = Math.floor(ob.basvuran_ogrenci_sayisi);
          ob.yerlesen_ogrenci_sayisi = Math.floor(ob.yerlesen_ogrenci_sayisi);

          var deger = [
            [this.translate.instant('TEXT.basvuran_ogrenci_sayisi'), ob.basvuran_ogrenci_sayisi],
            [this.translate.instant('TEXT.sinava_giren_ogrenci_sayisi'), ob.yerlesen_ogrenci_sayisi],
          ]
          disableDelete = false;
          if (ob.basvuran_ogrenci_sayisi > 0) {
            disableDelete = true;
          }

          ob.data = deger;
          ob.badstatu = badstatu;
          ob.statudetail = statudetail;
          ob.disableDelete = disableDelete;

        })
      }

    }),	takeUntil(this.unsubscribe),
    finalize(()=>{
      this.cdf.markForCheck();
    })).subscribe();

  }

  // getortakBasvuruList():birimBasvuruList[]
  // {


  //   var secilenEgitimDonemi =this.localStorageService.getItem('egitimDonemi') as EgitimDonemi;
  //   if(this.ortakBasvuruList.length>0 &&   this.egitimDonemi.id ==secilenEgitimDonemi.id) 
  //   {
  //       this.cdr.markForCheck();
  //      return this.ortakBasvuruList;
  //   }
  //   else{

  //   this.loader=  true;
  //   var promise = new Promise((resolve, reject) => {

  //      this.getList();

  // 		setTimeout(() => {       
  // 		  resolve(true);
  // 		}, 1500);
  // 	  }).then(()=>{

  // 		this.cdr.markForCheck();
  //     //console.log(' basvurlist00000000000',this.ortakBasvuruList);

  //    this.loader=  false;

  // 	 });

  //     return this.ortakBasvuruList;
  //   }

  // }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  basvuruOgrenciler(id) {

    this.router.navigate(['../basvuru-ogrenciler'], { state: id, relativeTo: this.activatedRoute });

  }

  editData(id) {

    //  this.getSinav(id);
    this.basvuruService.getOrtakBasvuruId(id, this.basvuruTuru).subscribe(res => {
      //console.log(' res-getSinav',res)
      if (res.result) {

        res.data.id = id;

        var badstatu: string;
        var statudetail: string;
        var disableDelete: boolean;
        this.ortakBasvuruList.forEach((ob: any) => {
          if (ob.durumu === 1) {
            if (this.Datepipe.transform(ob.bitis_tarihi, 'yyyy-MM-dd') >= this.Datepipe.transform(new Date, 'yyyy-MM-dd')) {
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
          ob.basvuran_ogrenci_sayisi = Math.floor(ob.basvuran_ogrenci_sayisi);
          ob.yerlesen_ogrenci_sayisi = Math.floor(ob.yerlesen_ogrenci_sayisi);

          var deger = [
            [this.translate.instant('TEXT.basvuran_ogrenci_sayisi'), ob.basvuran_ogrenci_sayisi],
            [this.translate.instant('TEXT.sinava_giren_ogrenci_sayisi'), ob.yerlesen_ogrenci_sayisi],
          ]
          disableDelete = false;
          if (ob.basvuran_ogrenci_sayisi > 0) {
            disableDelete = true;
          }

          res.data.deger = deger;
          res.data.badstatu = badstatu;
          res.data.statudetail = statudetail;
          res.data.disableDelete = disableDelete;

        })

        this.birimBasvuru = res.data;
        this.birimBasvuru.basvuru_turu = this.basvuruTuru;
        this.basvuruSubjectService.basvuruDegistir(this.birimBasvuru);
             
          this.router.navigate(['add'], { state: this.birimBasvuru, relativeTo: this.activatedRoute });
   

      }

    })

  }

  tercihYerleri(id) {

    var basvuru = new birimBasvuru();

    basvuru.id=id;
    this.basvuruSubjectService.basvuruDegistir(basvuru);
    this.router.navigate(['../basvuru-bolumler/'+id], { relativeTo: this.activatedRoute });
    // this.router.navigate(['../basvuru-bolumler'], { state: id, relativeTo: this.activatedRoute });

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
      this.basvuruService.getOrtakBasvuruDelete(data, this.basvuruTuru).subscribe(res => {
        if (res.result) {
          location.reload();
        }
      })
    });

  }

  agGridInit() {

    //	console.log(' bankaValid:',this.translate.instant('TEXT.TRUE', {name: name}));
    var tanim = this.translate.instant('TEXT.TRUE');

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
  ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
