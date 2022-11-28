import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { TranslateService } from '../../../../core/services/translate.service';
import { BasvuruService } from '../../../services/basvuru.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteEntityDialogComponent } from '../../../partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { GridActionEnum } from '../../../../core/Enums/grid-action.enum';

@Component({
  selector: 'kt-basvuru-bolumler',
  templateUrl: './basvuru-bolumler.component.html',
  styleUrls: ['./basvuru-bolumler.component.scss']
})

export class BasvuruBolumlerComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any;
  rowData: any;
  basvuruId: any;

  constructor(
    private translate: TranslateService,
    private BasvuruService: BasvuruService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,

  ) {
    // this.basvuruId = parseInt(this.router.getCurrentNavigation().extras.state.toString());
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.basvuruId = params.get("basvuruId");
      console.log(' basvuruId', this.basvuruId)
      this.agGridInit();
      this.getlist();
    })
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  goBackWithoutId() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  getlist() {
    console.log('getBasvuruBolumleriList111 ', this.basvuruId)
    this.BasvuruService.getBasvuruBolumleriList(this.basvuruId).subscribe(res => {
      if (res.result) {
        console.log('getBasvuruBolumleriList ', res)
        this.rowData = res.data;
      }
    })


    // this.BasvuruService.getBasvuruBolumleriList(this.basvuruId).pipe(tap(res => {
    //   console.log('BolumleriList ', res)

    //   if (res.result) {
    //     console.log('getBasvuruBolumleriList ', res)
    //     this.rowData = res.data;
    //   }
    // }), finalize(() => {
    //   this.cdr.markForCheck();
    // })).subscribe(res => {
    // })




  }

  add() {
    this.router.navigate(['../add'], { state: this.basvuruId, relativeTo: this.activatedRoute });
  }

  remove(data) {
    var description = this.translate.instant('TEXT.DELETE_WANT');
    var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      //  data: { title, description, waitDesciption },
      width: '440px'
    });

    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.redrawRows();
      this.agGrid.api.deselectAll();
      if (!refData) {
        //burada modal kapanıyor
        return;
      }

      this.BasvuruService.getBasvuruBolumleriDelete(data.id).subscribe(res => {
        if (res.result) {
          this.getlist();
        }
      });
    });

  }

  kontenjan(data) {
    console.log('kontejan  edit ', data)
    this.router.navigate(['../kontenjan'], { state: { bolId: data.id, basvuruId: this.basvuruId }, relativeTo: this.activatedRoute, });
  }

  agGridInit() {
    this.columnDefs = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 40, hide: true },
      { field: 'fadi_tr', headerName: this.translate.instant('TEXT.fakulte_adi'), sortable: true },
      { field: 'fadi_en', headerName: this.translate.instant('TEXT.fakulte_adi') + ' EN', minWidth: 150 },
      { field: 'badi_tr', headerName: this.translate.instant('TEXT.bolum_adi'), sortable: true },
      { field: 'badi_en', headerName: this.translate.instant('TEXT.bolum_adi') + ' EN', minWidth: 150 },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', },
    ];
  }

}
