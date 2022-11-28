import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { UlkeTanimService } from '../../../../../views/services/ulke-tanim.service';
import { UlkeAddComponent } from '../ulke-add/ulke-add.component';
import { TranslateService } from '../../../../../core/services/translate.service';

@Component({
  selector: 'kt-ulke-list',
  templateUrl: './ulke-list.component.html',
  styleUrls: ['./ulke-list.component.scss']
})
export class UlkeListComponent implements AfterViewInit, OnInit {

  agGrid:AgGridAngular;
  columnDefs:any
  rowData:any
  constructor(
    private localStorageService:LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private ulkeTanimService:UlkeTanimService,
		private translate: TranslateService,


    
		private dialog:MatDialog) {
     }

  ngAfterViewInit(): void {

  
  }

    

  @ViewChild('elemetnIframe') input!: ElementRef; 
    
  ngOnInit(): void {

  this.agGridInit();
  this.getList();

 // this.getUrl()

  }


  getList()
  {

    this.ulkeTanimService.getList().subscribe(res=>{
        if(res.result)
        {
          this.rowData = res.data;
        }
    })
  }


  
  agGridSet(agGrid)
  {
    this.agGrid = agGrid;
  }

  editModal(data) {

		let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
		const dialogRef = this.dialog.open(UlkeAddComponent, { data });
		//const dialogRef = this.dialog.open(AddComponent);

		dialogRef.afterClosed().subscribe(refData => {
          this.agGrid.api.deselectAll();
          this.localStorageService.removeItem("agGridEdit");

          if (!refData) {
           //burada modal kapanıyor
            return;
          }

          this.saveUlke(refData.data);

		});

    
	}


  saveUlke(data)
  {
		const _messageType = data.id ? MessageType.Update : MessageType.Create;

    this.ulkeTanimService.save(data).subscribe(res=>{        
      if(res.result)
      {
        this.dialog.closeAll();
        let saveMessageTranslateParam = data.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");  
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000,false , false,null,'top');

      this.getList();

      }
      else{
          
      this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000,false , false,null,'top');

      }

})

  }


  remove(data){

    const dialogRef =  this.dialog.open(DeleteEntityDialogComponent, {
      //  data: { title, description, waitDesciption },
        width: '440px'
      });
        
    dialogRef.afterClosed().subscribe(refData => {
      this.agGrid.api.deselectAll();
  
      if (!refData) {
        //burada modal kapanıyor
         return;
       }
  
     this.ulkeTanimService.delete(data.id).subscribe();
  
     var _deleteMessage= this.translate.instant('TEXT.DELETE_SUCCESSFUL');
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      this.getList();
  
    
  });
  }
  agGridInit()
  {

    this.columnDefs = [
         // { field: 'id' ,              headerName:this.translate.instant("TEXT.id"), sortable: true, filter: true,  headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,  checkboxSelection: true, width:40 },
          { field: 'adi_tr' ,          headerName:this.translate.instant("TEXT.adi_tr"), sortable: true, headerCheckboxSelection: true,   checkboxSelection: true,   cellStyle: {color: 'green'},cellRenderer:'agGridLang'},
         // { field: 'adi_en' ,          headerName:this.translate.instant("TEXT.adi_en"), sortable: true , cellStyle: {color: '#ccce75'}},
          { field: 'kodu' ,            headerName:this.translate.instant("TEXT.kodu"), sortable: true, filter: 'agNumberColumnFilter'},
          { field: 'id' ,              headerName:this.translate.instant("TEXT.SETTINGS"),  minWidth: 175, cellRenderer: 'agGridActionComponent',  },    
        ];       

  }

}
function devam(devam: any) {
  throw new Error('Function not implemented.');
}

