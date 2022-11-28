import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { SettingsTanimService } from '../../../../services/settings-tanim.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { SettingsAddComponent } from '../settings-add/settings-add.component';
import { TranslateService } from '../../../../../core/services/translate.service';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';

@Component({
  selector: 'kt-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss']
})
export class SettingsListComponent implements OnInit {
  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any

  constructor(private localStorageService: LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private SettingsTanimService: SettingsTanimService,
    private translate: TranslateService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }

  getList() {
    this.SettingsTanimService.getList().subscribe(res => {

      console.log('settingList ',res)
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
        //burada modal kapanıyor
        return;
      }
      this.SettingsTanimService.delete(data.id).subscribe();
      var _deleteMessage = this.translate.instant('TEXT.DELETE_SUCCESSFUL');
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      this.getList();

    });
  }

  editModal(data) {

    const dialogRef = this.dialog.open(SettingsAddComponent, { data, width: "70%", maxWidth: "600px", minWidth: "330px", maxHeight: "85%" });
    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (!refData) {
        //burada modal kapanıyor
        return;
      }
      this.saveSettings(refData.data);
    });
  }

  saveSettings(data) {

    const _messageType = data.id ? MessageType.Update : MessageType.Create;

    this.SettingsTanimService.save(data).subscribe(res => {

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
      { field: 'settingKey', headerName: this.translate.instant("TEXT.settingKey"), sortable: true, headerCheckboxSelection: true, checkboxSelection: true, cellStyle: { color: '#ccce75' } },
      { field: 'settingValue', headerName: this.translate.instant("TEXT.settingValue"), sortable: true },
      { field: 'description', headerName: this.translate.instant("TEXT.aciklama_tr"), minWidth: 175 },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', },
    ];

  }

}
