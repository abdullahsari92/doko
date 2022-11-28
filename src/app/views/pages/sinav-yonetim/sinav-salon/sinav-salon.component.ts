import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { SinavMerkez } from '../../../../views/models/SinavMerkez';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { DeleteEntityDialogComponent } from '../../../../views/partials/content/crud';
import { BasvuruService } from '../../../../views/services/basvuru.service';
import { SinavSalonAddComponent } from './sinav-salon-add/sinav-salon-add.component';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'kt-sinav-salon',
  templateUrl: './sinav-salon.component.html',
  styleUrls: ['./sinav-salon.component.scss']
})
export class SinavSalonComponent implements OnInit {

  @Input() sinavMerkez: SinavMerkez = new SinavMerkez()
  @Input() basvuruId: number;
  private unsubscribe: Subject<any>;

  loader: boolean = false;
  agGrid: AgGridAngular;
  columnDefs: any
  @Input() rowData: any
  constructor(
    private localStorageService: LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private basvuruService: BasvuruService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {
      this.unsubscribe = new Subject();

  }


  ngOnInit(): void {

    this.agGridInit();

  }

  getList(merkezId) {

    this.basvuruService.getSinavSalonList(merkezId).pipe(tap(res => {
      if (res.result) {
        this.rowData = res.data;
      }
      else {
        console.error(res.error.code, res.error.message);
      }
    }),takeUntil(this.unsubscribe), finalize(() => {

      this.cdr.markForCheck();
    })).subscribe()

  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  editModal(data: any) {

    data.basvuru_id = this.basvuruId;
    data.merkez_id = this.sinavMerkez.id;
    const dialogRef = this.dialog.open(SinavSalonAddComponent, { data });

    dialogRef.afterClosed().pipe(tap(refData => {

      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (!refData) {
        return;
      }
      this.getList(this.sinavMerkez.id);
    }),takeUntil(this.unsubscribe)).subscribe();  
  
  }

  remove(data) {

    data.basvuru_id = this.basvuruId;
    data.merkez_id = this.sinavMerkez.id;
    var description = this.translate.instant('TEXT.DELETE_WANT');
    var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      width: '440px',
    });

    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      if (!refData) {
        //burada modal kapanıyor
        return;
      }
      this.basvuruService.getSinavSalonDelete(data.id).subscribe(res => {
    

        if (res.result) {
          this.getList(this.sinavMerkez.id);
        }
      });

    });
  }


  agGridInit() {

    this.columnDefs = [
      // { field: 'id' ,   headerName:this.translate.instant("TEXT.id"), sortable: true, filter: true,  headerCheckboxSelection: true,  checkboxSelection: true, width:40 },
      // { field: 'basvuru_id' ,   headerName:this.translate.instant("TEXT.basvuru_id"), sortable: true , cellStyle: {color: '#ccce75'}},
      { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), headerCheckboxSelection: true, checkboxSelection: true, minWidth: 150 },
      { field: 'adi_en', headerName: this.translate.instant("TEXT.adi_en"), minWidth: 130 },
      { field: 'bina_adi', headerName: this.translate.instant("TEXT.bina_adi") },
      { field: 'kontenjan', headerName: this.translate.instant("TEXT.kontenjan") },
      { field: 'adres', headerName: this.translate.instant("TEXT.adres") },
      { field: 'gozetmen', headerName: this.translate.instant("TEXT.gozetmen"), minWidth: 120 },
      { field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), minWidth: 100, cellRenderer: 'changeStatus', },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 130, cellRenderer: 'agGridActionComponent' },

    ];
  }

  rowDataList(): any {

    var promise = new Promise((resolve, reject) => {
      this.getList(this.sinavMerkez.id);
      setTimeout(() => {
        resolve(true);
      }, 1000);
    }).then(() => {

      this.agGridInit()
      this.cdr.markForCheck();
      return true;

    });

  }

  ngOnChanges() {
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


}
