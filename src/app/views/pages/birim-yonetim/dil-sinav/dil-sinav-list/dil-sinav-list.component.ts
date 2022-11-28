import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import { LocalStorageService } from '../../../core/services/local-storage.service';
@Component({
  selector: 'kt-dil-sinav-list',
  templateUrl: './dil-sinav-list.component.html',
  styleUrls: ['./dil-sinav-list.component.scss']
})
export class DilSinavListComponent implements OnInit {
  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any

  private unsubscribe: Subject<any>;

  constructor(
    private translate: TranslateService,
    private BirimYonetimService: BirimYonetimService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog

  ) { 
  this.unsubscribe = new Subject();

  }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }

  getList() {

    this.BirimYonetimService.getListLangExam().subscribe(res => {

      if (res.result) {

        this.rowData = res.data;
      }

    })
  }
  
  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  editData(data) {

    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    this.router.navigate(['../add'], { state: data, relativeTo: this.activatedRoute });

  }

  remove(data) {

    var description = this.translate.instant('TEXT.DELETE_WANT');
    var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      width: '440px'
    });

    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      if (!refData) {
        //burada modal kapanıyor
        return;
      }


    });

    dialogRef.afterClosed().pipe(tap(refData => {
      if (!refData) {
        return;
      }
      this.BirimYonetimService.removeLangExam(data.id).subscribe(res => {

        if (res.result) {
          this.getList();
        }
      });

    }),takeUntil(this.unsubscribe)).subscribe();  

  }

  agGridInit() {

    this.columnDefs = [
      //{ field: 'id' ,          headerName:this.translate.instant("TEXT.id"), sortable: true, filter: true,  headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,  checkboxSelection: true, width:40 },
      { field: 'dil_kodu', headerName: this.translate.instant("TEXT.dil_kodu"), sortable: true, headerCheckboxSelection: true, checkboxSelection: true, minWidth: 175 },
      { field: 'kodu', headerName: this.translate.instant("TEXT.kodu"), minWidth: 175 },
      { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), sortable: true, minWidth: 175 },
      { field: 'adi_en', headerName: this.translate.instant("TEXT.adi_en"), minWidth: 175 },
      { field: 'seviyeler', headerName: this.translate.instant("TEXT.seviyeler"), minWidth: 175 },
      { field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), minWidth: 175, cellRenderer: 'changeStatus' },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', },
    ];

  }


}
