import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { DilTanimService } from '../../../../services/dil-tanim.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { DilAddComponent } from '../dil-add/dil-add.component';
import { TranslateService } from '../../../../../core/services/translate.service';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-dil-list',
  templateUrl: './dil-list.component.html',
  styleUrls: ['./dil-list.component.scss']
})
export class DilListComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any
  rowData: any

  constructor(
    private localStorageService: LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private dilService: DilTanimService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.agGridInit();
    this.getList();
  }

  getList() {
    this.dilService.getList().subscribe(res => {
      this.rowData = res.data;
    })
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  editModal(data) {

    const dialogRef = this.dialog.open(DilAddComponent, { data, width: "70%", maxWidth: "600px", minWidth: "330px", maxHeight: "85%" });
    //const dialogRef = this.dialog.open(AddComponent);

    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
      this.localStorageService.removeItem("agGridEdit");

      if (!refData) {
        //burada modal kapanıyor
        return;
      }

      this.saveDil(refData.data);

    });
  }

  saveDil(data) {
    const _messageType = data.id ? MessageType.Update : MessageType.Create;

    this.dilService.save(data).subscribe(res => {

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

    },err=>{
    
     
        console.log('dilService,saveDil',err)
        console.log('err.status + " " + err.statusText',err.status + " " + err.statusText)


        Swal.fire({
          title: this.translate.instant('MENU.AUTHORITY'),
          text: err.status + " " + err.statusText,
          icon: 'error'
        });

    })

  }

  setLocalDatabaseLanguageVersion() {

    var version: number;
    //if(databaseLanguageVersion == 1)
    if (this.localStorageService.getItem("databaseLanguageVersion") && this.localStorageService.getItem("language") <= 0) {
      version = 1;
    }
    else {
      version = this.localStorageService.getItem("databaseLanguageVersion");
    }
    version++;
    this.localStorageService.setItem("databaseLanguageVersion", version);

    if (this.localStorageService.getItem("databaseLanguageVersion")) {
      this.localStorageService.setItem("databaseLanguageVersion", version);
    }
    else {
      this.localStorageService.setItem("databaseLanguageVersion", version);
    }



    var deger = {abc:22,demir:20};
    this.localStorageService.setObjectItems("tokenModel.kullanici",deger)
  }

  remove(data) {

    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, { width: "70%", maxWidth: "600px", maxHeight: "85%" });

    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();

      if (!refData) {
        //burada modal kapanıyor
        return;
      }

      this.dilService.delete(data.id).subscribe();

      var _deleteMessage = this.translate.instant('TEXT.DELETE_SUCCESSFUL');
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      this.getList();

    });

  }

  agGridInit() {

    this.columnDefs = [
      //{ field: 'id' ,          headerName:this.translate.instant("TEXT.id"), sortable: true, filter: true,  headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,  checkboxSelection: true, width:40 },
      { field: 'keyword', headerName: this.translate.instant("TEXT.kodu"), sortable: true, minWidth: 350, headerCheckboxSelection: true, checkboxSelection: true, cellStyle: { color: '#1976d2' } },
      { field: 'tr', headerName: this.translate.instant("LANGUAGE.tr"), sortable: true, minWidth: 175 },
      { field: 'en', headerName: this.translate.instant("LANGUAGE.en"), minWidth: 175 },
      { field: 'fr', headerName: this.translate.instant("LANGUAGE.fr") },
      { field: 'ge', headerName: this.translate.instant("LANGUAGE.ge") },
      { field: 'sp', headerName: this.translate.instant("LANGUAGE.sp") },
      { field: 'ch', headerName: this.translate.instant("LANGUAGE.ch") },
      { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 125, cellRenderer: 'agGridActionComponent', },
    ];

  }

}
