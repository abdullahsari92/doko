import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { BirimYonetimService } from '../../../../services/birim_yonetim.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteEntityDialogComponent } from '../../../../partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { OgrenciModel } from '../../../../models/ogrenciModel';


@Component({
  selector: 'kt-bolum-kontenjan',
  templateUrl: './kontenjan.component.html',
  styleUrls: ['./kontenjan.component.scss']
})
export class BolumKontenjanComponent implements OnInit {

  addModel: any;
  agGrid: AgGridAngular;
  columnDefs: any;
  rowData: any;
  bolId: any;
  data: any;
  isEdit: boolean = false;

  buttonSave: string = this.translate.instant("TEXT.SAVE");

  constructor(
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private BirimYonetimService: BirimYonetimService,
    private dialog: MatDialog,
    private cdf: ChangeDetectorRef,

  ) {
    //this.basvuruId = this.router.getCurrentNavigation().extras.state.basvuruId;
    //this.bolId = this.router.getCurrentNavigation().extras.state.bolId;
    this.bolId = this.router.getCurrentNavigation().extras.state.id;
    console.log('this.bolId',this.bolId);

  }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }

  editData(data) {

    new Promise((resolve, reject) => {

      this.addModel = data;
      this.isEdit = true;

      setTimeout(() => {
        resolve(true);
      }, 500);
    }).then(() => {

      this.cdf.markForCheck();

    })

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

      this.BirimYonetimService.removeQuota(data).subscribe(res => {
        if (res.result) {
          this.getList();
        }
      });
    });

    
  }

  getList() {
    this.BirimYonetimService.getListQuota(this.bolId).subscribe(res => {
      console.log('getListres',res);
      console.log('getList',res.data);
      if (res.result) {
        this.rowData = res.data;
      }
    })
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  agGridInit() {
    this.columnDefs = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, hide: true },
      { field: 'ulke_kodu', headerName: this.translate.instant("TEXT.ulke_kodu"), minWidth: 175 },
      { field: 'ulke_adi', headerName: this.translate.instant("TEXT.ulke_adi"), minWidth: 175 },
      { field: 'kontenjan', headerName: this.translate.instant("TEXT.kontenjan"), minWidth: 175 },
      { field: 'min_kontenjan', headerName: this.translate.instant("TEXT.min_kontenjan"), minWidth: 175 },
      { field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), minWidth: 175 },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', },

    ];

  }

  goBackWithoutId() {
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

}
