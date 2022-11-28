import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../../core/services/translate.service';
import { BirimYonetimService } from '../../../../services/birim_yonetim.service';
import { BasvuruService } from '../../../../services/basvuru.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

@Component({
  selector: 'kt-basvuru-bolumler-add',
  templateUrl: './basvuru-bolumler-add.component.html',
  styleUrls: ['./basvuru-bolumler-add.component.scss']
})

export class BasvuruBolumlerAddComponent implements OnInit {
  agGrid: any;
  rowData: any;
  columnDefs: any;
  columnDefsBolumler: any;
  columnDefsTercihler: any;
  basvuruId: any;
  constructor(
    private translate: TranslateService,
    private BasvuruService: BasvuruService,
    private BirimYonetimService: BirimYonetimService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,

  ) {

    this.basvuruId = parseInt(this.router.getCurrentNavigation().extras.state.toString());

  }

  ngOnInit(): void {

    this.agGridInit();
    this.tercihAcikFakulteler();
    this.tercihAcikBolumler();
  }

  agGridSet(agGrid) {
    this.agGrid = agGrid;
  }

  rowDataBolumler: any[] = [];
  editData(data) {

    this.rowDataBolumler = [];

    var fakulteKodu: any[] = data.map(m => m.kodu);

    fakulteKodu.forEach(f => {
      console.log(this.tercihBolumler);
      this.tercihBolumler.filter(p => p.fakulte_kodu == f).forEach(m => {
        this.rowDataBolumler.push(m)
      })
    });

  }

  tercihListesi: any[] = [];
  addBolum(data: any) {
    this.tercihListesi = [];
    this.tercihListesi = data;

  }

  goBackWithoutId() {
    this.router.navigate(['../'+this.basvuruId], { relativeTo: this.activatedRoute });

  }

  agGridInit() {

    this.columnDefs = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, width: 40, hide: true },
      { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), sortable: true, minWidth: 175, cellStyle: { color: '#5d55b9' }, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, },
      { field: 'adi_en', headerName: this.translate.instant("TEXT.adi_en"), sortable: true, minWidth: 175 },
      { field: 'kodu', headerName: this.translate.instant("TEXT.kodu"), sortable: true },
      // { field: 'fakulte_kodu' ,   headerName:this.translate.instant("TEXT.kodu"),  minWidth: 175 },

    ];

    this.columnDefsBolumler = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, width: 40, hide: true },
      { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), sortable: true, minWidth: 175, cellStyle: { color: '#5d55b9' }, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, },
      { field: 'adi_en', headerName: this.translate.instant("TEXT.adi_en"), sortable: true, minWidth: 175 },
      { field: 'kodu', headerName: this.translate.instant("TEXT.kodu"), minWidth: 175 },
      { field: 'fakulte_kodu', headerName: this.translate.instant("TEXT.fakulte_kodu"), minWidth: 175 },

    ];

    this.columnDefsTercihler = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, width: 40, hide: true },
      { field: 'adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), sortable: true, minWidth: 175, cellStyle: { color: '#5d55b9' }, filter: true, headerCheckboxSelectionFilteredOnly: true, },
      { field: 'adi_en', headerName: this.translate.instant("TEXT.adi_en"), sortable: true, minWidth: 175 },
      { field: 'fakulte_adi_tr', headerName: this.translate.instant("TEXT.fakulte_adi") + ' tr', sortable: true },
      { field: 'fakulte_adi_en', headerName: this.translate.instant("TEXT.fakulte_adi") + ' en', sortable: true },
      { field: 'kodu', headerName: this.translate.instant("TEXT.kodu"), width: 40, hide: true },
      { field: 'fakulte_kodu', headerName: this.translate.instant("TEXT.kodu"), width: 40, hide: true },

    ];
  }

  tercihBolumler: any[] = [];
  tercihAcikBolumler() {
    this.BasvuruService.getFakulteBolumList(this.basvuruId).subscribe(res => {
      if (res.result) {
        this.tercihBolumler = res.data;
        //this.rowDataBolumler = this.tercihBolumler;
      }
    })
  }

  tercihFakulteleri: any[] = [];
  tercihAcikFakulteler() {
    this.BasvuruService.getBirimFakulteList().subscribe(res => {
      if (res.result) {

        this.tercihFakulteleri = res.data;
        this.rowData = this.tercihFakulteleri;

        this.tercihAcikBolumler();
      }
    })
  }

  addList: any[] = []
  addData() {

    this.tercihListesi.forEach(f => {
      var liste = { fakulte_kodu: f.fakulte_kodu, bolum_kodu: f.kodu }
      this.addList.push(liste)
    })

    const _messageType = MessageType.Create;

    var dataJS = JSON.stringify(this.addList);

    this.BasvuruService.getBasvuruBolumleriSave(dataJS, this.basvuruId).subscribe(res => {

      //console.log('resunit save : ',res)
      if (res.result) {
        let saveMessageTranslateParam = this.translate.instant("TEXT.SAVE_SUCCESSFUL");
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);

        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');

        this.goBackWithoutId();
      }
      else {

        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
      }

    });

    //var anns =  JSON.stringify(this.addList);
    //console.log('adddatata',anns);

  }


}
