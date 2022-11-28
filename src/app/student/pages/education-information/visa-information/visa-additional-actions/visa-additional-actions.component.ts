import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisaInformationComponent } from '../visa-information.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { fieldValidations } from '../../../../../core/Enums/fieldValidations';
import { keyValue } from '../../../../../core/models/keyValue';
import Swal from 'sweetalert2';
import { StudentService } from '../../../../services/student.service';
import { finalize, tap } from 'rxjs/operators';
import { ErrorService } from '../../../../services/error.service';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';
import { TranslateService } from '../../../../../core/services/translate.service';

@Component({
  selector: 'kt-visa-additional-actions',
  templateUrl: './visa-additional-actions.component.html',
  styleUrls: ['./visa-additional-actions.component.scss']
})
export class VisaAdditionalActionsComponent implements OnInit {
  public errorState: boolean = false;
  public btnAdi: string = 'SAVE';
  submitDisabled: boolean = false;
  islem: boolean = false;
  
  vizeForm: FormGroup;
  validations = fieldValidations;

  constructor(
    private studentService: StudentService,
    public dokoSettingsService: DokoSettingsService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private errorService: ErrorService,
    public dialogRef: MatDialogRef<VisaInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    console.log('data', this.data);
    this.islem = false;
    this.initForm();

    console.log('form1', this.vizeForm);

    if (this.data.vizeBilgisi.vize_durumu !==null && (this.data.vizeBilgisi.vize_durumu == '0' || this.data.vizeBilgisi.vize_durumu == 1)) {
      this.btnAdi = "UPDATE";
      Object.keys(this.vizeForm.controls).forEach((key) => {
        this.vizeForm.get(key).setValue(this.data.vizeBilgisi[key]);
      });
      this.vizeDurumu(this.data.vizeBilgisi.vize_durumu);
    } else {
      this.islem = true;
    }
    console.log('form2', this.vizeForm);
  }
  initForm() {
    this.vizeForm = new FormGroup({
      vize_durumu: new FormControl('', [
        Validators.required
      ]),
      vize_ulke_kodu: new FormControl(''),
      vize_konsolosluk_kodu: new FormControl('')
    });
  }
  vizeUlkeKonsolosluklar() {
    if (this.vizeForm.get('vize_ulke_kodu').value) {
      let konsolosluklar = this.data.vizeUlkeBilgisi.filter(y => y.ulke_kodu == (this.vizeForm.get('vize_ulke_kodu').value));
      return konsolosluklar;
    }
  }
  vizeDurumu(value) {
    console.log('radio value', value);
    if (value) {
      this.vizeForm.controls['vize_ulke_kodu'].setValidators([
        Validators.required,
        Validators.pattern(this.validations.kod10)
      ]);
      this.vizeForm.controls['vize_konsolosluk_kodu'].setValidators([
        Validators.required,
        Validators.pattern(this.validations.kod10)
      ]);
      this.vizeForm.get('vize_ulke_kodu').updateValueAndValidity();
      this.vizeForm.get('vize_konsolosluk_kodu').updateValueAndValidity();
    } else {
      this.errorState = false;
      this.vizeForm.controls['vize_ulke_kodu'].clearValidators();
      this.vizeForm.controls['vize_konsolosluk_kodu'].clearValidators();
      this.vizeForm.get('vize_ulke_kodu').updateValueAndValidity();
      this.vizeForm.get('vize_konsolosluk_kodu').updateValueAndValidity();
    }

  }
  errorControl(input: string): any {
    let result = this.errorService.errorControl(input, this.vizeForm);
    if (input === '*') {
      this.errorState = result;
    } else {
      return result;
    }
  }
  vizeEkle() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.submitDisabled = true;
      this.dialogRef.close({ 'vizeEkle': true, 'vizeVerileri': this.vizeForm.value });
    } else {
      this.submitDisabled = false;
      this.cdr.markForCheck();
    }
  }
  vizeGuncelle() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.dialogRef.close({ 'vizeGuncelle': true, 'vizeVerileri': this.vizeForm.value });
    }
  }
  vizeSil() {
    Swal.fire({
      title: this.translate.instant('TEXT.DELETE_WANT'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('TEXT.CANCEL'),
      confirmButtonText: this.translate.instant('TEXT.DELETE'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        Object.keys(this.vizeForm.controls).forEach((key) => {
          this.vizeForm.get(key).setValue(null);
          Swal.fire({
            text: this.translate.instant("TEXT.DELETE_SUCCESSFUL"),
            icon: 'success',
            showConfirmButton: false,
            timer: 3000
          });
          this.dialogRef.close({ 'vizeSil': true, 'vizeVerileri': this.vizeForm.value });
          
        });
      }
    })

  }
  // Kayıt ve Güncelleme İşlemleri Bitiş
}
