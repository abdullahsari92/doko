import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { StatusDisplayEnum } from '../../../../../views/partials/ag-grid/StatusDisplay.enum';
import { BirimService } from '../../../../services/birim.service';
import { BirimYonetimService } from '../../../../services/birim_yonetim.service';

@Component({
  selector: 'kt-basvuru-list',
  templateUrl: './basvuru-list.component.html',
  styleUrls: ['./basvuru-list.component.scss']
})
export class BasvuruListComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any
  constructor(

    private translate: TranslateService,
    private birimService: BirimService,
    private BirimYonetimService: BirimYonetimService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) { }


  ngOnInit(): void {

    this.agGridInit();
    this.getList();

  }

  getList() {

    this.BirimYonetimService.getListRecourse().subscribe(res => {

      console.log('birim ', res);
      if (res.result) {
        this.rowData = res.data;
      }
      else {
        console.error(res.error.code, res.error.message);
      }

    })
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  editData(data) {

    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    //this.router.navigate([url], { relativeTo: this.activatedRoute});
    this.router.navigate(['../add'], { state: data, relativeTo: this.activatedRoute });
    //  this.router.navigateByUrl('/birim/add', { state:  { id:1 , name:'Angular' } });

  }

  remove(data) {
    this.birimService.deleteUnit(data.id).subscribe(res => {
      if (res.result) {
        this.getList();
      }

    })
  }

  agGridInit() {

    //	console.log(' bankaValid:',this.translate.instant('TEXT.TRUE', {name: name}));
    var tanim = this.translate.instant('TEXT.TRUE');

    console.log('tanim ', tanim)
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
