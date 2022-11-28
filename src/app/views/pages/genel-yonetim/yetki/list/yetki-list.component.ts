import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { YetkiTanimService } from '../../../../services/yetki-tanim.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { YetkiAddComponent } from '../add/yetki-add.component';
import { TranslateService } from '../../../../../core/services/translate.service';
import { GridActionEnum } from '../../../../../core/Enums/grid-action.enum';

@Component({
  selector: 'kt-yetki-list',
  templateUrl: './yetki-list.component.html',
  styleUrls: ['./yetki-list.component.scss']
})
export class YetkiListComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any
  constructor(
    private yetkiTanimService: YetkiTanimService,
    private localStorageService: LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.agGridInit();
    this.getlist();
  }

  getlist() {
    this.yetkiTanimService.getList().subscribe(res => {
      this.rowData = res.data;
    })
  }

  removeCacheLocalstorage() {
    this.localStorageService.removeItem("getAuthCanView");
  }

  addModal() {
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    //const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const dialogRef = this.dialog.open(YetkiAddComponent, { data: { id: null } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });

  }

  editModal(data) {

    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    //aggrid gelen data dialog gönderiyorum.
    const dialogRef = this.dialog.open(YetkiAddComponent, { data });
    //const dialogRef = this.dialog.open(AddComponent);
    //dioglam modal işlemler sonucunda gelen datayı alıyorum apiye gönderiyorum
    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (refData) {
        this.saveYetki(refData.data);
      }
      else {
        //burada modal kapanıyor
        return;
      }
    });

  }

  saveYetki(data) {

    const _messageType = data.id ? MessageType.Update : MessageType.Create;
    this.yetkiTanimService.save(data).subscribe(res => {
      if (res.result) {
        this.dialog.closeAll();
        const _saveMessage = data.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');
        this.getlist();
        this.agGrid.api.refreshCells();
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
      }
    })

  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  agGridInit() {

    this.columnDefs = [
      {
        field: 'yetki_kodu', headerName: this.translate.instant("TEXT.yetki_kodu"), sortable: true, filter: true, headerCheckboxSelection: true,
        checkboxSelection: true, width: 40
      },
      { field: 'yetki_adi', headerName: this.translate.instant("TEXT.yetki_adi"), sortable: true, cellStyle: { color: 'green' } },
      { field: 'grup_adi', headerName: this.translate.instant("TEXT.grup_adi"), sortable: true, cellStyle: { color: '#ccce75' } },
      { field: 'unit_manager', headerName: this.translate.instant("TEXT.unit_manager"), sortable: true, filter: 'agNumberColumnFilter', cellRenderer: 'changeStatus', },
      { field: 'unit_manager_assistant', headerName: this.translate.instant("TEXT.unit_manager_assistant"), minWidth: 175, cellRenderer: 'changeStatus', },
      { field: 'agent_user', headerName: this.translate.instant("TEXT.agent_user"), minWidth: 175, cellRenderer: 'changeStatus', },
      { field: 'unit_user', headerName: this.translate.instant("TEXT.unit_user"), minWidth: 175, cellRenderer: 'changeStatus', },
      {
        field: 'id', headerName: this.translate.instant("TEXT.UPDATE"), minWidth: 175, cellRenderer: 'agGridActionComponent', cellEditorParams: {
          values: [{ action: GridActionEnum.create.toString(), text: this.translate.instant('TEXT.UPDATE'), icon: 'created' },],
        }
      },
    ];

  }

}
