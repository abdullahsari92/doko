import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { LayoutConfigService } from '../../../../core/_base/layout';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { AgGridActionComponent } from '../components-ag/ag-grid-action/ag-grid-action.component';
import { AgGridLangComponent } from '../components-ag/ag-grid-lang/ag-grid-lang.component';
import { ChangeStatusComponent } from '../components-ag/change-status/change-status.component';
import { Router } from '@angular/router';
import { FileViewerComponent } from '../components-ag/file-viewer/file-viewer.component';
import { ImgViewer } from '../components-ag/img-viewer/img-viewer.component';

@Component({
  selector: 'kt-custom-ag-grid',
  templateUrl: './custom-ag-grid.component.html',
  styleUrls: ['./custom-ag-grid.component.scss']
})
export class CustomAgGridComponent implements OnInit {


  selectedData: any;
  filter: string
  @ViewChild('agGrid') agGrid: AgGridAngular;
  frameworkComponents;
  // rowData:any
  @Input() rowData: any;
  @Input() columnDefs: any;
  @Input() height: string = "600px"
  @Input() pagination: boolean = true;
  @Input() isSearch: boolean = true;

  //bu değer true girildiğinde direk onSelectionChanged çalıyor ve outPut olarak editData'ya veri gönderiliyor.
  @Input() isSelectActive: boolean = false;



  @Input() title: string = ""

  @Output() editData: EventEmitter<any> = new EventEmitter();
  @Output() removeData: EventEmitter<any> = new EventEmitter();
  @Output() reminderData: EventEmitter<any> = new EventEmitter();

  @Output() agGridCustom: EventEmitter<AgGridAngular> = new EventEmitter();
  @Output() changeOrder: EventEmitter<AgGridAngular> = new EventEmitter();



  paginationPageSize;

  defaultColDef = {
    editable: true,
    sortable: true,
    flex: 1,
    filter: true,
    Width: 100,
    resizable: true,

  };
  autoGroupColumnDef = {
    headerName: 'Model',
    field: 'model',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true
    }
  };
  rowSelection = 'multiple';


  //rowData: any;
  constructor(private localStorageService: LocalStorageService,
		private layoutConfigService: LayoutConfigService,
    public router:Router
    ) {

    this.selectedData = [];
    this.paginationPageSize = 10;

    this.frameworkComponents = {
      agGridActionComponent: AgGridActionComponent,
      changeStatus: ChangeStatusComponent,
      agGridLang :AgGridLangComponent,
      fileViewer:FileViewerComponent,
      imgViewer:ImgViewer,

    };

  }

  ngOnInit() {
  }


  getSelectedRows() {
    const selectedData = this.agGrid.api.getSelectedNodes().map(node => {
      if (node.groupData) {
        return { make: node.key, model: 'Group' };
      }
      return node.data;
    });

  }

  onFilterTextBoxChanged() {
    this.agGrid.api.setQuickFilter(this.filter);
  }

  onColumnMoved() {


    var columnState = JSON.stringify(this.agGrid.columnApi.getColumnState());

    console.log(' 106-window.location.href',window.location.href)
    console.log(' 107-location.href',location.href)

    localStorage.setItem('myColumnState' +  window.location.href, columnState);
  }
  onSelectionChanged($event) {
    var selectedRows = this.agGrid.api.getSelectedRows();
    if (this.localStorageService.getItem("agGridEdit")) {
      this.editData.emit(selectedRows[0]);
      this.localStorageService.removeItem("agGridEdit");

    }
    if (this.localStorageService.getItem("agGridRemove")) {
      this.removeData.emit(selectedRows[0]);
      this.localStorageService.removeItem("agGridRemove");

    }

    if (this.localStorageService.getItem("agGridReminder")) {
      this.reminderData.emit(selectedRows[0]);
      this.localStorageService.removeItem("agGridReminder");

    }

    if (this.isSelectActive) {
      this.editData.emit(selectedRows);
    }

    //this.selectedData =this.getSelectedRows()
  }

  onGridReady(params) {

 
    this.agGridCustom.emit(this.agGrid);

    let path ="agGridState."+window.location.href.split('#')[1];
    var donenDizi =  this.localStorageService.getObjectItems(path);
    var   columnState=  donenDizi?JSON.parse(donenDizi):null;
    if (columnState) {
      params.columnApi.setColumnState(columnState);
    }
  }

  onSortChanged(event) {
    //var sortModel = this.agGrid.api.getSortModel();
    var sortModel = event.columnApi.getColumnState();
    var sortActive = sortModel && sortModel.length > 0;
    var suppressRowDrag = sortActive;
    console.log(
      'sortActive = ' +
      sortActive +
      ', allowRowDrag = ' +
      suppressRowDrag
    );
    this.agGrid.api.setSuppressRowDrag(suppressRowDrag);
  }

  onRowDragEnd(event: any) {

    this.changeOrder.emit(event);
  }

  deleteItem() {

    var deger = this.selectedData.map(node => node.make).join(',');
    alert(deger)

  }
  updateStatusForItem() {

  }
  secme() {

    this.selectedData = this.agGrid.api.getSelectedNodes().map(node => {
      if (node.groupData) {
        return { make: node.key, model: 'Group' };
      }
      return node.data;
    });

    var deger = this.selectedData.map(node => node.make).join(',');

  }



  getContextMenuItems(params) {
  
    var result = [
      'resetColumns',
      {
        name: 'Save Status ',
        action: function () {
            var columnState = JSON.stringify(params.columnApi.getColumnState());        
            let path ="agGridState";
            let arrayName = window.location.href.split('#')[1];
            var yeniDizi:any;
            var anaDizi:any[] = JSON.parse(localStorage.getItem(path))?.objectName;  
            var eklenecekDizi = {[arrayName]:columnState};
            if(anaDizi)
            {
              yeniDizi= {...anaDizi,...eklenecekDizi}
            }
            else{
              yeniDizi= {...eklenecekDizi}
            }    
          localStorage.setItem(path, JSON.stringify({ objectName: yeniDizi }));
        },
        cssClasses: ['redFont', 'bold'],
      },
      'separator',
      'copy',
      'copyWithHeaders',
      'paste',
      'separator',
      'export'
    ];
    return result;
  }


 
  ngOnChanges() {



  }

  // agGridInitDemo()
  // {

  //   this.columnDefs = [
  //     { field: '' ,   headerName:this.translate.instant("TEXT."), sortable: true, filter: true,  headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,  checkboxSelection: true, width:40 , rowDrag: true},
  //     { field: '' ,   headerName:this.translate.instant("TEXT."), sortable: true,   cellStyle: {color: 'green'}},
  //     { field: '' ,   headerName:this.translate.instant("TEXT."), sortable: true , cellStyle: {color: '#ccce75'},cellRenderer:'agGridLang',cellEditorParams: {values:  'adres_en' , }},
  //     { field: '' ,   headerName:this.translate.instant("TEXT."), sortable: true, filter: 'agNumberColumnFilter',cellRenderer: 'changeStatus', },
  //     { field: '' ,   headerName:this.translate.instant("TEXT."),  minWidth: 150 ,cellRenderer:'agGridLang',}, default degeri: adi_en
  //     { field: '' ,   headerName:this.translate.instant("TEXT."),  minWidth: 150 },
  //     { field: '' ,   headerName:this.translate.instant("TEXT."),  minWidth: 150 },
  //     { field: '' ,   headerName:this.translate.instant("TEXT."),  minWidth: 150 },
  //     { field: 'id' ,   headerName:this.translate.instant("TEXT.SETTINGS"),  minWidth: 175, cellRenderer: 'agGridActionComponent',  },
  //     {
  //       field: 'id', headerName: this.translate.instant("TEXT.UPDATE"), minWidth: 175, cellRenderer: 'agGridActionComponent', cellEditorParams: {
  //         values: [{ action: GridActionEnum.create.toString(), text: this.translate.instant('TEXT.UPDATE'), icon: 'created' },],
  //       }
  //     },
  //  ];        

  // }

}


