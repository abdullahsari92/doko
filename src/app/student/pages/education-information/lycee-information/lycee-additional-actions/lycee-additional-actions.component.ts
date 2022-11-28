import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LyceeInformationComponent } from '../lycee-information.component';
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
  selector: 'kt-lycee-additional-actions',
  templateUrl: './lycee-additional-actions.component.html',
  styleUrls: ['./lycee-additional-actions.component.scss']
})
export class LyceeAdditionalActionsComponent implements OnInit {
  public errorState: boolean = false;
  public btnAdi: string = 'SAVE';
  submitDisabled: boolean = false;
  islem: boolean = false;
  lyceeForm: FormGroup;
  validations = fieldValidations;
  ulkeKodlari: keyValue[] = [];
  constructor(
    private studentService: StudentService,
    public dokoSettingsService: DokoSettingsService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private errorService: ErrorService,
    public dialogRef: MatDialogRef<LyceeInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    console.log('data', this.data);
    this.islem = false;
    this.initForm();

    if (this.data.ulkeler) {
      this.ulkeKodlari = this.data.ulkeler;
    }

    if (this.data.id !== undefined && this.data.liseBilgisi !== undefined) {
      this.lyceeForm.addControl('id', new FormControl('', Validators.required));
      this.btnAdi = "UPDATE";
      Object.keys(this.lyceeForm.controls).forEach((key) => {
        this.lyceeForm.get(key).setValue(this.data.liseBilgisi[key]);
      });
    } else {
      this.islem = true;
    }
  }
  initForm() {
    this.lyceeForm = new FormGroup({
      adi: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.metin)
      ]),
      egitim_suresi: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.sayi2)
      ]),
      baslama_yili: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.yil)
      ]),
      bitis_yili: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.yil)
      ]),
      sehir: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.metin)
      ]),
      ortalama_dortluk: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.dortlukNot)
      ]),
      ortalama_yuzluk: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.yuzlukNot)
      ]),
      ulke_kodu: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.kod4)
      ]),
      diploma_belgesi: new FormControl('', [
        Validators.required
      ]),
    });
  }
  errorControl(input: string): any {
    let result = this.errorService.errorControl(input, this.lyceeForm);
    if (input === '*') {
      this.errorState = result;
    } else {
      return result;
    }
  }

  // Kayıt ve Güncelleme İşlemleri Başlangıç
  liseEkle() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.submitDisabled = true;
      this.studentService
        .high_school_save(this.lyceeForm.value)
        .subscribe(res => {
          if (res.result) {
            Swal.fire({
              text: this.translate.instant('TEXT.SAVE_SUCCESSFUL'),
              icon: 'success',
              showConfirmButton: false,
              timer: 2500
            });
            this.dialogRef.close({ 'liseEkle': res });
          } else {
            Swal.fire({
              text: this.translate.instant("TEXT.OPERATION_FAILED"),
              html: this.errorService.arrayError(res.error.message),
              icon: 'error',
              showConfirmButton: true
            });
          }
        })
    }
    this.submitDisabled = false;
    this.cdr.markForCheck();
  }
  liseGuncelle() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.studentService
        .high_school_save(this.lyceeForm.value)
        .subscribe(res => {
          if (res.result) {
            Swal.fire({
              text: this.translate.instant("TEXT.UPDATE_SUCCESSFUL"),
              icon: 'success',
              showConfirmButton: false,
              timer: 2500
            });
            this.dialogRef.close({ 'liseGuncelle': res });
          } else {
            Swal.fire({
              text: this.translate.instant("TEXT.OPERATION_FAILED"),
              html: this.errorService.arrayError(res.error.message),
              icon: 'error',
              showConfirmButton: true
            });
          }
        });
    }
  }
  liseSil(id: number) {
    Swal.fire({
      title: this.translate.instant('TEXT.DELETE_WANT'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('TEXT.CANCEL'),
      confirmButtonText: this.translate.instant('TEXT.DELETE'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        let silinecekID = this.lyceeForm.get('id').value;
        this.studentService
          .high_school_delete(this.lyceeForm.value)
          .subscribe(rest => {
            if (rest.result) {
              Swal.fire({
                text: this.translate.instant("TEXT.DELETE_SUCCESSFUL"),
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
              });
              this.dialogRef.close({ 'liseSil': result, 'silinenID': silinecekID });
            } else {
              Swal.fire({
                text: this.translate.instant("TEXT.OPERATION_FAILED"),
                html: this.errorService.arrayError(rest.error.message),
                icon: 'error',
                showConfirmButton: true
              });
            }
          });
      }
    });
  }
  // Kayıt ve Güncelleme İşlemleri Bitiş
}
