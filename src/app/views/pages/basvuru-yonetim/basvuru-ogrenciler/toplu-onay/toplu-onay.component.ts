import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasvuruService } from '../../../../../views/services/basvuru.service';
import { OgrenciBasvuruDurumEnum } from '../../../../../core/Enums/OgrenciBasvuruDurum.enum';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';
import { BasvuruOgrencilerComponent } from '../basvuru-ogrenciler.component';
import { IslemTurleriEnum } from '../../../../../core/Enums/IslemTurleri.enum';
import Swal from 'sweetalert2';
import { OgrenciYerlesmeDurumEnum } from '../../../../../core/Enums/OgrenciYerlesmeDurum.enum';
import { TrueFalseEnum } from '../../../../../core/Enums/TrueFalse.enum';
import { TranslateService } from '../../../../../core/services/translate.service';

@Component({
  selector: 'kt-toplu-onay',
  templateUrl: './toplu-onay.component.html',
  styleUrls: ['./toplu-onay.component.scss']
})
export class TopluOnayComponent implements OnInit {

  islemTuru: IslemTurleriEnum;
  islemTurleriEnum = IslemTurleriEnum;
  ogrBasvuruIds: string = "";
  onayForm: any;

  ogrenciBasvuruDurumlari:any;
  ogrenciYerlesmeDurumlari :any;
  OgrenciBasvuruOdemeDurumlari :any;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<BasvuruOgrencilerComponent>,
    private dokoSettingsService: DokoSettingsService,
    private basvuruService: BasvuruService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ogrenciBasvuruDurumlari = this.dokoSettingsService.getSelectBoxByEnumType(OgrenciBasvuruDurumEnum);
    this.ogrenciYerlesmeDurumlari = this.dokoSettingsService.getSelectBoxByEnumType(OgrenciYerlesmeDurumEnum);
    this.OgrenciBasvuruOdemeDurumlari = this.dokoSettingsService.getSelectBoxByEnumType(TrueFalseEnum); 

   }


  ngOnInit(): void {

    console.log(' seçile list', this.data)
    this.islemTuru = this.data.islemTuru;
    this.ogrBasvuruIds = this.data.ogrBasvuruIds?.join(",");

    console.log(' this.data.ogrBasvuruIds?.join(",")', this.data.ogrBasvuruIds?.join(","))

    console.log('this.ogrBasvuruIds ', this.ogrBasvuruIds)
    this.initRegisterForm();
  }

  initRegisterForm() {

    this.onayForm = this.fb.group({
      durumu: ['', Validators.compose([Validators.required])]
    });

  }

  submit() {

    if (this.islemTuru == IslemTurleriEnum.basvuru_durumu) {
      this.TopluOgrenciBasvuruDurumGuncelle();
    }
    if (this.islemTuru == IslemTurleriEnum.yerlesme_durumu) {
      this.TopluOgrenciYerlestirmeDurumGuncelle();
    }
    if (this.islemTuru == IslemTurleriEnum.odeme_onay) {
      this.TopluOgrenciOdemeDurumGuncelle();
    }

  }

  TopluOgrenciBasvuruDurumGuncelle() {
    this.basvuruService.topluOgrenciOrtakBasvuruDurumGuncelle(this.ogrBasvuruIds, this.onayForm.value.durumu).subscribe(res => {
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

  TopluOgrenciYerlestirmeDurumGuncelle() {
    this.basvuruService.topluOgrenciOrtakYerlestirmeDurumGuncelle(this.ogrBasvuruIds, this.onayForm.value.durumu).subscribe(res => {
      this.dialogRef.close();
      console.log(res);
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

  TopluOgrenciOdemeDurumGuncelle() {
    this.basvuruService.topluOgrenciOrtakOdemeDurumGuncelle(this.ogrBasvuruIds, this.onayForm.value.durumu).subscribe(res => {
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


}
