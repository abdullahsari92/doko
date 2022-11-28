import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { KonsoloslukTanimService } from '../../../../services/konsolosluk-tanim.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { KonsoloslukAddComponent } from '../konsolosluk-add/konsolosluk-add.component';
import { TranslateService } from '../../../../../core/services/translate.service';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';

@Component({
  selector: 'kt-konsolosluk-list',
  templateUrl: './konsolosluk-list.component.html',
  styleUrls: ['./konsolosluk-list.component.scss']
})
export class KonsoloslukListComponent implements OnInit {
  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any

  constructor(
    private localStorageService: LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private konsoloslukService: KonsoloslukTanimService,
    private translate: TranslateService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }

  getList() {
    this.konsoloslukService.getList().subscribe(res => {
      this.rowData = res.data;
    })
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  remove(data) {

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, { width: "70%", maxWidth: "600px", maxHeight: "85%" });

    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      if (!refData) {
        return;
      }
      this.konsoloslukService.delete(data.id).subscribe();
      var _deleteMessage = this.translate.instant('TEXT.DELETE_SUCCESSFUL');
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      this.getList();

    });
  }

  editModal(data) {

    const dialogRef = this.dialog.open(KonsoloslukAddComponent, { data, width: "70%", maxWidth: "600px", minWidth: "330px", maxHeight: "85%" });
    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (!refData) {
        return;
      }
      this.saveKonsolosluk(refData.data);
    });
  }

  saveKonsolosluk(data) {

    const _messageType = data.id ? MessageType.Update : MessageType.Create;

    this.konsoloslukService.save(data).subscribe(res => {

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

  agGridInit() {

    this.columnDefs = [
      //{ field: 'id' ,          headerName:this.translate.instant("TEXT.id"), sortable: true, filter: true,  headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,  checkboxSelection: true, width:40 },
      { field: 'ulke_kodu', headerName: this.translate.instant("TEXT.ulke_kodu"), sortable: true, headerCheckboxSelection: true, checkboxSelection: true, cellStyle: { color: '#ccce75' } },
      { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi"), sortable: true ,cellRenderer:'agGridLang'},
    //  { field: 'adi_en', headerName: this.translate.instant("TEXT.adi_en"), minWidth: 175 },
      { field: 'kodu', headerName: this.translate.instant("TEXT.kodu"), minWidth: 175 },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', },
    ];

  }

}
