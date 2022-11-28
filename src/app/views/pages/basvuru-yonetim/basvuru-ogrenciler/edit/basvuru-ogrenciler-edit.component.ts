import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { BasvuruOgrencilerComponent } from '../basvuru-ogrenciler.component';
import { BasvuruService } from '../../../../services/basvuru.service';

@Component({
  selector: 'kt-basvuru-ogrenciler-edit',
  templateUrl: './basvuru-ogrenciler-edit.component.html',
  styleUrls: ['./basvuru-ogrenciler-edit.component.scss']
})
export class BasvuruOgrencilerEditComponent implements OnInit {

  BasvuruDurumlari = [
    { value: 0, text: this.translate.instant("TEXT.red") },
    { value: 1, text: this.translate.instant("TEXT.yeni_kayit") },
    { value: 2, text: this.translate.instant("TEXT.ogrenci_onayladi") },
    { value: 3, text: this.translate.instant("TEXT.yonetici_onayladi") },
    { value: 4, text: this.translate.instant("TEXT.kesin_kayit") },
  ];

  loading = false;

  BasvuruOgrenciTanimForm: FormGroup;
  buttonSave: string = this.translate.instant('TEXT.SAVE');
  constructor(
    private translate: TranslateService,
    private basvuruService: BasvuruService,
    public dialogRef: MatDialogRef<BasvuruOgrencilerComponent>,
    private fb: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.BasvuruOgrenciTanimForm = this.fb.group({
      odeme_onay: ['', Validators.compose([Validators.required])],
      basvuru_durumu: ['', Validators.compose([Validators.required])],
      yonetici_aciklama: [''],
    });
    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');
      this.BasvuruOgrenciTanimForm.addControl("obId", new FormControl());
      this.BasvuruOgrenciTanimForm.setValue({
        obId: this.data.id,
        odeme_onay: this.data.odeme_onay,
        basvuru_durumu: this.data.basvuru_durumu,
        yonetici_aciklama: this.data.yonetici_aciklama,
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
    this.basvuruService.getBasvuruOgrencilerSave(this.BasvuruOgrenciTanimForm.value).subscribe(res => {

      if(res.result)
      {
        this.dialogRef.close({
          data: true
        });
      }
      else
      {
        this.dialogRef.close({
          data: false
        });
      }

    })


  }

  ObjectContorls() {
    const controls = this.BasvuruOgrenciTanimForm.controls;

    return Object.keys(controls);
  }

  odeme_onay: string = this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");

  //1 odeme_onay

  changeStatu(e) {
    if (e == 1) { this.odeme_onay = this.odeme_onay == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE"); }
  }

}
