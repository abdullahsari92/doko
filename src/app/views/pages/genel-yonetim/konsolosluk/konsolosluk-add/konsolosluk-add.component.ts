import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { keyValue } from '../../../../../core/models/keyValue';
//import { UlkeTanimService } from '../../../../services/ulke-tanim.service';
import { KonsoloslukTanimService } from '../../../../services/konsolosluk-tanim.service';
import { KonsoloslukListComponent } from '../konsolosluk-list/konsolosluk-list.component';

@Component({
  selector: 'kt-konsolosluk-add',
  templateUrl: './konsolosluk-add.component.html',
  styleUrls: ['./konsolosluk-add.component.scss']
})
export class KonsoloslukAddComponent implements OnInit {

  konsoloslukTanimForm: FormGroup;
  protected name: string = "konsolosluk";
  loading = false;
  buttonSave: string = this.translate.instant('TEXT.SAVE');

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<KonsoloslukListComponent>,
    //private ulkeService: UlkeTanimService,
    private konsoloslukService: KonsoloslukTanimService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {

    this.getUlkeler()

    this.konsoloslukTanimForm = this.fb.group({
      //id: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      ulke_kodu: ['', Validators.compose([Validators.required, Validators.maxLength(4)])],
      adi_tr: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      adi_en: ['', Validators.compose([Validators.maxLength(100)])],
      kodu: ['', Validators.compose([Validators.maxLength(4)])]

    });

    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');
      this.konsoloslukTanimForm.addControl("id", new FormControl());
      this.konsoloslukTanimForm.setValue({
        id: this.data.id,
        ulke_kodu: this.data.ulke_kodu,
        adi_tr: this.data.adi_tr,
        adi_en: this.data.adi_en,
        kodu: this.data.kodu
      });
    }

  }

  ulkeKodlari: keyValue[] = []
  getUlkeler() {
    this.konsoloslukService.getCountryList().subscribe(res => {
      if (res.result) {
        res.data.forEach(element => {
          var ulke = new keyValue();
          ulke.key = element.adi_tr;
          ulke.value = element.kodu;
          this.ulkeKodlari.push(ulke);
        });
      }
    })
  }

  submit() {

    const controls = this.konsoloslukTanimForm.controls;
    /** check form */
    if (this.konsoloslukTanimForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.dialogRef.close({
      data: this.konsoloslukTanimForm.value
    });

  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.konsoloslukTanimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
