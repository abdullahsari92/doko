import { Component, OnInit, Inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../../core/services/translate.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SinavOgrencilerComponent } from '../../sinav-ogrenciler.component';
import { BasvuruService } from '../../../../../services/basvuru.service';
import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'kt-sinav-ogrenciler-import',
  templateUrl: './sinav-ogrenciler-import.component.html',
  styleUrls: ['./sinav-ogrenciler-import.component.scss']
})
export class SinavOgrencilerImportComponent implements OnInit {

  agGrid: AgGridAngular;
  columnDefs: any
  sayi: number;
  rowData: any;
  //dataToArray:ClipboardService;
  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<SinavOgrencilerComponent>,
    private basvuruService: BasvuruService,
    private router: Router,
    private dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {

    this.agGridInit();

  }

  yenidata: any[] = [];
  buttonclick(event: ClipboardEvent): void {
    navigator['clipboard'].readText().then((data) => {
      const res = self.Array(data); //array yap
      var strArr = data.split("\n");
      for (var i = 0; i < strArr.length; i++) {
        var stnAsr = strArr[i].split("\t");
        var liste = {
          aday_no: stnAsr[0],
          kitapcik: stnAsr[1],
          dogru_sayisi: stnAsr[2],
          yanlis_sayisi: stnAsr[3],
          bos_sayisi: stnAsr[4],
          puani: stnAsr[5],
          yuzdesi: stnAsr[6],
          sirasi: stnAsr[7],
          durumu: stnAsr[8],
          durum_aciklama: stnAsr[9],

        };
        this.yenidata.push(liste);
      }
      this.rowData = this.yenidata;
      console.log('json', JSON.stringify(this.rowData));
      // getSinavSonucUpdate
    });
  }

  onSubmit() {

    var id = this.data.basvuru_id;
    var datas = { data: JSON.stringify(this.rowData), id: id };

    const _messageType = datas.id ? MessageType.Update : MessageType.Create;
    this.basvuruService.getSinavOgrencilerResultSave(datas).subscribe(res => {
      this.dialog.closeAll();
      if (res.result) {
        if (res.data[0].error_code == 1 || res.data[0].error_code == 2) {
          let saveMessageTranslateParam = datas.id ? this.translate.instant("TEXT.basvuran_ogrenci_update_basarisiz") : this.translate.instant("TEXT.basvuran_ogrenci_update_basarisiz");
          const _saveMessage = this.translate.instant(saveMessageTranslateParam);
          this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');
        } else {
          let saveMessageTranslateParam = datas.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
          const _saveMessage = this.translate.instant(saveMessageTranslateParam);
          this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');
        }
        this.agGrid.api.refreshCells();
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
      }
    })

  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  agGridInit() {

    this.columnDefs =
      [
        { field: "aday_no", minWidth: 180, headerName: this.translate.instant("TEXT.aday_no") },
        { field: "kitapcik", minWidth: 180, headerName: this.translate.instant("TEXT.kitapcik") },
        { field: "dogru_sayisi", minWidth: 180, headerName: this.translate.instant("TEXT.dogru_sayisi") },
        { field: "yanlis_sayisi", minWidth: 180, headerName: this.translate.instant("TEXT.yanlis_sayisi") },
        { field: "bos_sayisi", minWidth: 180, headerName: this.translate.instant("TEXT.bos_sayisi") },
        { field: "puani", minWidth: 180, headerName: this.translate.instant("TEXT.puani") },
        { field: "yuzdesi", minWidth: 180, headerName: this.translate.instant("TEXT.yuzdesi") },
        { field: "sirasi", minWidth: 180, headerName: this.translate.instant("TEXT.sirasi") },
        { field: "durumu", minWidth: 180, headerName: this.translate.instant("TEXT.sinav_durumu") },
        { field: "durum_aciklama", minWidth: 180, headerName: this.translate.instant("TEXT.durum_aciklama") },
      ];

  }

}