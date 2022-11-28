import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { KurumTanimService } from '../../../../../views/services/kurum-tanim.service';
import { KurumAddComponent } from '../kurum-add/kurum-add.component';

@Component({
  selector: 'kt-kurum-list',
  templateUrl: './kurum-list.component.html',
  styleUrls: ['./kurum-list.component.scss']
})
export class KurumListComponent implements OnInit {

  agGrid:AgGridAngular;
  columnDefs:any
  rowData:any
  constructor(
    private localStorageService:LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private kurumService:KurumTanimService,
		private translate: TranslateService,
		private dialog:MatDialog) { }


  ngOnInit(): void {

  this.agGridInit();
  this.getList();


  }

  getList()
  {

    this.kurumService.getList().subscribe(res=>{
        if(res.result)
        {
          this.rowData = res.data;
        }
       
       
    })
  }

  remove(data){
 

    const dialogRef =  this.dialog.open(DeleteEntityDialogComponent, {
       // data: { title, description, waitDesciption },
        width: '440px'
      });
          
		dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();

      if (!refData) {
        //burada modal kapanıyor
         return;
       }

     this.kurumService.delete(data.id).subscribe(res=>{
      if(res.result)
      {
         this.getList();
      }
     });

    
});
  }

  agGridSet(agGrid)
  {
    this.agGrid = agGrid;
  }

  editModal(data) {


		const dialogRef = this.dialog.open(KurumAddComponent, { data });
		//const dialogRef = this.dialog.open(AddComponent);

		dialogRef.afterClosed().subscribe(refData => {
          this.agGrid.api.deselectAll();
          this.localStorageService.removeItem("agGridEdit");

          if (!refData) {
           //burada modal kapanıyor
            return;
          }

          this.saveKurum(refData.data);

		});
	}

  saveKurum(data)
  {
		const _messageType = data.id ? MessageType.Update : MessageType.Create;
    this.kurumService.save(data).subscribe(res=>{   
 
      if(res.result)
      {
        this.dialog.closeAll();
        let saveMessageTranslateParam =data.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL"); 
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);

          this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000,false , false,null,'top');

          this.getList();

          this.agGrid.api.refreshCells();
      }
      else{
          
      this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000,false , false,null,'top');

      }

  })  

  }

  agGridInit()
  {

    this.columnDefs = [
      //{ field: 'id' ,          headerName:this.translate.instant("TEXT.id"), sortable: true, filter: true,  headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,  checkboxSelection: true, width:40 },
      { field: 'adi' ,      headerName:this.translate.instant("TEXT.adi"),  headerCheckboxSelection: true,   checkboxSelection: true, sortable: true },
      { field: 'adres' ,      headerName:this.translate.instant("TEXT.adres"),  minWidth: 175 },
      { field: 'ilgili_kisi' ,        headerName:this.translate.instant("TEXT.ilgili_kisi"),  minWidth: 175  },
      { field: 'telefon' ,   headerName:this.translate.instant("TEXT.telefon"), sortable: true , cellStyle: {color: '#ccce75'}},
      { field: 'email' ,   headerName:this.translate.instant("TEXT.eposta"), sortable: true , cellStyle: {color: '#ccce75'}},
      { field: 'id' ,          headerName:this.translate.instant("TEXT.SETTINGS"),  minWidth: 175, cellRenderer: 'agGridActionComponent',  },
    ];      

  }



}
