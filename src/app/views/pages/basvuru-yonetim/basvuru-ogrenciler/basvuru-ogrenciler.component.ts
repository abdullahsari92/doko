import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { BasvuruService } from '../../../services/basvuru.service';
import { LayoutConfigService, SplashScreenService } from '../../../../core/_base/layout';
import { EgitimDonemi } from '../../../models/egitimDonemi';
import { BasvuruOgrencilerEditComponent } from './edit/basvuru-ogrenciler-edit.component';
import { StatusDisplayEnum } from '../../../partials/ag-grid/StatusDisplay.enum';
import { BasvuruOgrencilerImportComponent } from './basvuru-ogrenciler-import/basvuru-ogrenciler-import.component';
import { GridActionEnum } from '../../../../core/Enums/grid-action.enum';
import { BasvuruSubjectService } from '../../../../views/services/basvuru-subject.service';
import { birimBasvuru } from '../../../../views/models/birimBasvuru';
import { DokoSettingsService } from '../../../../core/services/doko-settings.service';
import { IslemTurleriEnum } from '../../../../core/Enums/IslemTurleri.enum';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { TopluOnayComponent } from './toplu-onay/toplu-onay.component';
import { fromEvent, interval, Subject } from 'rxjs';

@Component({
  selector: 'kt-basvuru-ogrenciler',
  templateUrl: './basvuru-ogrenciler.component.html',
  styleUrls: ['./basvuru-ogrenciler.component.scss']
})
export class BasvuruOgrencilerComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any
  getBasvuruOgrencilerList: any;
  chart: any;
  egitimDonemi: EgitimDonemi;
  birimBasvuru: birimBasvuru;
  basvuruId: any;
  rowData: any;
  loader: boolean = false;
  layoutUtilsService: any;
  durumTurleri = this.dokoSettingsService.getSelectBoxByEnumType(IslemTurleriEnum);
  durumTurleriSelectedValue: any;
  private unsubscribe: Subject<any>;

  constructor(
    private translate: TranslateService,
    private basvuruService: BasvuruService,
    private router: Router,
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private basvuruSubjectService: BasvuruSubjectService,
    private dokoSettingsService: DokoSettingsService,
    private cdf: ChangeDetectorRef,
  ) {
    this.unsubscribe = new Subject();
    //this.basvuruId = parseInt(this.router.getCurrentNavigation().extras.state.toString());
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.basvuruId = params.get("basvuruId");
      this.agGridInit();
      this.getList();
    })
  }

  getList() {
    this.getBasvuruOgrencilerList = [];
    this.basvuruService.getOrtakBasvuruOgrencilerList(this.basvuruId).pipe(tap(res => {
      if (res.result) {
        this.rowData = res.data;
      }
    }), takeUntil(this.unsubscribe), finalize(() => {
      this.cdf.markForCheck();
    })).subscribe();
  }

  agGridSet(agGrid: any) {
    this.agGrid = agGrid;
  }

  agGridInit() {
    this.columnDefs = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 70 },
      { field: 'aday_no', headerName: this.translate.instant("TEXT.aday_no"), minWidth: 130 },
      { field: 'adi', headerName: this.translate.instant("TEXT.adi"), minWidth: 130 },
      { field: 'soyadi', headerName: this.translate.instant("TEXT.soyadi"), minWidth: 130 },
      { field: 'cinsiyet', headerName: this.translate.instant("TEXT.cinsiyet"), minWidth: 130 },
      {
        field: 'odeme_onay', headerName: this.translate.instant("TEXT.odeme_onay"), cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.trueFalse }, minWidth: 130
      },
      {
        field: 'ucret_odeme_turu', headerName: this.translate.instant("TEXT.ucret_odeme_turu"), cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.onlineDekont }, minWidth: 130
      },
      { field: 'dekont', headerName: this.translate.instant("TEXT.dekont"), minWidth: 130 },
      { field: 'sirasi', headerName: this.translate.instant("TEXT.sirasi"), minWidth: 130 },
      {
        field: 'yerlesme_durumu', headerName: this.translate.instant("TEXT.yerlesme_durumu"), minWidth: 130, cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.ogrenciYerlesmeDurumlari }
      },
      { field: 'basvuru_tarihi', headerName: this.translate.instant("TEXT.basvuru_tarihi"), minWidth: 130 },
      {
        field: 'basvuru_durumu', headerName: this.translate.instant("TEXT.basvuru_durumu"), minWidth: 130, cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.ogrenciBasvuruDurumlari }
      },
      { field: 'dogum_tarihi', headerName: this.translate.instant("TEXT.dogum_tarihi"), minWidth: 130 },
      { field: 'ulke_adi_tr', headerName: this.translate.instant("TEXT.ulke_adi_tr"), minWidth: 150 },
      { field: 'ulke_adi_en', headerName: this.translate.instant("TEXT.ulke_adi_en"), minWidth: 150 },
      { field: 'ulke_kodu', headerName: this.translate.instant("TEXT.ulke_kodu"), minWidth: 150 },
      { field: 'pasaport_dosya', headerName: this.translate.instant("TEXT.pasaport_dosya"), minWidth: 150, cellRenderer: 'fileViewer' },
      { field: 'puani', headerName: this.translate.instant("TEXT.puani"), minWidth: 130 },
      { field: 'puan_belgesi', headerName: this.translate.instant("TEXT.puan_belgesi"), minWidth: 130, cellRenderer: 'fileViewer' },
      { field: 'puan_adi_tr', headerName: this.translate.instant("TEXT.puan_turu") + ' ' + this.translate.instant("LANGUAGE.tr"), minWidth: 130 },
      { field: 'puan_adi_en', headerName: this.translate.instant("TEXT.puan_turu") + ' ' + this.translate.instant("LANGUAGE.en"), minWidth: 130 },
      {
        field: 'resim',
        headerName: this.translate.instant("TEXT.resim"),
        minWidth: 200,
        width: 240,
        maxWidth: 270,
        cellRenderer: this.customImgCellRendererFunc
      },
      { field: 'tum_tercih', headerName: this.translate.instant("TEXT.tum_tercih"), minWidth: 130 },
      {
        field: 'idd', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 140, cellRenderer: 'agGridActionComponent', cellEditorParams: {
          values: [{ action: GridActionEnum.create.toString(), text: this.translate.instant('TEXT.EDIT'), icon: 'edit' },],
        }
      },
    ];
  }

  editModal(data: any) {
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    const dialogRef = this.dialog.open(BasvuruOgrencilerEditComponent, { data, width: "50%" });


    dialogRef.afterClosed().pipe(tap(refData => {

      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (!refData) {
        return;
      }
      this.getList();
    }), takeUntil(this.unsubscribe)).subscribe();
  }

  // importModal(data: any) {
  //   let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
  //   const dialogRef = this.dialog.open(BasvuruOgrencilerImportComponent, { width: "70%" });
  //   dialogRef.afterClosed().subscribe(refData => {
  //     this.agGrid.api.deselectAll();
  //     this.localStorageService.removeItem("agGridEdit");
  //     if (!refData) {
  //       //burada modal kapanıyor
  //       return;
  //     }
  //   });
  // }

  customImgCellRendererFunc(params): string {
    let html = '<img src="https://dokoapi.dpu.edu.tr/' + params.value + '" width="100px" height="100px"/>';
    return html;
  }

  matSelectionChange(event: any) {
    var ogrBasvuruIds = this.agGrid.api.getSelectedRows().map(m => m.id);
    var data = { ogrBasvuruIds: ogrBasvuruIds, islemTuru: event.value }
    const dialogRef = this.dialog.open(TopluOnayComponent, { data, width: "500px" });
    this.durumTurleriSelectedValue = null;

    dialogRef.afterClosed().subscribe(refData => {
      this.getList();
      if (!refData) {
        return;
      }

    });
  }

  goBackWithoutId() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
