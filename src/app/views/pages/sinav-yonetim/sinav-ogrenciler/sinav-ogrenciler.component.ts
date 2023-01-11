import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { BasvuruService } from '../../../services/basvuru.service';
import { LayoutConfigService, SplashScreenService } from '../../../../core/_base/layout';
import { EgitimDonemi } from '../../../models/egitimDonemi';
import { StatusDisplayEnum } from '../../../partials/ag-grid/StatusDisplay.enum';
import { GridActionEnum } from '../../../../core/Enums/grid-action.enum';
import { BasvuruSubjectService } from '../../../../views/services/basvuru-subject.service';
import { birimBasvuru } from '../../../../views/models/birimBasvuru';
import { SinavOgrencilerEditComponent } from './edit/sinav-ogrenciler-edit/sinav-ogrenciler-edit.component';
import { SinavOgrencilerImportComponent } from './import/sinav-ogrenciler-import/sinav-ogrenciler-import.component';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DokoSettingsService } from '../../../../core/services/doko-settings.service';
import { IslemTurleriSinavEnum } from '../../../../core/Enums/IslemTurleri.enum';
import { TopluSinavOnayComponent } from './toplu-sinav-onay/toplu-sinav-onay.component';
//import { TopluOnaySinavComponent } from './toplu-onay-sinav/toplu-onay-sinav.component';

@Component({
  selector: 'kt-sinav-ogrenciler',
  templateUrl: './sinav-ogrenciler.component.html',
  styleUrls: ['./sinav-ogrenciler.component.scss']
})
export class SinavOgrencilerComponent implements OnInit {

  // durumTurleri = [
  //   { value: 1, key: 'Başvuru Durumu' },
  //   { value: 2, key: 'Sınav salonuna atama' },
  //   { value: 3, key: 'Sınava girme durumu' },
  //   { value: 4, key: 'Ödeme durumu' },
  // ];

  durumTurleri = this.dokoSettingsService.getSelectBoxByEnumType(IslemTurleriSinavEnum);

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
  durumTurleriSelectedValue: any;

  private unsubscribe: Subject<any>;

  constructor(
    private translate: TranslateService,
    private basvuruService: BasvuruService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdf: ChangeDetectorRef,
    private dokoSettingsService: DokoSettingsService
  ) {
    this.unsubscribe = new Subject();
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
    this.basvuruService.getSinavBasvuruOgrencilerList(this.basvuruId).pipe(tap(res => {
      if (res.result) {
        this.rowData = res.data;
      }
      else {
        console.error(res.error.message);
      }
    }), takeUntil(this.unsubscribe),
      finalize(() => {
        this.cdf.markForCheck();
      })).subscribe();
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  agGridInit() {
    this.columnDefs = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 70 },
      { field: 'osbId', headerName: this.translate.instant("TEXT.id"), hide: true },
      { field: 'aday_no', headerName: this.translate.instant("TEXT.aday_no"), minWidth: 150 },
      { field: 'adi', headerName: this.translate.instant("TEXT.adi"), minWidth: 150 },
      { field: 'soyadi', headerName: this.translate.instant("TEXT.soyadi"), minWidth: 150 },
      { field: 'cinsiyet', headerName: this.translate.instant("TEXT.cinsiyet"), minWidth: 150 },
      { field: 'sehir', headerName: this.translate.instant("TEXT.sehir"), minWidth: 150 },
      { field: 'ulke_adi_tr', headerName: this.translate.instant("TEXT.ulke_adi_tr"), minWidth: 150 },
      { field: 'ulke_adi_en', headerName: this.translate.instant("TEXT.ulke_adi_en"), minWidth: 150 },
      { field: 'ulke_kodu', headerName: this.translate.instant("TEXT.ulke_kodu"), minWidth: 150 },
      { field: 'sinav_merkezi_adi', headerName: this.translate.instant("TEXT.sinav_merkezi_adi"), minWidth: 150 },
      { field: 'sinav_salonu_adi', headerName: this.translate.instant("TEXT.sinav_salonu_adi"), minWidth: 150 },
      { field: 'salon_sira', headerName: this.translate.instant("TEXT.salon_sira"), minWidth: 150 },
      {
        field: 'sinav_durumu', headerName: this.translate.instant("TEXT.sinav_durumu"), cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.ogrenciSinavDurumlari }, minWidth: 150
      },
      {
        field: 'ucret_odeme_turu', headerName: this.translate.instant("TEXT.ucret_odeme_turu"), cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.onlineDekont }, minWidth: 150
      },
      { field: 'dekont', headerName: this.translate.instant("TEXT.dekont"), minWidth: 150 },
      { field: 'kitapcik', headerName: this.translate.instant("TEXT.kitapcik"), minWidth: 150 },
      { field: 'dogru_sayisi', headerName: this.translate.instant("TEXT.dogru_sayisi"), minWidth: 150 },
      { field: 'yanlis_sayisi', headerName: this.translate.instant("TEXT.yanlis_sayisi"), minWidth: 150 },
      { field: 'bos_sayisi', headerName: this.translate.instant("TEXT.bos_sayisi"), minWidth: 150 },
      { field: 'puani', headerName: this.translate.instant("TEXT.puani"), minWidth: 150 },
      { field: 'sirasi', headerName: this.translate.instant("TEXT.sirasi"), minWidth: 150 },
      { field: 'yuzdesi', headerName: this.translate.instant("TEXT.yuzdesi"), minWidth: 150 },
      { field: 'basvuru_tarihi', headerName: this.translate.instant("TEXT.basvuru_tarihi"), minWidth: 150 },
      {
        field: 'basvuru_durumu', headerName: this.translate.instant("TEXT.basvuru_durumu"), cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.ogrenciBasvuruDurumlari }, minWidth: 150
      },
      {
        field: 'odeme_onay', headerName: this.translate.instant("TEXT.odeme_onay"), cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.trueFalse }, minWidth: 130
      },
      {
        field: 'resim',
        headerName: this.translate.instant("TEXT.resim"),
        minWidth: 100,
        width: 100,
        maxWidth: 100,
        cellRenderer: this.customImgCellRendererFunc
      },
      { field: 'pasaport_dosya', headerName: this.translate.instant("TEXT.pasaport_dosya"), minWidth: 150, cellRenderer: 'fileViewer' },
      {

        field: 'idd', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 140, cellRenderer: 'agGridActionComponent', cellEditorParams: {
          values: [{ action: GridActionEnum.create.toString(), text: this.translate.instant('TEXT.EDIT'), icon: 'edit' },],
        }
      },
    ];
  }

  editModal(data) {
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    const dialogRef = this.dialog.open(SinavOgrencilerEditComponent, { data, width: "70%", maxWidth: "650px", minWidth: "330px", maxHeight: "85%" });

    dialogRef.afterClosed().pipe(tap(refData => {
      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (!refData) {
        return;
      }
    }), takeUntil(this.unsubscribe)).subscribe();

  }

  importModal(data) {
    data.basvuru_id = this.basvuruId;
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    const dialogRef = this.dialog.open(SinavOgrencilerImportComponent, { data, width: "70%", minWidth: "330px", maxHeight: "600px" });

    dialogRef.afterClosed().pipe(tap(refData => {
      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (!refData) {
        return;
      }
    }), takeUntil(this.unsubscribe)).subscribe();
  }

  matSelectionChange(event: any) {
    var ogrBasvuruIds = this.agGrid.api.getSelectedRows().map(m => m.id);
    var data = { ogrBasvuruIds: ogrBasvuruIds, islemTuru: event.value, basvuruId: this.basvuruId }
    const dialogRef = this.dialog.open(TopluSinavOnayComponent, { data, width: "500px" });
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

  /**
 * On destroy
 */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  customImgCellRendererFunc(params): string {
    let html = '<img src="' + params.value + '" width="100px" height="100px"/>';
    return html;
  }

}
