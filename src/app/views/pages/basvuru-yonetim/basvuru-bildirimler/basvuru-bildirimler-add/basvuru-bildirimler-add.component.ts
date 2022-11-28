import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../../../../core/services/translate.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasvuruBildirimlerComponent } from '../basvuru-bildirimler.component';
import { ActivatedRoute, Router } from '@angular/router';
import { keyValue } from '../../../../../core/models/keyValue';
import { BasvuruService } from '../../../../services/basvuru.service';

@Component({
  selector: 'kt-basvuru-bildirimler-add',
  templateUrl: './basvuru-bildirimler-add.component.html',
  styleUrls: ['./basvuru-bildirimler-add.component.scss']
})
export class BasvuruBildirimlerAddComponent implements OnInit {
  bildirimTanimForm: FormGroup;
  protected name: string = "bildiri";
  loading = false;
  buttonSave: string = this.translate.instant('TEXT.SAVE');
  basvuruId: any;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<BasvuruBildirimlerComponent>,
    private activatedRoute: ActivatedRoute,
    private basvuruService: BasvuruService,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.basvuruId = data.basvuru_id
  }

  ngOnInit(): void {
    this.initRegisterForm();

  }

  initRegisterForm() {
    this.getOgrenciList();

    this.bildirimTanimForm = this.fb.group({
      turu: ['', Validators.compose([Validators.required])],
      mesaj: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
      baslama_tarihi: ['', Validators.compose([Validators.required])],
      bitis_tarihi: ['', Validators.compose([Validators.required])],
      durumu: [true, Validators.compose([Validators.required])],
    });

    if (this.data.id) {
      this.bildirimTanimForm.addControl("id", new FormControl());
      const controls = this.bildirimTanimForm.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.data[controlName])
      });
      this.durumuText = this.data.durumu ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
    }

  }

  ObjectContorls() {
    const controls = this.bildirimTanimForm.controls;
    var object = Object.keys(controls)
      .filter(p => p != "id");
    return object;
  }

  ogrenciList: keyValue[] = []
  getOgrenciList() {
    this.basvuruService.getBildirimOgrenciList(this.basvuruId).subscribe(res => {
      if (res.result) {
        res.data.forEach(m => {
          var ogrenci_id = { key: m.adi + ' ' + m.soyadi, value: m.id, selected: false }
          this.ogrenciList.push(ogrenci_id)

        });
      }
    })
  }

  submit() {

    const controls = this.bildirimTanimForm.controls;
    /** check form */
    if (this.bildirimTanimForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.dialogRef.close({
      data: this.bildirimTanimForm.value
    });

  }

  durumuText: string = this.translate.instant("TEXT.ACTIVE");
  //1 durum 
  changeStatu() {
    this.durumuText = this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
  }

  /**
* Checking control validation
*
* @param controlName: string => Equals to formControlName
* @param validationType: string => Equals to valitors name
*/
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.bildirimTanimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
