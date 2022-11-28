import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { GridActionEnum } from '../../../../../core/Enums/grid-action.enum';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'kt-bolum-list',
  templateUrl: './bolum-list.component.html',
  styleUrls: ['./bolum-list.component.scss']
})

export class BolumListComponent implements OnInit {
  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any;
  private unsubscribe: Subject<any>;

  constructor(
    private translate: TranslateService,
    private BirimYonetimService: BirimYonetimService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdf:ChangeDetectorRef,
    private dialog: MatDialog) {

      this.unsubscribe = new Subject();

  }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }

  getList() {
    this.BirimYonetimService.getListDepartment().pipe(tap(res=>{
      if (res.result) {
        this.rowData = res.data;
      }
    }),takeUntil(this.unsubscribe),finalize(()=>{

    this.cdf.markForCheck();

    })).subscribe();

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
        return;
      }

      this.BirimYonetimService.removeDepartmen(data.id).subscribe(res => {

        if (res.result) {
          this.getList();
        }
      });

    });
  }

  kontenjanData(data) {
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    this.router.navigate(['../kontenjan'], { state: data, relativeTo: this.activatedRoute });
  }
  agGridInit() {

    this.columnDefs = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, hide: true },
      { field: 'fakulte_kodu', headerName: this.translate.instant("TEXT.fakulte_kodu"), sortable: true, cellStyle: { color: '#ccce75' }, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 40 },
      { field: 'fakulte_id', headerName: this.translate.instant("TEXT.fakulte_id"), hide: true },
      { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), minWidth: 175 },
      { field: 'adi_en', headerName: this.translate.instant("TEXT.adi_en"), minWidth: 175 },
      { field: 'kodu', headerName: this.translate.instant("TEXT.kodu"), minWidth: 175 },
      { field: 'kontenjan', headerName: this.translate.instant("TEXT.kontenjan"), minWidth: 175 },
      { field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), minWidth: 175, cellRenderer: 'changeStatus' },
      { field: 'ekleyen_id', headerName: this.translate.instant("TEXT.ekleyen_id"), hide: 'true' },
      { field: 'ekleme_tarihi', headerName: this.translate.instant("TEXT.ekleme_tarihi"), hide: 'true' },
      { field: 'duzenleyen_id', headerName: this.translate.instant("TEXT.duzenleyen_id"), hide: 'true' },
      {
        field: 'id2', headerName: this.translate.instant("TEXT.kontenjanlar"), minWidth: 175, cellRenderer: 'agGridActionComponent', cellEditorParams: {
          values: [{ action: GridActionEnum.reminder.toString(), text: this.translate.instant('TEXT.EDIT'), icon: 'list' },],
        }
      },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', },

    ];

  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


}


