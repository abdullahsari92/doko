import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';

@Component({
  selector: 'kt-fakulte-list',
  templateUrl: './fakulte-list.component.html',
  styleUrls: ['./fakulte-list.component.scss']
})
export class FakulteListComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any

  constructor(
    private translate: TranslateService,
    private BirimYonetimService: BirimYonetimService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }

  getList() {

    this.BirimYonetimService.getListFaculty().subscribe(res => {
      //console.log('birimDepartment ',res);
      if (res.result) {
        this.rowData = res.data;
      }
      else {
        //console.error(res.error.code,res.error.message);          
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

    var description = this.translate.instant('TEXT.DELETE_WANT');
    var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      //  data: { title, description, waitDesciption },
      width: '440px'
    });

    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      if (!refData) {
        //burada modal kapanıyor
        return;
      }

      this.BirimYonetimService.removeFaculty(data.id).subscribe(res => {
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
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, width: 40, hide: true },
      { field: 'adi_en', headerName: this.translate.instant("TEXT.adi_en"), sortable: true, cellStyle: { color: '#ccce75' }, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, },
      { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), sortable: true, filter: 'agNumberColumnFilter' },
      { field: 'kodu', headerName: this.translate.instant("TEXT.kodu"), minWidth: 175 },
      { field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), minWidth: 175, cellRenderer: 'changeStatus' },
      { field: 'ekleyen_id', headerName: this.translate.instant("TEXT.ekleyen_id"), minWidth: 175, hide: 'true' },
      { field: 'ekleme_tarihi', headerName: this.translate.instant("TEXT.ekleme_tarihi"), minWidth: 175, hide: 'true' },
      { field: 'duzenleyen_id', headerName: this.translate.instant("TEXT.duzenleyen_id"), minWidth: 175, hide: 'true' },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', },
    ];

  }

}
