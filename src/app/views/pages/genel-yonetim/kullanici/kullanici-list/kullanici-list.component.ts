import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { KullaniciTanimService } from '../../../../services/kullanici-tanim.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { KullaniciAddComponent } from '../kullanici-add/kullanici-add.component';
import { TranslateService } from '../../../../../core/services/translate.service';
import { GridActionEnum } from '../../../../../core/Enums/grid-action.enum';
import { StatusDisplayEnum } from '../../../../partials/ag-grid/StatusDisplay.enum';
import { keys, values } from 'lodash';
import { data } from 'jquery';

@Component({
  selector: 'kt-kullanici-list',
  templateUrl: './kullanici-list.component.html',
  styleUrls: ['./kullanici-list.component.scss']
})
export class KullaniciListComponent implements OnInit {

  rolIds =
    [
      { key: 1, value: this.translate.instant('TEXT.unit_manager') },
      { key: 2, value: this.translate.instant('TEXT.unit_manager_assistant') },
      { key: 3, value: this.translate.instant('TEXT.agent_user') },
      { key: 4, value: this.translate.instant('TEXT.unit_user') },
    ];

  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any

  constructor(
    private localStorageService: LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private KullaniciService: KullaniciTanimService,
    private translate: TranslateService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }

  getList() {
    this.KullaniciService.getList().subscribe(res => {
      this.rowData = res.data;
    })
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  // unit_manager 10
  // unit_manager_assistant 20
  // agent_user 30
  // unit_user 40

  editModal(data) {
    const dialogRef = this.dialog.open(KullaniciAddComponent, { data, width: "70%", maxWidth: "600px", minWidth: "330px", maxHeight: "85%" });
    //const dialogRef = this.dialog.open(AddComponent);
    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");
      if (!refData) {
        //burada modal kapanıyor
        return;
      }
      this.saveKullanici(refData.data);
    });
  }

  saveKullanici(data) {
    const _messageType = data.id ? MessageType.Update : MessageType.Create;
    this.KullaniciService.save(data).subscribe(res => {
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
      { field: 'adi_soyadi', headerName: this.translate.instant("TEXT.adi") + ' ' + this.translate.instant("TEXT.soyadi"), minWidth: 175, sortable: true, headerCheckboxSelection: true, checkboxSelection: true },
      { field: 'eposta', headerName: this.translate.instant("TEXT.eposta"), sortable: true, minWidth: 175 },
      { field: 'rol_id', headerName: this.translate.instant("TEXT.rol"), minWidth: 175 },
      {
        field: 'super_user', headerName: this.translate.instant("TEXT.admin"), minWidth: 120, cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.trueFalse }
      },
      { field: 'kurum_adi', headerName: this.translate.instant("TEXT.kurum_adi"), minWidth: 120 },
      {
        field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), minWidth: 120, cellRenderer: 'changeStatus',
        cellEditorParams: { values: StatusDisplayEnum.pasifAktif }
      },
      {
        field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', cellEditorParams: {
          values: [{ action: GridActionEnum.create.toString(), text: this.translate.instant('TEXT.UPDATE'), icon: 'created' },]
        },
      }
    ]
  }



}
