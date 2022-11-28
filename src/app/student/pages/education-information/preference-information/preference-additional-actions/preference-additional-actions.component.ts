import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';
import { PreferenceInformationComponent } from '../preference-information.component';
import { TranslateService } from '../../../../../core/services/translate.service';
import { fieldValidations } from '../../../../../core/Enums/fieldValidations';
import { StudentService } from '../../../../services/student.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ErrorService } from '../../../../services/error.service';
import { AgGridAngular } from 'ag-grid-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-preference-additional-actions',
  templateUrl: './preference-additional-actions.component.html',
  styleUrls: ['./preference-additional-actions.component.scss']
})
export class PreferenceAdditionalActionsComponent implements OnInit {

  //Input Başlangıç
  //Input Bitiş

  //AgGrid Başlangıç
  agGrid: AgGridAngular;
  agGridFakulte: AgGridAngular;
  agGridBolum: AgGridAngular;
  rowData: any;
  columnDefs: any;
  columnDefsBolumler: any;
  columnDefsTercihler: any;
  //AgGrid Bitiş

  //Diziler Başlangıç
  tercihFakulteleri: any[] = [];
  tercihBolumleri: any[] = [];
  rowDataBolumler: any[] = [];
  tercihListesi: any[] = [];
  rowDatatercihListesi: any[] = [];
  //Diziler Bitiş

  //Tanımlar Başlangıç
  min: number = null;
  max: number = null;
  puani: number = null;
  puan_araligi: string = null;
  islem: boolean = false;
  btnAdi: string = 'SAVE';
  tercihIslemi: number = 0;
  errorState: boolean = false;
  preference_info: boolean = false;
  //Tanımlar Bitiş

  //Enum Durumlar Başlangıç
  validations = fieldValidations;
  //Enum Durumlar Bitiş

  //Formlar Başlangıç
  preferenceForm: FormGroup;
  //Formlar Bitiş

  submitDisabled: boolean = false;

  constructor(
    private studentService: StudentService,
    public dokoSettingsService: DokoSettingsService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private errorService: ErrorService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PreferenceInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    this.islem = false;
    this.initForm();

    if (Object.keys(this.data.tercihPuanBilgisi).length > 0) {
      Object.keys(this.preferenceForm.controls).forEach((key) => {
        this.preferenceForm.get(key).setValue(this.data.tercihPuanBilgisi[key]);
      });
      this.btnAdi = 'UPDATE';
    } else {
      this.islem = true;
    }

  }
  initForm() {
    this.preferenceForm = new FormGroup({
      puan_turu_id: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.kod1)
      ]),
      ham_puani: new FormControl('', [
        Validators.required
      ]),
      puani: new FormControl('', [
        Validators.required
      ]),
      puan_belgesi: new FormControl('', [
        Validators.required
      ])
    });
  }
  tercihModal() {
    if (this.preferenceForm.get('puani').value < this.min || this.preferenceForm.get('puani').value > this.max) {
      let hata_yazi = this.translate.instant("TEXT.puan_aralik_hata");

      hata_yazi = hata_yazi.replace('[puani]', this.puani);
      hata_yazi = hata_yazi.replace('[enaz]', this.min);
      hata_yazi = hata_yazi.replace('[enfazla]', this.max);

      Swal.fire({
        text: this.translate.instant("TEXT.OPERATION_FAILED"),
        html: hata_yazi,
        icon: 'error',
        showConfirmButton: true
      });
    } else {
      this.errorControl("*");
      if (this.errorState == false) {
        this.tercihIslemi = 1;
        this.dialogRef.updateSize('70%', '80vh');

        this.rowData = this.data.fakulteler;
        this.tercihBolumleri = this.data.bolumler;

        if (Object.keys(this.data.tercihBilgisi).length > 0) {
          this.btnAdi = "UPDATE";
        }

        this.agGridInit();
      }
    }
  }
  setPuanTur() {
    this.preferenceForm.get('ham_puani').setValue(null);
    this.preferenceForm.get('puani').setValue(null);
    this.puan_araligi= null;
  }
  puanHesaplama(event) {
    let puan_turu = this.preferenceForm.get('puan_turu_id').value;
    let ham_puan = event.target.value;

    if (this.islem && ham_puan !== undefined && ham_puan !== null && puan_turu !== undefined && puan_turu !== null) {
      let tur = this.data.puanTurBilgisi.filter(p => p.id == puan_turu);
      let formul = tur[Object.keys(tur)[0]]['formul'];
      this.min = tur[Object.keys(tur)[0]]['min'];
      this.max = tur[Object.keys(tur)[0]]['max'];

      formul = formul.replace('[ham_puan]', ham_puan);
      this.puani = eval(formul);
      this.preferenceForm.get('puani').setValue(this.puani);


      let hata_yazi = this.translate.instant("TEXT.puan_aralik");
      hata_yazi = hata_yazi.replace('[enaz]', this.min);
      hata_yazi = hata_yazi.replace('[enfazla]', this.max);
      this.puan_araligi= hata_yazi;
      
      console.log('formlar', this.preferenceForm);
    }
  }
  errorControl(input: string): any {
    console.log('input', input);
    let result = this.errorService.errorControl(input, this.preferenceForm);
    if (input === '*') {
      this.errorState = result;
    } else {
      return result;
    }
  }
  gridSelected(tercihler) {
    //console.log('gridSelected', this.agGridFakulte.api);
    this.preference_info = true;
    this.agGridFakulte.api.forEachNode((node) => {
      //console.log('gridSelected2', node);
      tercihler.forEach((m: any) => {
        if (node.data.fakulte_kodu === m.fakulte_kodu) {
          node.setSelected(true);
        }
      });
    });
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
  gridBolumSelected(tercihler) {
    //console.log('gridBolumSelected', this.agGridBolum.api);
    this.agGridBolum.api.forEachNode((node) => {
      //console.log('gridBolumSelected2', node);
      this.agGridFakulte.api.getSelectedRows().forEach((m: any) => {
        tercihler.forEach((bolum: any) => {
          //console.log('gridBolumSelected2', node.data);
          if ((node.data.fakulte_kodu === bolum.fakulte_kodu) && (node.data.bolum_kodu === bolum.bolum_kodu)) {
            node.setSelected(true);
          }
        });
      });
    });
  }

  agGridInit() {
    this.columnDefs = [
      // { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, width: 40, hide: true },
      { field: 'fakulte_adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), sortable: true, cellStyle: { color: '#ccce75' }, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true, },
      { field: 'fakulte_adi_en', headerName: this.translate.instant("TEXT.adi_en"), sortable: true, filter: 'agNumberColumnFilter' },
      { field: 'fakulte_kodu', headerName: this.translate.instant("TEXT.kodu"), sortable: true, filter: 'agNumberColumnFilter' }

    ];

    this.columnDefsBolumler = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, width: 40, hide: true },
      {
        field: 'bolum_adi_tr', headerName: this.translate.instant("TEXT.adi_tr"), sortable: true, cellStyle: { color: '#ccce75' }, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true,
        isRowSelectable: (params) => {
          ////console.log('params', params);
          return !!params.data/*  && params.data.year === 2012 */;
        },
      },
      { field: 'bolum_adi_en', headerName: this.translate.instant("TEXT.adi_en"), sortable: true, filter: 'agNumberColumnFilter' },
      { field: 'bolum_kodu', headerName: this.translate.instant("TEXT.kodu"), minWidth: 175 },
      { field: 'fakulte_kodu', headerName: this.translate.instant("TEXT.kodu"), minWidth: 175 },

    ];

    this.columnDefsTercihler = [
      { field: 'id', headerName: this.translate.instant("TEXT.id"), width: 40, hide: true },
      { field: 'fakulte_adi_tr', headerName: this.translate.instant("TEXT.fakulte_adi"), rowDrag: true, cellStyle: { color: '#ccce75' }, filter: 'agNumberColumnFilter' },
      { field: 'bolum_adi_tr', headerName: this.translate.instant("TEXT.bolum_adi") },
      {
        headerName: this.translate.instant("TEXT.sirasi"),
        field: 'sirasi',
        sortable: true
      },
      { field: 'bolum_kodu', headerName: this.translate.instant("TEXT.kodu"), minWidth: 175 },

    ];
  }
  agGridSet(agGrid) {
    //console.log('agGrid', agGrid);
    this.agGrid = agGrid;
  }
  agGridFakulteSet(agGrid) {
    this.agGridFakulte = agGrid;

    new Promise((resolve, reject) => {
      this.gridSelected(this.data.tercihBilgisi);
      setTimeout(() => {
        resolve(true);
      }, 500);
    }).then(() => {
      this.gridBolumSelected(this.data.tercihBilgisi);
    }).catch((err: any) => { });
  }
  agGridBolumSet(agGrid) {
    //console.log('agGridBolumSet', agGrid);

    this.agGridBolum = agGrid;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
  editData(data) {
    //console.log('Seçilen fakülte', data);

    this.rowDataBolumler = [];
    var fakulteKodu: any[] = data.map(m => m.fakulte_kodu);
    fakulteKodu.forEach(fakulte => {
      //console.log('167-tercihBolumleri ', this.tercihBolumleri)
      this.tercihBolumleri.filter(p => p.fakulte_kodu == fakulte).forEach(m => {
        this.rowDataBolumler.push(m)
      });
    });
    if (!(this.rowDataBolumler.length)) {
      this.addBolum(this.rowDataBolumler);
    }
    //console.log('Listelenen bölüm', this.rowDataBolumler);
  }

  addBolum(agGridData: any[]) {
    //console.log('addBolum', agGridData);
    var data = [];
    var bolumKodu: any[] = agGridData.map(m => m.bolum_kodu);
    bolumKodu.forEach(bolum => {
      this.tercihBolumleri.filter(p => p.bolum_kodu == bolum).forEach(m => {
        data.push(m)
      });
    });
    //console.log('addBolum', data);
    this.tercihListesi = [];
    new Promise((resolve, reject) => {
      data.forEach(item => {
        var tercih = {
          sirasi: (this.tercihListesi).length + 1,
          fakulte_kodu: item.fakulte_kodu,
          bolum_kodu: item.bolum_kodu,
          bolum_adi_tr: item.bolum_adi_tr,
          fakulte_adi_tr: item.fakulte_adi
        }
        //console.log('tercih--', tercih);
        this.tercihListesi.push(tercih);
        /* if (!this.tercihListesi.find(p => p.bolum_kodu == item.bolum_kodu)) {
          this.tercihListesi.push(tercih);
        } */
      });
      setTimeout(() => {
        resolve(true);
      }, 500);
      //console.log('tercihListesi ', this.tercihListesi)
    }).then(() => {
      this.agGrid.api.refreshCells();
      this.agGrid.api.setRowData(this.tercihListesi);
    }).catch((err: any) => { });
  }

  changeOrder(event: any) {
    //console.log('event', event);

    var yeniSira = event.overIndex + 1;
    //console.log('yeniSira', yeniSira);

    var gelenData = event.node.data;
    //console.log('gelenData', gelenData);
    var eskiSıra = gelenData.sirasi;
    //console.log('gelenData', gelenData.sirasi);

    var yeniItem = this.tercihListesi.find(p => p.bolum_kodu == gelenData.bolum_kodu);
    //console.log('yeniItem', yeniItem);

    yeniItem.sirasi = yeniSira;
    //console.log('yeniItem.sirasi', yeniItem.sirasi);

    let indexgelen = this.tercihListesi.indexOf(yeniItem);
    this.tercihListesi[indexgelen] = yeniItem;

    var eskiItem = this.tercihListesi.find(p => p.sirasi == yeniSira);

    eskiItem.sirasi = eskiSıra;
    let index = this.tercihListesi.indexOf(eskiItem);
    this.tercihListesi[index] = eskiItem;

    //console.log('this.tercihListesi', this.tercihListesi);

    this.tercihListesi.sort((a, b) => (a.sirasi > b.sirasi) ? 1 : (b.sirasi > a.sirasi) ? -1 : 0);
    //console.log('this.tercihListesi', this.tercihListesi);

    this.agGrid.api.setRowData(this.tercihListesi);

  }
  tercihEkle() {
    var tercih_listesi = {
      basvuru_id: this.data.basvuruID,
      ogrenci_basvuru_id: this.data.ogrenciBasvuruID,
      tercihler: this.tercihListesi,
      puan_turu_id: this.preferenceForm.get('puan_turu_id').value,
      ham_puani: this.preferenceForm.get('ham_puani').value,
      puani: this.preferenceForm.get('puani').value,
      puan_belgesi: this.preferenceForm.get('puan_belgesi').value
    }

    this.studentService
      .preference_save(tercih_listesi)
      .subscribe(res => {
        if (res.result) {
          Swal.fire({
            text: this.translate.instant('TEXT.SAVE_SUCCESSFUL'),
            icon: 'success',
            showConfirmButton: false,
            timer: 2500
          });
          this.dialogRef.close({ 'tercihEkle': res.result, 'tercihListesi': this.tercihListesi });
        } else {
          Swal.fire({
            text: this.translate.instant("TEXT.OPERATION_FAILED"),
            html: this.errorService.arrayError(res.error.message),
            icon: 'error',
            showConfirmButton: true
          });
        }
      });
  }
}
