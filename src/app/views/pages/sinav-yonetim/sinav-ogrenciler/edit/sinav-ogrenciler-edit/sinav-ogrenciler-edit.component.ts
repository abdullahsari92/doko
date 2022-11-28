import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { keyValue } from '../../../../../../core/models/keyValue';
import { TranslateService } from '../../../../../../core/services/translate.service';
import { SinavOgrencilerComponent } from '../../sinav-ogrenciler.component';
import { BasvuruService } from '../../../../../services/basvuru.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'kt-sinav-ogrenciler-edit',
  templateUrl: './sinav-ogrenciler-edit.component.html',
  styleUrls: ['./sinav-ogrenciler-edit.component.scss']
})
export class SinavOgrencilerEditComponent implements OnInit {

  BasvuruDurumlari = [
    { value: 0, text: this.translate.instant("TEXT.red") },
    { value: 1, text: this.translate.instant("TEXT.yeni_kayit") },
    { value: 2, text: this.translate.instant("TEXT.ogrenci_onayladi") },
    { value: 3, text: this.translate.instant("TEXT.yonetici_onayladi") },
    { value: 4, text: this.translate.instant("TEXT.kesin_kayit") },
  ];

  SinavDurumlari = [
    { value: -1, text: this.translate.instant("TEXT.sinav_gerceklesmedi") },
    { value: 0, text: this.translate.instant("TEXT.sinav_girdi") },
    { value: 1, text: this.translate.instant("TEXT.sinav_girmedi") },
    { value: 2, text: this.translate.instant("TEXT.sinav_reddedildi") },
  ];
  loading = false;

  BasvuruOgrenciTanimForm: FormGroup;
  buttonSave: string = this.translate.instant('TEXT.SAVE');
  constructor(
    private translate: TranslateService,
    private basvuruService: BasvuruService,
    public dialogRef: MatDialogRef<SinavOgrencilerComponent>,
    private fb: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.getMerkezList();
    //this.getSalonList(this.data.merkez_id);
    this.BasvuruOgrenciTanimForm = this.fb.group({
      //ogrenci_basvuru_id: ['', Validators.compose([])],
      odeme_onay: ['', Validators.compose([Validators.required])],
      basvuru_durumu: ['', Validators.compose([Validators.required])],
      merkez_id: ['', Validators.compose([Validators.required])],
      sinav_durumu: ['', Validators.compose([Validators.required])],
      yonetici_aciklama: [''],
      //salon_id: ['', Validators.compose([])],
      //salon_sira: ['', Validators.compose([])],
      kitapcik: ['', Validators.compose([])],
    });

    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');
      this.BasvuruOgrenciTanimForm.addControl("osbId", new FormControl());
      this.BasvuruOgrenciTanimForm.addControl("obId", new FormControl());
      this.BasvuruOgrenciTanimForm.setValue({
        osbId: this.data.osbId,
        obId: this.data.id,
        odeme_onay: this.data.odeme_onay,
        basvuru_durumu: this.data.basvuru_durumu,
        merkez_id: this.data.merkez_id,
        sinav_durumu: this.data.sinav_durumu,
        yonetici_aciklama: this.data.yonetici_aciklama,
        //salon_id: this.data.salon_id,
        //salon_sira: this.data.salon_sira,
        kitapcik: this.data.kitapcik,
      });
    }
  }

  submit() {
    const controls = this.BasvuruOgrenciTanimForm.controls;
    /** check form */
    if (this.BasvuruOgrenciTanimForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.basvuruService.getSinavOgrencilerUpdate(this.BasvuruOgrenciTanimForm.value).subscribe(res => {
    })
    this.dialogRef.close({
      data: this.BasvuruOgrenciTanimForm.value
    });
  }

  ObjectContorls() {
    const controls = this.BasvuruOgrenciTanimForm.controls;
    return Object.keys(controls);
  }

  odeme_onay: string = this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");

  //1 odeme_onay
  //2 kayit_turu
  //3 uyruk_bilgisi
  changeStatu(e) {
    if (e == 1) { this.odeme_onay = this.odeme_onay == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE"); }
  }

  merkezList: keyValue[] = []
  getMerkezList() {
    this.basvuruService.getSinavMerkezList(this.data.basvuru_id).subscribe(res => {
      if (res.result) {
        var merkez_id = { key: this.translate.instant("TEXT.SELECT"), value: "-1", selected: false }
        this.merkezList.push(merkez_id)
        res.data.forEach(m => {
          var merkez_id = { key: m.adi_tr, value: m.id, selected: false }
          this.merkezList.push(merkez_id)
        });
      }
    })
  }

  // salonList: keyValue[] = []
  // getSalonList(dataMerkez) {
  //   this.salonList = [];
  //   this.basvuruService.getSinavSalonList(dataMerkez).subscribe(res => {
  //     if (res.result) {
  //       var salonSelected = { key: this.translate.instant("TEXT.SELECT"), value: "-1", selected: false }
  //       this.salonList.push(salonSelected)
  //       res.data.forEach(m => {
  //         var salon_id = { key: m.adi_tr, value: m.id, selected: false }
  //         this.salonList.push(salon_id)
  //       });
  //     }
  //   })
  // }

  // onChangeMerkez(dataMerkez: any) {
  //   this.getSalonList(dataMerkez.value);
  // }

}
