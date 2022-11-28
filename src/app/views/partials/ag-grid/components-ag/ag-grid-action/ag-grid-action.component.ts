import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgRendererComponent } from 'ag-grid-angular';
import { Location } from "@angular/common";
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { GridActionEnum } from '../../../../../core/Enums/grid-action.enum';
import { TranslateService } from '../../../../../core/services/translate.service';

@Component({
  selector: 'kt-ag-grid-action',
  templateUrl: './ag-grid-action.component.html',
  styleUrls: ['./ag-grid-action.component.scss']
})
export class AgGridActionComponent implements AgRendererComponent {
  private cellValue: string;
  private data:string;
  private params;

  gridActionEnum=GridActionEnum
  public actionsList:any[]= [{action:GridActionEnum.create.toString(),text:"Update",icon:"create"},
                              {action:GridActionEnum.delete.toString(),text:"Delete",icon:"delete"} ];

  constructor(private router:Router,location: Location,
		private translate: TranslateService,
    
    private localStorageService:LocalStorageService, private activatedRoute:ActivatedRoute) { }

  
  refresh(params: ICellRendererParams): boolean {

    this.cellValue = this.getValueToDisplay(params);
   
    if(this.cellValue)
    return true;
  }
  agInit(params: ICellRendererParams): void {

    this.data = params.data;

    this.params = params;

    if(params.colDef&& params.colDef.cellEditorParams)
    {
      this.actionsList = params.colDef.cellEditorParams.values;
    }
    this.cellValue = this.getValueToDisplay(params);
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  buttonClicked() {
 
    //console.log(location.pathname);
		this.router.navigate([ location.pathname+'/update', this.cellValue], { relativeTo: this.activatedRoute });
   // this.router.navigate(['update', { id: this.cellValue }]);
  }

  removeItem()
  {
    if(!this.localStorageService.getItem("agGridRemove"))
    {
      this.localStorageService.setItem("agGridRemove","agGridRemove");
      this.params.api.forEachNode( (node) => {
        if ( node.data === this.data ) {  
           node.setSelected(true);
          }
        });
  
    }

  }

  editItem() {

    if(!this.localStorageService.getItem("agGridEdit"))
    {
      this.localStorageService.setItem("agGridEdit","agGridEdit");
      this.params.api.forEachNode( (node) => {
        if ( node.data === this.data ) {  
           node.setSelected(true);
          }
        });  
    }    
	}

  reminderItem() {

    if(!this.localStorageService.getItem("agGridReminder"))
    {
      this.localStorageService.setItem("agGridReminder","agGridReminder");
      this.params.api.forEachNode( (node) => {
        if ( node.data === this.data ) {  
           node.setSelected(true);
          }
        });  
    }    
	}

  make(item:any) {


    if(item.action == GridActionEnum.create.toString())
    {

      if(!this.localStorageService.getItem("agGridEdit"))
      {
        this.localStorageService.setItem("agGridEdit",this.data);
        if(this.params)
        this.params.api.forEachNode( (node) => {
          if ( node.data === this.data ) {  
             node.setSelected(true);
            }
          });
    
      }
    }

    if(item.action == GridActionEnum.delete.toString())
    {     
          if(!this.localStorageService.getItem("agGridRemove"))
          {
            this.localStorageService.setItem("agGridRemove",this.data);
            if(this.params)
            this.params.api.forEachNode( (node) => {
              if ( node.data === this.data ) {  
                 node.setSelected(true);
                }
              });
        
          }


    }
    if(item.action == GridActionEnum.reminder.toString())
    {

      if(!this.localStorageService.getItem("agGridReminder"))
      {
        this.localStorageService.setItem("agGridReminder",this.data);
        if(this.params)
        this.params.api.forEachNode( (node) => {
          if ( node.data === this.data ) {  
             node.setSelected(true);
            }
          });
    
      }
    }
  
    if(item.action == GridActionEnum.download.toString())
    {

      if(!this.localStorageService.getItem("agGridSetDownload"))
      {
        this.localStorageService.setItem("agGridSetDownload",this.data);
        if(this.params)
        this.params.api.forEachNode( (node) => {
          if ( node.data === this.data ) {  
             node.setSelected(false);
            }
          });
    
      }
    }
   

     

		//this.router.navigate([ location.pathname+'/add'], { relativeTo: this.activatedRoute });
	}


  getColor(action:string)
  {

    if(action == GridActionEnum.create.toString())
    {
      return 'primary';

    }

    if(action == GridActionEnum.delete.toString())
    {
      return 'warn';
      
    }

  }

	createProduct() {
		this.router.navigateByUrl('/ecommerce/products/add');
	}

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
  
  ngOnInit(): void {
    
  }

}
