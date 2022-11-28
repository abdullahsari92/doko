import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fieldValidations } from '../../../../../core/Enums/fieldValidations';
import { keyValue } from '../../../../../core/models/keyValue';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';
import { StudentService } from '../../../../services/student.service';
import { TranslateService } from '../../../../../core/services/translate.service';
import { ErrorService } from '../../../../services/error.service';
import { LicenceInformationComponent } from '../licence-information.component';
import Swal from 'sweetalert2';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'kt-licence-additional-actions',
  templateUrl: './licence-additional-actions.component.html',
  styleUrls: ['./licence-additional-actions.component.scss']
})
export class LicenceAdditionalActionsComponent implements OnInit {
  public errorState: boolean = false;
  public btnAdi: string = 'SAVE';
  submitDisabled: boolean = false;
  islem: boolean = false;
  licenceForm: FormGroup;
  validations = fieldValidations;
  ulkeKodlari: keyValue[] = []
  constructor(
    private studentService: StudentService,
    public dokoSettingsService: DokoSettingsService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private errorService: ErrorService,
    public dialogRef: MatDialogRef<LicenceInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    this.islem = false;
    this.initForm();
    console.log('data', this.data);
    if(this.data.ulkeler){
      this.ulkeKodlari = this.data.ulkeler;
    }
    if (this.data.id !== undefined && this.data.lisansBilgisi !== undefined) {
      this.licenceForm.addControl('id', new FormControl('', Validators.required));
      this.btnAdi = "UPDATE";
      Object.keys(this.licenceForm.controls).forEach((key) => {
        this.licenceForm.get(key).setValue(this.data.lisansBilgisi[key]);
      });
    } else {
      this.islem = true;
    }
  }
  initForm() {
    this.licenceForm = new FormGroup({
      universite_adi: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.metin)
      ]),
      bolum: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.metin)
      ]),
      program: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.metin)
      ]),
      egitim_suresi: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.sayi2)
      ]),
      mezuniyet_yili: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.yil)
      ]),
      ortalama_dortluk: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.dortlukNot)
      ]),
      ortalama_yuzluk: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.yuzlukNot)
      ]),
      sehir: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.metin)
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
    let result = this.errorService.errorControl(input, this.licenceForm);
    if (input === '*') {
      this.errorState = result;
    } else {
      return result;
    }
  }
  // Kayıt ve Güncelleme İşlemleri Başlangıç
  lisansEkle() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.submitDisabled = true;
      this.studentService
        .saveLicence(this.licenceForm.value)
        .subscribe(res => {
          if (res.result) {
            Swal.fire({
              text: this.translate.instant('TEXT.SAVE_SUCCESSFUL'),
              icon: 'success',
              showConfirmButton: false,
              timer: 2500
            });
            this.dialogRef.close({ 'lisansEkle': res });
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
  lisansGuncelle() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.studentService
        .saveLicence(this.licenceForm.value)
        .subscribe(res => {
          if (res.result) {
            Swal.fire({
              text: this.translate.instant("TEXT.UPDATE_SUCCESSFUL"),
              icon: 'success',
              showConfirmButton: false,
              timer: 2500
            });
            this.dialogRef.close({ 'lisansGuncelle': res });
          } else {
            Swal.fire({
              text: this.translate.instant("TEXT.OPERATION_FAILED"),
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
    }
  }
  lisansSil(id: number) {
    Swal.fire({
      title: this.translate.instant('TEXT.DELETE_WANT'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('TEXT.CANCEL'),
      confirmButtonText: this.translate.instant('TEXT.DELETE'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        let silinecekID = this.licenceForm.get('id').value;
        this.studentService
          .deleteLicence(this.licenceForm.value)
          .subscribe(rest => {
            if (rest.result) {
              Swal.fire({
                text: this.translate.instant("TEXT.DELETE_SUCCESSFUL"),
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
              });
              this.dialogRef.close({ 'lisansSil': result, 'silinenID': silinecekID });
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
    })

  }
  // Kayıt ve Güncelleme İşlemleri Bitiş
}
