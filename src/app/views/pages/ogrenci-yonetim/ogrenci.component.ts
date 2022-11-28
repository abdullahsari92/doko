import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { OgrenciService } from '../../../views/services/ogrenci.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LayoutUtilsService } from '../../../core/_base/crud';
import { StatusDisplayEnum } from '../../../views/partials/ag-grid/StatusDisplay.enum';
import { TranslateService } from '../../../core/services/translate.service';
import { DeleteEntityDialogComponent } from '../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'kt-ogrenci',
  templateUrl: './ogrenci.component.html',
  styleUrls: ['./ogrenci.component.scss']
})
export class OgrenciComponent implements OnInit {
  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any
  ogrenciListModel: any;
  private unsubscribe: Subject<any>;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private ogrenciService: OgrenciService,
    private activatedRoute: ActivatedRoute,
    private cdf:ChangeDetectorRef,
    private dialog: MatDialog) {

  this.unsubscribe = new Subject();

  }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }
  agGridSet(agGrid:any)
  {
    this.agGrid =agGrid;
  }
  //test amaçlı yapıldı
  // uploadForm: FormGroup;
  // initRegisterForm() {
  //   this.uploadForm = new FormGroup({ file: new FormControl("") })

  // }

  getList() {
    this.ogrenciService.getList().pipe(tap(res=>{
      console.log('ogrenci ', res);
      if (res.result) {
        this.rowData = res.data;
      }
      else {
        console.error(res.error.code, res.error.message);
      }
    }),finalize(()=>{

      this.cdf.markForCheck();

    })).subscribe();

  }

  editData(data) {
    console.log('editdata', data);
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    this.router.navigate(['./detail'], { state: data, relativeTo: this.activatedRoute });
  }

  remove(data) {
    var description = this.translate.instant('TEXT.DELETE_WANT');
    var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      width: '440px'
    });

    
    dialogRef.afterClosed().pipe(tap(refData => {
      this.agGrid.api.deselectAll();

      if (!refData) {
        return;
      }
      this.ogrenciService.remove(data.id).subscribe(res => {
        if (res.result) {
          this.getList();
        }
      });
    }),takeUntil(this.unsubscribe)).subscribe();  



  }

  agGridInit() {
    this.columnDefs = [
      { field: 'aday_no', headerName: this.translate.instant("TEXT.aday_no"), sortable: true, cellStyle: { color: '#ccce75' } },
      { field: 'adi', headerName: this.translate.instant("TEXT.adi"), headerCheckboxSelection: true, checkboxSelection: true, minWidth: 175 },
      { field: 'soyadi', headerName: this.translate.instant("TEXT.soyadi"), minWidth: 150 },
      { field: 'ulke_kodu', headerName: this.translate.instant("TEXT.ulke"), minWidth: 150 },
      { field: 'obs_no', headerName: this.translate.instant("TEXT.obs_no"), minWidth: 150 },
      { field: 'kurum_adi', headerName: this.translate.instant("TEXT.kurum_adi"), sortable: true, cellStyle: { color: 'green' } },
      { field: 'kimlik_no', headerName: this.translate.instant("TEXT.kimlik_no"), },
      { field: 'anne_adi', headerName: this.translate.instant("TEXT.anne_adi"), minWidth: 150 },
      { field: 'baba_adi', headerName: this.translate.instant("TEXT.baba_adi"), minWidth: 150 },
      { field: 'dogum_yeri', headerName: this.translate.instant("TEXT.dogum_yeri"), minWidth: 150 },
      { field: 'dogum_tarihi', headerName: this.translate.instant("TEXT.dogum_tarihi"), minWidth: 150 },
      { field: 'cinsiyet', headerName: this.translate.instant("TEXT.cinsiyet"), minWidth: 150 },
      { field: 'eposta', headerName: this.translate.instant("TEXT.eposta"), minWidth: 150 },
      { field: 'sehir', headerName: this.translate.instant("TEXT.sehir"), minWidth: 150 },
      { field: 'adres', headerName: this.translate.instant("TEXT.adres"), minWidth: 150 },
      { field: 'telefon', headerName: this.translate.instant("TEXT.telefon"), minWidth: 150 },
      { field: 'telefon2', headerName: this.translate.instant("TEXT.telefon2"), minWidth: 150 },
      {
        field: 'resim', headerName: this.translate.instant("TEXT.resim"),
        minWidth: 200,
        width: 240,
        maxWidth: 270,
        cellRenderer: 'imgViewer'
      },
      {
        field: 'durumu', headerName: this.translate.instant("TEXT.durumu"),
        minWidth: 150,
        cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.ogrenciDurumlari }
      },
      { field: 'son_oturum', headerName: this.translate.instant("TEXT.son_oturum"), minWidth: 175, },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 140, cellRenderer: 'agGridActionComponent', },
    ];
  }
}