import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { KullaniciListComponent } from '../kullanici-list/kullanici-list.component';
import { KurumTanimService } from '../../../../services/kurum-tanim.service';
import { keyValue } from '../../../../../core/models/keyValue';

@Component({
  selector: 'kt-kullanici-add',
  templateUrl: './kullanici-add.component.html',
  styleUrls: ['./kullanici-add.component.scss']
})
export class KullaniciAddComponent implements OnInit {

  rolIds =
    [
      { key: 1, value: this.translate.instant('TEXT.unit_manager') },
      { key: 2, value: this.translate.instant('TEXT.unit_manager_assistant') },
      { key: 3, value: this.translate.instant('TEXT.agent_user') },
      { key: 4, value: this.translate.instant('TEXT.unit_user') },
    ];

  kullaniciTanimForm: FormGroup;
  protected name: string = "kullanıcı";
  loading = false;
  buttonSave: string = this.translate.instant('TEXT.SAVE');
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<KullaniciListComponent>,
    private kurumService: KurumTanimService,

    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {

    this.getKurumlar();

    this.kullaniciTanimForm = this.fb.group({
      //id: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      adi_soyadi: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
      eposta: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      kurum_id: ['', Validators.compose([Validators.maxLength(11)])],
      rol_id: ['', Validators.compose([Validators.maxLength(11)])],
      super_user: [false, Validators.compose([Validators.required])],
      durumu: [false, Validators.compose([Validators.required])],
    });

    this.kullaniciTanimForm.addControl("id", new FormControl());


    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');

      this.kullaniciTanimForm.setValue({
        id: this.data.id,
        adi_soyadi: this.data.adi_soyadi,
        eposta: this.data.eposta,
        kurum_id: this.data.kurum_id,
        rol_id: this.data.rol_id,
        super_user: this.data.super_user,
        durumu: this.data.durumu,

      });

      this.durumuText = this.data.durumu ? this.translate.instant('TEXT.ACTIVE') : this.translate.instant('TEXT.PASSIVE');
      this.spUserText = this.data.super_user ? this.translate.instant('TEXT.TRUE') : this.translate.instant('TEXT.FALSE');

    } else {

      this.kullaniciTanimForm.addControl("sifre", new FormControl('', [Validators.required, Validators.maxLength(100)]));

    }

  }

  kurumKodlari: keyValue[] = []
  getKurumlar() {

    this.kurumService.getList().subscribe(res => {

      if (res.result) {
        res.data.forEach(element => {
          var kurum = new keyValue();
          kurum.key = element.adi;
          kurum.value = element.id;
          this.kurumKodlari.push(kurum);
        });
      }

    })
  }

  submit() {

    const controls = this.kullaniciTanimForm.controls;
    console.log(controls);
    /** check form */
    if (this.kullaniciTanimForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.dialogRef.close({
      data: this.kullaniciTanimForm.value
    });

  }

  durumuText: string = this.translate.instant("TEXT.PASSIVE");
  spUserText: string = this.translate.instant("TEXT.FALSE");
  //1 durum 
  //2 super_user

  changeStatu(e) {
    if (e == 1) {
      this.durumuText = this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
    }

    if (e == 2) {
      this.spUserText = this.spUserText == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");
    }

  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.kullaniciTanimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
