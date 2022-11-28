import { Component, OnInit,Inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { TranslateService } from '../../../../../core/services/translate.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasvuruOgrencilerComponent } from '../basvuru-ogrenciler.component';
import { BasvuruService } from '../../../../services/basvuru.service';

@Component({
  selector: 'kt-basvuru-ogrenciler-import',
  templateUrl: './basvuru-ogrenciler-import.component.html',
  styleUrls: ['./basvuru-ogrenciler-import.component.scss']
})
export class BasvuruOgrencilerImportComponent implements OnInit {
  
  agGrid:AgGridAngular;
  columnDefs:any
  sayi:number;
  rowData:any;
  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<BasvuruOgrencilerComponent>,
    private basvuruService: BasvuruService,

    @Inject(MAT_DIALOG_DATA) public data: number,

  ) { }

  ngOnInit(): void {
    this.agGridInit();

  }

  yenidata: any[] = [];
  buttonclick(event: ClipboardEvent): void {
    navigator['clipboard'].readText().then((data) => {
      const res =  self.Array(data); //array yap
      var strArr = data.split("\n");
        for (var i = 0; i < strArr.length; i++) {
            var stnAsr = strArr[i].split("\t");
            var liste  = {
              aday_no:stnAsr[0],
              kitapcik:stnAsr[1],
              dogru_sayisi:stnAsr[2],
              yanlis_sayisi:stnAsr[3],
              bos_sayisi:stnAsr[4],
              puani:stnAsr[5],
              yuzdesi:stnAsr[6],
              sirasi:stnAsr[7],
              durumu:stnAsr[8],
              durum_aciklama:stnAsr[9],
            
            };
            this.yenidata.push(liste);
          }
          this.rowData = this.yenidata;
          console.log('json', JSON.stringify(this.rowData));
          // getSinavSonucUpdate
    });
  }

  agGridSet(agGrid)
  {
    this.agGrid = agGrid;
  }

  agGridInit(){ 

    this.columnDefs = 
     [ 
      { field: "aday_no", minWidth: 180,  headerName:this.translate.instant("TEXT.aday_no") },
      { field: "kitapcik", minWidth: 180,  headerName:this.translate.instant("TEXT.kitapcik") },
      { field: "dogru_sayisi", minWidth: 180,  headerName:this.translate.instant("TEXT.dogru_sayisi") },
      { field: "yanlis_sayisi", minWidth: 180,  headerName:this.translate.instant("TEXT.yanlis_sayisi") },
      { field: "bos_sayisi", minWidth: 180,  headerName:this.translate.instant("TEXT.bos_sayisi") },
      { field: "puani", minWidth: 180,  headerName:this.translate.instant("TEXT.puani") },
      { field: "yuzdesi", minWidth: 180,  headerName:this.translate.instant("TEXT.yuzdesi") },
      { field: "sirasi", minWidth: 180,  headerName:this.translate.instant("TEXT.sirasi") },
      { field: "durumu", minWidth: 180,  headerName:this.translate.instant("TEXT.sinav_durumu") },
      { field: "durum_aciklama", minWidth: 180,  headerName:this.translate.instant("TEXT.durum_aciklama") },

 
     ];
     
 }


}
