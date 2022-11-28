import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { BankaTanimService } from '../../../../../views/services/banka-tanim.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { BankaAddComponent } from '../banka-add/banka-add.component';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { TranslateService } from '../../../../../core/services/translate.service';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'kt-banka-list',
  templateUrl: './banka-list.component.html',
  styleUrls: ['./banka-list.component.scss']
})

export class BankaListComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any
  private unsubscribe: Subject<any>;


  constructor(
    private localStorageService: LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private bankaService: BankaTanimService,
    private translate: TranslateService,
    private dialog: MatDialog) { 

  this.unsubscribe = new Subject();

    }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }

  getList() {
    this.bankaService.getList().subscribe(res => {
      this.rowData = res.data;
    })
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  editModal(data) {

    const dialogRef = this.dialog.open(BankaAddComponent, { data });
    dialogRef.afterClosed().pipe(tap(refData => {
      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (!refData) {
        return;
      }
      this.saveBanka(refData.data);
    }),takeUntil(this.unsubscribe)).subscribe();  
  }

  saveBanka(data) {

    const _messageType = data.id ? MessageType.Update : MessageType.Create;

    this.bankaService.save(data).subscribe(res => {
      if (res.result) {
        this.agGrid.api.redrawRows();
        this.dialog.closeAll();
        let saveMessageTranslateParam = data.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');
        this.getList();
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
      }
    })

  }


  remove(data) {

    var description = this.translate.instant('TEXT.DELETE_WANT');
    var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      //  data: { title, description, waitDesciption },
      width: '440px'
    });

    dialogRef.afterClosed().pipe(tap(refData => {
      this.agGrid.api.redrawRows();
      this.agGrid.api.deselectAll();
      if (!refData) {
        return;
      }
      this.getList();

    }),takeUntil(this.unsubscribe)).subscribe();  

  }

  agGridInit() {

    this.columnDefs = [
      { field: 'turu', headerName: this.translate.instant("TEXT.turu"), sortable: true, hide: 'true' },
      { field: 'adi', headerName: this.translate.instant("TEXT.adi"), sortable: true, headerCheckboxSelection: true, checkboxSelection: true, },
      { field: 'parametreler', headerName: this.translate.instant("TEXT.parametreler"), minWidth: 175 },
      { field: 'ekleyen_id', headerName: this.translate.instant("TEXT.ekleyen_id"), hide: 'true', minWidth: 175 },
      { field: 'ekleme_tarihi', headerName: this.translate.instant("TEXT.ekleme_tarihi"), hide: 'true', minWidth: 175 },
      { field: 'duzenleyen_id', headerName: this.translate.instant("TEXT.duzenleyen_id"), hide: 'true', minWidth: 175 },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', }
    ]
  }

}
