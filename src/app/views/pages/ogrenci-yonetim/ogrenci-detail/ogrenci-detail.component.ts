import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { StatusDisplayEnum } from '../../../../views/partials/ag-grid/StatusDisplay.enum';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { EgitimDonemi } from '../../../../views/models/egitimDonemi';
import { OgrenciService } from '../../../../views/services/ogrenci.service';
import { OgrenciModel } from '../../../../views/models/ogrenciModel';
import { TranslateService } from '../../../../core/services/translate.service';
import { DokoSettingsService } from '../../../../core/services/doko-settings.service';

@Component({
  selector: 'kt-ogrenci-detail',
  templateUrl: './ogrenci-detail.component.html',
  styleUrls: ['./ogrenci-detail.component.scss']
})
export class OgrenciDetailComponent implements OnInit {
  
  agGrid: AgGridAngular;
  columnDefs: any;
  rowData: any;
  rowDataSinavList: any;
  columnDefSinav:any;
  data:any;
  ogrenciModel:OgrenciModel = new OgrenciModel();
  private unsubscribe = new Subject();
  egitimDonemi:EgitimDonemi=new EgitimDonemi();
  constructor(
    private ogrenciService:OgrenciService,
    private router: Router,
    private localStorageService:LocalStorageService,
    private activatedRoute:ActivatedRoute,
    private translate: TranslateService,
    private cdr:ChangeDetectorRef,
    public dokoSettingsService:DokoSettingsService

  ) { 

    this.data = this.router.getCurrentNavigation().extras.state;
    this.egitimDonemi = this.localStorageService.getItem('egitimDonemi') as EgitimDonemi;


  }

  ngOnInit(): void {

    this.agGridInit();
    this.getDetail();
  }
  

  editStudent() {
    console.log('editdata', this.data);
    this.data.resim = this.ogrenciModel.resim;
    this.router.navigate(['../add'], { state: this.data, relativeTo: this.activatedRoute });
  }

getDetail()
{

   console.log('  this.data', this.data)
  this.ogrenciService.get_student_detail(this.data.id,this.egitimDonemi.id).pipe(tap(res=>{

this.rowData = res.data.basvuru;
this.ogrenciModel = res.data.ogrenci;
this.rowDataSinavList = res.data.sinav;
    console.log(' gelen data',res)
  }),takeUntil(this.unsubscribe),finalize(()=>{

    this.cdr.markForCheck();
  })).subscribe();

}

goBackWithoutId() {
  this.router.navigate(['../list'], { relativeTo: this.activatedRoute  });
}


editData(data) {
  console.log('editdata', data);
  let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
  this.router.navigate(['./detail'], { state: data, relativeTo: this.activatedRoute });
}
agGridInit() {
  this.columnDefs = [
    { field: 'basvuruId', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 40 },
    { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi"), minWidth: 130 },
    { field: 'baslangic_tarihi', headerName: this.translate.instant("TEXT.soyadi"), minWidth: 130 },
    { field: 'bitis_tarihi', headerName: this.translate.instant("TEXT.cinsiyet"), minWidth: 130 },
    { field: 'odeme_onay', headerName: this.translate.instant("TEXT.odeme_onay"), cellRenderer: 'changeStatus',
    cellEditorParams: { values: StatusDisplayEnum.trueFalse }, minWidth: 130 },
    {
      field: 'durumu', headerName: this.translate.instant("TEXT.ucret_odeme_turu"), cellRenderer: 'changeStatus',
      cellEditorParams: { values: StatusDisplayEnum.ogrenciBasvuruDurumlari }, minWidth: 130
    },      

    // {
    //   field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 140, cellRenderer: 'agGridActionComponent', cellEditorParams: {
    //     values: [{ action: GridActionEnum.create.toString(), text: this.translate.instant('TEXT.EDIT'), icon: 'edit' },],
    //   }
    // },
  ];
  this.columnDefSinav = [
    { field: 'basvuruId', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 40 },
    { field: 'basvuruAdiTr', headerName: this.translate.instant("TEXT.sinav_adi"), minWidth: 130 },
    { field: 'baslangic_tarihi', headerName: this.translate.instant("TEXT.soyadi"), minWidth: 130 },
    { field: 'bitis_tarihi', headerName: this.translate.instant("TEXT.cinsiyet"), minWidth: 130 },
    { field: 'odeme_onay', headerName: this.translate.instant("TEXT.odeme_onay"), cellRenderer: 'changeStatus',
    cellEditorParams: { values: StatusDisplayEnum.trueFalse }, minWidth: 130 },
    {
      field: 'durumu', headerName: this.translate.instant("TEXT.ucret_odeme_turu"), cellRenderer: 'changeStatus',
      cellEditorParams: { values: StatusDisplayEnum.ogrenciBasvuruDurumlari }, minWidth: 130
    },      

    // {
    //   field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 140, cellRenderer: 'agGridActionComponent', cellEditorParams: {
    //     values: [{ action: GridActionEnum.create.toString(), text: this.translate.instant('TEXT.EDIT'), icon: 'edit' },],
    //   }
    // },
  ];
}

}

