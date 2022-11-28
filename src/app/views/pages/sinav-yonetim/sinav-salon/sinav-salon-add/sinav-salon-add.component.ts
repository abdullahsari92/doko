import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { BasvuruService } from '../../../../../views/services/basvuru.service';
import { SinavSalonComponent } from '../sinav-salon.component';

@Component({
  selector: 'kt-sinav-salon-add',
  templateUrl: './sinav-salon-add.component.html',
  styleUrls: ['./sinav-salon-add.component.scss']
})
export class SinavSalonAddComponent implements OnInit {

  sinavSalon: FormGroup;
  protected name: string = "basvuru";
  loading = false;
  buttonSave: string = "Kaydet";
  objectInputs: any;
  constructor(private fb: FormBuilder,
    private translate: TranslateService,

    public dialogRef: MatDialogRef<SinavSalonComponent>,
    private basvuruService: BasvuruService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.initRegisterForm();
  }

  initRegisterForm() {

    this.sinavSalon = this.fb.group({
      merkez_id: ["", Validators.compose([Validators.maxLength(100)])],
      adi_tr: [''],
      adi_en: [''],
      bina_adi: [''],
      kontenjan: ['', Validators.compose([Validators.required])],
      adres: ['', Validators.compose([Validators.required])],
      gozetmen: ['', Validators.compose([Validators.required])],
      durumu: ['true', Validators.compose([Validators.required])],
      basvuru_id: [""]

    });

    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');
      this.sinavSalon.addControl("id", new FormControl());
      const controls = this.sinavSalon.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.data[controlName])
      });
    }

  }

  ObjectContorls() {

    const controls = this.sinavSalon.controls;
    var object = Object.keys(controls).filter(p => p != "durumu")
      .filter(p => p != "basvuru_id")
      .filter(p => p != "merkez_id")
      .filter(p => p != "id");
    this.objectInputs = object;

  }

  durumuText: string = 'TEXT.ACTIVE';
  //1 durum 
  changeStatu(e) {
    if (e == 1) { this.durumuText = this.durumuText == "TEXT.PASSIVE" ? 'TEXT.ACTIVE' : 'TEXT.PASSIVE'; }
  }

  submit() {

    const controls = this.sinavSalon.controls;
    /** check form */
    if (this.sinavSalon.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.sinavSalon.value.merkez_id = this.data.merkez_id;
    this.sinavSalon.value.basvuru_id = this.data.basvuru_id;

    this.basvuruService.getSinavSalonSave(this.sinavSalon.value).subscribe(res => {

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

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.sinavSalon.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }


}
