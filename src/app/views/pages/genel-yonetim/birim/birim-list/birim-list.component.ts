import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { BirimModel } from '../../../../models/birimModel';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { BirimService } from '../../../../services/birim.service';
import { StatusDisplayEnum } from '../../../../partials/ag-grid/StatusDisplay.enum';
import { DeleteEntityDialogComponent } from '../../../../partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'kt-birim-list',
  templateUrl: './birim-list.component.html',
  styleUrls: ['./birim-list.component.scss']
})
export class BirimListComponent implements OnInit {
  birimModel: BirimModel = new BirimModel();
  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any
  constructor(
    private localStorageService: LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private birimService: BirimService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog) {

  }


  ngOnInit(): void {

    this.agGridInit();
    this.getList();

  }

  getList() {
    this.birimService.getListUnit().pipe(tap(res => {
      if (res.result) {
        this.rowData = res.data;
      }
    }), finalize(() => {
      this.cdr.markForCheck();
    })).subscribe();

  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  editData(data) {

    //console.log('data ',data);
    this.birimModel = data;

    console.log('edit data birimModel ', this.birimModel)
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    //this.router.navigate([url], { relativeTo: this.activatedRoute});
    this.router.navigate(['../birim/add'], { state: this.birimModel, relativeTo: this.activatedRoute });
    //  this.router.navigateByUrl('/birim/add', { state:  { id:1 , name:'Angular' } });

  }

  remove(data) {

    //var title ="Silme!!";
    var description = this.translate.instant('TEXT.DELETE_WANT');
    var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      //  data: { title, description, waitDesciption },
      width: '440px',
    });

    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      if (!refData) {
        //burada modal kapanıyor
        return;
      }

      this.birimService.deleteUnit(data.id).subscribe(res => {

        //console.log('silme  datası ', res)
        if (res.result) {
          this.getList();
        }
      });
      // var _deleteMessage= this.translate.instant('TEXT.DELETE_SUCCESSFUL');
      // this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);

    });
  }



  agGridInit() {
    this.columnDefs = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 40 },
      //{ field: 'birim_uid' ,  headerName:this.translate.instant("TEXT.birim_uid", sortable: true,   cellStyle: {color: 'green'}},
      { field: 'default_dil', headerName: this.translate.instant("TEXT.default_dil"), sortable: true, cellStyle: { color: '#ccce75' } },
      { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi"), minWidth: 140, cellRenderer: 'agGridLang', },
      //{ field: 'adi_en' ,  headerName:this.translate.instant("TEXT.adi_en"),minWidth: 140 },
      { field: 'kisa_adi', headerName: this.translate.instant("TEXT.kisa_adi"), minWidth: 140 },
      { field: 'url', headerName: this.translate.instant("TEXT.url"), minWidth: 140 },
      { field: 'telefon', headerName: this.translate.instant("TEXT.telefon"), minWidth: 140 },
      { field: 'adres_tr', headerName: this.translate.instant("TEXT.adres"), minWidth: 140, cellRenderer: 'agGridLang', cellEditorParams: { values: 'adres_en', } },
      //{ field: 'adres_en' ,         headerName:this.translate.instant("TEXT.adres_en"),minWidth: 140 },
      {
        field: 'uyruk_bilgisi_durumu', headerName: this.translate.instant("TEXT.uyruk_bilgisi_durumu"), minWidth: 140, cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.trueFalse }
      },
      {
        field: 'kayit_turu_durumu', headerName: this.translate.instant("TEXT.kayit_turu_durumu"), minWidth: 140, cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.trueFalse }
      },
      { field: 'kvkk_metni_url_tr', headerName: this.translate.instant("TEXT.kvkk_metni_url_tr"), minWidth: 140 },
      { field: 'kvkk_metni_url_en', headerName: this.translate.instant("TEXT.kvkk_metni_url_en"), minWidth: 140 },
      { field: 'logo_url', headerName: this.translate.instant("TEXT.logo_url"), minWidth: 140 },
      { field: 'acik_riza_beyani_tr', headerName: this.translate.instant("TEXT.acik_riza_beyani_tr"), minWidth: 140 },
      { field: 'acik_riza_beyani_en', headerName: this.translate.instant("TEXT.acik_riza_beyani_en"), minWidth: 140 },
      { field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), minWidth: 140, cellRenderer: 'changeStatus' },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 140, cellRenderer: 'agGridActionComponent', },

    ];

  }
}
