import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasvuruService } from '../../../services/basvuru.service';
import { AgGridAngular } from 'ag-grid-angular';
import { TranslateService } from '../../../../core/services/translate.service';
import { MatDialog } from '@angular/material/dialog';
import { BasvuruBildirimlerAddComponent } from './basvuru-bildirimler-add/basvuru-bildirimler-add.component';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { DeleteEntityDialogComponent } from '../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'kt-basvuru-bildirimler',
  templateUrl: './basvuru-bildirimler.component.html',
  styleUrls: ['./basvuru-bildirimler.component.scss']
})
export class BasvuruBildirimlerComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any
  basvuruId: any;
  getBildirimList: any;
  rowData: any;
  private unsubscribe: Subject<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private basvuruService: BasvuruService,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,

  ) {
  this.unsubscribe = new Subject();

   }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.basvuruId = params.get("basvuruId");
      this.agGridInit();
      this.getList();
    })

  }

  getList() {

    this.getBildirimList = [];
    this.basvuruService.getBildirimList(this.basvuruId).subscribe(res => {
      console.log(res.data);
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
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 40,hide:true },
      { field: 'turu', headerName: this.translate.instant("TEXT.turu"), minWidth: 150 },
      { field: 'mesaj', headerName: this.translate.instant("TEXT.mesaj"), minWidth: 150 },
      { field: 'baslama_tarihi', headerName: this.translate.instant("TEXT.baslangic_tarihi"), minWidth: 150 },
      { field: 'bitis_tarihi', headerName: this.translate.instant("TEXT.bitis_tarihi"), minWidth: 150 },
      { field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), minWidth: 175, cellRenderer: 'changeStatus' },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', },
    ];
  }

  editModal(data) {
    data.basvuru_id = this.basvuruId;
    const dialogRef = this.dialog.open(BasvuruBildirimlerAddComponent, { data, width: "70%", maxWidth: "600px", minWidth: "330px", maxHeight: "85%" });


    dialogRef.afterClosed().pipe(tap(refData => {
      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (!refData) {
        return;
      }
      this.saveBildirim(refData.data);
    }),takeUntil(this.unsubscribe)).subscribe();  

  }

  saveBildirim(data) {
    const _messageType = data.id ? MessageType.Update : MessageType.Create;
    this.basvuruService.getBildirimSave(data, this.basvuruId).subscribe(res => {
      if (res.result) {
        this.dialog.closeAll();
        let saveMessageTranslateParam = data.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');
        this.getList();
        this.agGrid.api.refreshCells();
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
      }
    })

  }

  removeModal(data) {

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, { width: "70%", maxWidth: "600px", maxHeight: "85%" });
    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      if (!refData) {
        //burada modal kapanıyor
        return;
      }
      this.basvuruService.getBildirimDelete(data.id).subscribe();
      var _deleteMessage = this.translate.instant('TEXT.DELETE_SUCCESSFUL');
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      this.getList();
    });

  }

  goBackWithoutId() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
