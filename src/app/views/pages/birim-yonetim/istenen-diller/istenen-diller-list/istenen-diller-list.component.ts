import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { AgGridAngular } from 'ag-grid-angular';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';
import { IstenenDillerAddComponent } from '../istenen-diller-add/istenen-diller-add.component';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';

@Component({
  selector: 'kt-istenen-diller-list',
  templateUrl: './istenen-diller-list.component.html',
  styleUrls: ['./istenen-diller-list.component.scss']
})
export class IstenenDillerListComponent implements OnInit {

  agGrid:AgGridAngular;
  columnDefs:any
  rowData:any
  constructor(
    private localStorageService:LocalStorageService,
    private layoutUtilsService: LayoutUtilsService,
    private BirimYonetimService:BirimYonetimService,
		private translate: TranslateService,
		private dialog:MatDialog) { }

  ngOnInit(): void {

  this.agGridInit();
  this.getList();

  }

  getList()
  {
    this.BirimYonetimService.getListLanguage().subscribe(res=>{
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

  editData(data) {

		let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT';
		const dialogRef = this.dialog.open(IstenenDillerAddComponent, { data });
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


  remove(data){

    //var title ="Silme!!";
    var description =this.translate.instant('TEXT.DELETE_WANT');
    var waitDesciption =this.translate.instant('TEXT.DELETE_SUCCESSFUL');

      const dialogRef =  this.dialog.open(DeleteEntityDialogComponent, {
        //  data: { title, description, waitDesciption },
          width: '440px',
        });  
    
      dialogRef.afterClosed().subscribe(refData => {
            this.agGrid.api.deselectAll();
            if (!refData) {
              //burada modal kapanıyor
              return;
            }

            this.BirimYonetimService.removeLanguage(data.id).subscribe(res=>{

              //console.log('silme  datası ', res)
              if(res.result)
              {
                 this.getList();
              }
             });
            // var _deleteMessage= this.translate.instant('TEXT.DELETE_SUCCESSFUL');
            // this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);

      
      });
}
  

  saveUlke(data)
  {
		const _messageType = data.id ? MessageType.Update : MessageType.Create;

    this.BirimYonetimService.saveLanguage(data).subscribe(res=>{        
      if(res.result)
      {
       this.getList();
        this.dialog.closeAll();
        let saveMessageTranslateParam =data.id?this.translate.instant("TEXT.UPDATE_SUCCESSFUL"): this.translate.instant("TEXT.SAVE_SUCCESSFUL");
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
       this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000,false , false,null,'top');


      }
      else{
          
      this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000,false , false,null,'top');

      }

})

  }
  agGridInit()
  {

    this.columnDefs = [
          { field: 'id' ,   headerName:this.translate.instant("TEXT.id"), sortable: true, hide:true},
          { field: 'dil_kodu' ,   headerName:this.translate.instant("TEXT.dil_kodu"), sortable: true,   cellStyle: {color: 'green'},filter: true,  headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,  checkboxSelection: true,},
          { field: 'durumu' ,   headerName:this.translate.instant("TEXT.durumu"), sortable: true ,  cellRenderer: 'changeStatus'},
          { field: 'ekleyen_id' ,   headerName:this.translate.instant("TEXT.ekleyen_id")  ,hide:'true'},
          { field: 'ekleme_tarihi' ,   headerName:this.translate.instant("TEXT.ekleme_tarihi"), hide:'true'},
          { field: 'duzenleyen_id' ,   headerName:this.translate.instant("TEXT.duzenleyen_id") , hide:'true' },
          { field: 'duzenleme_tarihi' ,   headerName:this.translate.instant("TEXT.duzenleme_tarihi" ), hide:'true'},
          { field: 'id' ,   headerName:this.translate.instant("TEXT.SETTINGS"),  minWidth: 175, cellRenderer: 'agGridActionComponent',  },
    
        ];       

  }
}
