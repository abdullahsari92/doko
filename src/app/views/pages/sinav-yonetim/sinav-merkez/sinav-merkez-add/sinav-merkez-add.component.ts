import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { keyValue } from '../../../../../core/models/keyValue';
import { UlkeTanimService } from '../../../../../views/services/ulke-tanim.service';
import { BasvuruService } from '../../../../../views/services/basvuru.service';
import { SinavMerkezComponent } from '../sinav-merkez.component';
import { finalize, tap } from 'rxjs/operators';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';

@Component({
  selector: 'kt-sinav-merkez-add',
  templateUrl: './sinav-merkez-add.component.html',
  styleUrls: ['./sinav-merkez-add.component.scss']
})

export class SinavMerkezAddComponent implements OnInit {
  sinavMerkez: FormGroup;
  protected name: string = "basvuru";
  loading = false;
  buttonSave: string = "Kaydet";
  objectInputs: any;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<SinavMerkezComponent>,
    private basvuruService: BasvuruService,
    private ulkeService: UlkeTanimService,
    private cdr: ChangeDetectorRef,
    public dokoSettingService:DokoSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initRegisterForm();
  }

  ngOnInit(): void {

  }

  initRegisterForm() {
    this.getUlkeler();

    this.sinavMerkez = this.fb.group({
      adi_tr: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      adi_en: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      ulke_kodu: [''],
      sehir: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      adres: ['', Validators.compose([Validators.required])],
      sorumlusu: [''],
      sinav_saati: ['', Validators.compose([Validators.required])],
      lokasyon: [''],
      durumu: [true, Validators.compose([Validators.required])],
      basvuru_id: [this.data.basvuru_id]
    });

    //this.ObjectContorls();
    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');

      this.sinavMerkez.addControl("id", new FormControl());
      const controls = this.sinavMerkez.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.data[controlName])
      });

    }

  }

  ulkeKodlari: keyValue[] = []
  getUlkeler() {
    this.ulkeService.getList().pipe(tap(res => {
      if (res.result) {
        res.data.forEach(element => {
          var ulke = new keyValue();
          ulke.key = element.adi_tr;
          ulke.value = element.kodu;
          this.ulkeKodlari.push(ulke);
        });
      }

    }), finalize(() => {
      this.cdr.markForCheck();
    })).subscribe(res => {

    })
  }

  ObjectContorls() {

    const controls = this.sinavMerkez.controls;
    var object = Object.keys(controls).filter(p => p != "durumu").filter(p => p != "basvuru_id")
      .filter(p => p != "id").filter(p => p != "ulke_kodu");
    this.objectInputs = object;

  }

  submit() {
    const controls = this.sinavMerkez.controls;
    /** check form */
    if (this.sinavMerkez.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.basvuruService.getSinavMerkezSave(this.sinavMerkez.value).subscribe(res => {

    })
    this.dialogRef.close({
      data: this.sinavMerkez.value
    });

  }

  

}
