import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IslemTurleriSinavEnum } from '../../../../../core/Enums/IslemTurleri.enum';
import { OgrenciBasvuruDurumEnum } from '../../../../../core/Enums/OgrenciBasvuruDurum.enum';
import { OgrenciSinavDurumEnum } from '../../../../../core/Enums/OgrenciSinavDurum.enum';
import { TrueFalseEnum } from '../../../../../core/Enums/TrueFalse.enum';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';
import { TranslateService } from '../../../../../core/services/translate.service';
import { BasvuruService } from '../../../../../views/services/basvuru.service';
import Swal from 'sweetalert2';
import { keyValue } from '../../../../../core/models/keyValue';
import { BasvuruOgrencilerComponent } from '../../../basvuru-yonetim/basvuru-ogrenciler/basvuru-ogrenciler.component';


@Component({
  selector: 'kt-toplu-sinav-onay',
  templateUrl: './toplu-sinav-onay.component.html',
  styleUrls: ['./toplu-sinav-onay.component.scss']
})
export class TopluSinavOnayComponent implements OnInit {

  islemTuru: IslemTurleriSinavEnum;
  islemTurleriEnum = IslemTurleriSinavEnum;
  ogrBasvuruIds: string = "";
  basvuruId: any;
  onayForm: any;

  ogrenciBasvuruDurumlari: any;
  ogrenciSinavDurumlari: any;
  OgrenciBasvuruOdemeDurumlari: any;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private dokoSettingsService: DokoSettingsService,
    private basvuruService: BasvuruService,
    public dialogRef: MatDialogRef<BasvuruOgrencilerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.ogrenciBasvuruDurumlari = this.dokoSettingsService.getSelectBoxByEnumType(OgrenciBasvuruDurumEnum);
    this.ogrenciSinavDurumlari = this.dokoSettingsService.getSelectBoxByEnumType(OgrenciSinavDurumEnum);
    this.OgrenciBasvuruOdemeDurumlari = this.dokoSettingsService.getSelectBoxByEnumType(TrueFalseEnum);
    this.basvuruId = this.data.basvuruId;
  }

  ngOnInit(): void {
    this.islemTuru = this.data.islemTuru;
    this.ogrBasvuruIds = this.data.ogrBasvuruIds?.join(",");
    this.initRegisterForm();
  }

  initRegisterForm() {

    this.onayForm = this.fb.group({
      durumu: ['', Validators.compose([Validators.required])],
      durum_aciklama: ['']
    });

    if (this.islemTuru == IslemTurleriSinavEnum.sinav_salonuna_atama) {
      this.getMerkezList();
    }

  }

  submit() {

    if (this.islemTuru == IslemTurleriSinavEnum.basvuru_durumu) {
      this.TopluOgrenciBasvuruDurumGuncelle();
    }
    if (this.islemTuru == IslemTurleriSinavEnum.sinava_girme_durumu) {
      this.topluOgrenciGirisDurumGuncelle();
    }
    if (this.islemTuru == IslemTurleriSinavEnum.sinav_salonuna_atama) {
      this.TopluMerkezeGoreSalonAtama();
    }
    if (this.islemTuru == IslemTurleriSinavEnum.odeme_onay) {
      this.TopluOgrenciOdemeDurumGuncelle();
    }

  }

  TopluOgrenciBasvuruDurumGuncelle() {
    this.basvuruService.topluOgrenciSinavBasvuruDurumGuncelle(this.ogrBasvuruIds, this.onayForm.value.durumu).subscribe(res => {
      if (res.result) {
        this.dialogRef.close();
        Swal.fire({
          text: this.translate.instant('TEXT.UPDATE_SUCCESSFUL'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        });
      }
      else {
        Swal.fire({
          text: this.translate.instant("TEXT.OPERATION_FAILED"),
          html: this.dokoSettingsService.arrayError(res.error.message),
          icon: 'error',
          showConfirmButton: true
        });
      }
    })
  }

  topluOgrenciGirisDurumGuncelle() {
    this.basvuruService.topluOgrenciSinavGirisDurumGuncelle(this.ogrBasvuruIds, this.onayForm.value.durumu, this.onayForm.value.durum_aciklama).subscribe(res => {
      if (res.result) {
        this.dialogRef.close();
        Swal.fire({
          text: this.translate.instant('TEXT.UPDATE_SUCCESSFUL'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        });
      }
      else {
        Swal.fire({
          text: this.translate.instant("TEXT.OPERATION_FAILED"),
          html: this.dokoSettingsService.arrayError(res.error.message),
          icon: 'error',
          showConfirmButton: true
        });
      }
    })
  }

  TopluOgrenciOdemeDurumGuncelle() {
    this.basvuruService.topluOgrenciSinavOdemeDurumGuncelle(this.ogrBasvuruIds, this.onayForm.value.durumu).subscribe(res => {
      this.dialogRef.close();
      if (res.result) {
        Swal.fire({
          text: this.translate.instant('TEXT.UPDATE_SUCCESSFUL'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        });
      }
      else {
        Swal.fire({
          text: this.translate.instant("TEXT.OPERATION_FAILED"),
          html: this.dokoSettingsService.arrayError(res.error.message),
          icon: 'error',
          showConfirmButton: true
        });
      }
    })
  }

  TopluMerkezeGoreSalonAtama() {
    this.basvuruService.topluMerkezeGoreSalonAtama(this.onayForm.value.durumu, this.basvuruId).subscribe(res => {
      this.dialogRef.close();
      if (res.result) {
        Swal.fire({
          text: this.translate.instant('TEXT.UPDATE_SUCCESSFUL'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        });
      }
      else {
        Swal.fire({
          text: this.translate.instant("TEXT.OPERATION_FAILED"),
          html: this.dokoSettingsService.arrayError(res.error.message),
          icon: 'error',
          showConfirmButton: true
        });
      }
    })
  }

  merkezList: keyValue[] = []
  getMerkezList() {
    this.basvuruService.getSinavAtanacakMerkezList(this.basvuruId).subscribe(res => {
      if (res.result) {
        res.data.forEach(m => {
          var merkez_id = { key: m.adi_tr, value: m.id, selected: false }
          this.merkezList.push(merkez_id)

        });
      }
    })
  }

}
