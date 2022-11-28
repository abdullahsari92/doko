import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { TranslateService } from '../../../../core/services/translate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BasvuruService } from '../../../services/basvuru.service';
import { GridActionEnum } from '../../../../core/Enums/grid-action.enum';

@Component({
  selector: 'kt-sinav-raporlar',
  templateUrl: './sinav-raporlar.component.html',
  styleUrls: ['./sinav-raporlar.component.scss']
})
export class SinavRaporlarComponent implements OnInit {
  agGrid: AgGridAngular;
  columnDefs: any
  getSinavCiktiRaporlarList: any;
  rowData: any;
  basvuruId: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private basvuruService: BasvuruService,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.basvuruId = params.get("basvuruId");
      this.agGridInit();
      this.getList();
    })

  }

  tumSalonKapiRapor(data) {

    console.log('kapirapor');

    this.basvuruService.getExamReportViewerId().subscribe(res => {
      console.log(res.data);
    })
  }

  tumSalonZarfRapor(data) {
    console.log();
  }

  tumSalonYoklamaRapor(data) {
    console.log();
  }

  down(data) {
    console.log('down');
  }

  salonZarfRaporu(data) {
    console.log('edt');
  }

  tumSalonOptikRapor(data) {
    console.log('edt');
  }

  getList() {

    this.getSinavCiktiRaporlarList = [];
    this.basvuruService.getSinavCiktiRaporlarList(this.basvuruId).subscribe(res => {
      if (res.result) {
        this.rowData = res.data;
      }
    })
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  agGridInit() {
    this.columnDefs = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, width: 40, hide:true },
      { field: 'basvuru_adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), minWidth: 150, hide:true },
      { field: 'basvuru_adi_en', headerName: this.translate.instant("TEXT.adi_en"), minWidth: 150, hide:true },
      { field: 'merkez_adi_tr', headerName: this.translate.instant("TEXT.sinav_merkezi")+this.translate.instant("TEXT.adi_tr"), minWidth: 150 },
      { field: 'merkez_adi_en', headerName: this.translate.instant("TEXT.sinav_merkezi")+this.translate.instant("TEXT.adi_en"), minWidth: 150 },
      { field: 'salon_adi_tr', headerName: this.translate.instant("TEXT.sinav_salonu_adi")+this.translate.instant("LANGUAGE.tr") , minWidth: 150 },
      { field: 'salon_adi_en', headerName: this.translate.instant("TEXT.sinav_salonu_adi")+this.translate.instant("LANGUAGE.en"), minWidth: 150 },
      { field: 'bina_adi', headerName: this.translate.instant("TEXT.bina_adi"), minWidth: 150 },
      { field: 'kontenjan', headerName: this.translate.instant("TEXT.kontenjan"), minWidth: 150 },
      { field: 'atanan', headerName: this.translate.instant("TEXT.turu"), minWidth: 150 },
      { field: 'id' , headerName:this.translate.instant("TEXT.adi_en"),  minWidth: 175, cellRenderer: 'agGridActionComponent',cellEditorParams: {
        values: [{ action: GridActionEnum.create.toString(), text: this.translate.instant('TEXT.UPDATE'), icon: 'created'  }]  }, 
      },
      // { field: 'id' , headerName:this.translate.instant("TEXT.adi_tr"),  minWidth: 175, cellRenderer: 'agGridActionComponent',cellEditorParams: {
      //   values: [{ action: GridActionEnum.reminder.toString(), text: this.translate.instant('TEXT.UPDATE'), icon: 'description' }]  }, 
      // },

       
    ];
  }
  

}
