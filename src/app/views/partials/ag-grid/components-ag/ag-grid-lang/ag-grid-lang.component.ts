import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgRendererComponent } from 'ag-grid-angular';
import { Location } from "@angular/common";
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { GridActionEnum } from '../../../../../core/Enums/grid-action.enum';
import { TranslateService } from '../../../../../core/services/translate.service';

@Component({
  selector: 'kt-ag-grid-lang',
  templateUrl: './ag-grid-lang.component.html'
 
})
export class AgGridLangComponent implements AgRendererComponent {
  cellValue: string;
  private data:any;
  private langEnKey:string ='adi_en'; // defautl adi_en hücresini değiştiriyor.

  gridActionEnum=GridActionEnum
  public langEn:any;

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

    //this.langEn =this.data.adi_en;

    if(params.colDef&& params.colDef.cellEditorParams)
    {
     this.langEnKey  = params.colDef.cellEditorParams.values;
    }

    this.langEn = this.data[this.langEnKey];
    
    this.cellValue = this.getValueToDisplay(params);
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }


  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
  
  ngOnInit(): void {
    
  }

}
