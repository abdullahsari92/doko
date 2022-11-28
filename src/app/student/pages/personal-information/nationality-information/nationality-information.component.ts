import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DokoSettingsService } from '../../../../core/services/doko-settings.service';
import { StudentService } from '../../../../student/services/student.service';
import { ErrorService } from '../../../services/error.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdditionalActionsComponent } from '../additional-actions/additional-actions.component';
import { finalize, tap } from 'rxjs/operators';
import { TranslateService } from '../../../../core/services/translate.service';
import { fieldValidations } from '../../../../core/Enums/fieldValidations';

@Component({
  selector: 'kt-nationality-information',
  templateUrl: './nationality-information.component.html',
  styleUrls: [
    './nationality-information.component.scss',
  ]
})
export class NationalityInformationComponent implements OnInit {
  //Tanımlar Başlangıç
  ulke1: boolean = false;
  ulke2: boolean = false;
  pasaportDurum: boolean = false;
  //Tanımlar Bitiş

  //Diziler Başlangıç
  ulkeler: any[] = [];
  uyrukSebebi: any[] = [];
  seciliUlke: any[] = [];
  seciliUlke2: any[] = [];
  //Diziler Bitiş

  //Bağlı Durumlar Başlangıç
  submitDisabled: boolean = false;
  saveType: string = 'save';
  uyruk2Data: boolean = false;
  maviKart: boolean = false;
  formGuncelleme: boolean = false;
  errorState: boolean = false;
  //Bağlı Durumlar Bitiş

  //Enum Durumlar Başlangıç
  validations = fieldValidations;
  //Enum Durumlar Bitiş

  //Formlar Başlangıç
  nationalityForm: FormGroup;
  //Formlar Bitiş

  constructor(
    private translate: TranslateService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
    private errorService: ErrorService,
    private router: Router,
    public dokoSettingsService: DokoSettingsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUyrukSebepleri();
    this.getUlkeler();
    this.formInit();
    //this.editModal();
  }

  formInit() {
    this.nationalityForm = new FormGroup({
      pasaport_no: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.pasaport)
      ]),
      pasaport_dosya: new FormControl('', [
        Validators.required
      ]),
      uyruk_kodu: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.kod10)
      ]),
      uyruk_sebebi_id: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.sayisalKod1)
      ]),
      pasaport2_no: new FormControl(''),
      pasaport2_dosya: new FormControl(''),
      uyruk2_kodu: new FormControl(''),
      uyruk2_sebebi_id: new FormControl(''),
      mavi_kart_durumu: new FormControl('0'),
      mavi_kart_belge: new FormControl('')
    });

    this.getNationality();
  }
  getUyrukSebepleri() {
    this.studentService
      .nationality_reasons_get_list()
      .pipe(
        tap(res => {
          if (res.result) {
            this.uyrukSebebi = res.data;
          }
        }),
        finalize(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }
  getUlkeler() {
    this.studentService
      .countryInfo()
      .pipe(
        tap(res => {
          console.log("Ülkeler", res);
          if (res.result) {
            this.ulkeler = res.data;
          }
        }),
        finalize(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  getNationality() {
    this.studentService
      .nationality_info_get(this.nationalityForm.value)
      .pipe(
        tap(res => {
          console.log("getNationality", res);
          if (res.result) {
            this.saveType = "update";
            this.nationalityForm.addControl('id', new FormControl('', Validators.required));

            //İkinci Uyruk Durumları Başlangıç
            if (res.data['pasaport2_no'] !== null && res.data['pasaport2_dosya'] !== null && res.data['uyruk2_kodu'] !== null && res.data['uyruk2_sebebi_id'] !== null) {
              this.uyruk2Data = true;
              this.nationalityForm.controls["pasaport2_no"].setValidators([
                Validators.required,
                Validators.pattern(this.validations.pasaport)
              ]);
              this.nationalityForm.controls["pasaport2_dosya"].setValidators([
                Validators.required
              ]);
              this.nationalityForm.controls["uyruk2_kodu"].setValidators([
                Validators.required,
                Validators.pattern(this.validations.kod10)
              ]);
              this.nationalityForm.controls["uyruk2_sebebi_id"].setValidators([
                Validators.required,
                Validators.pattern(this.validations.sayisalKod1)
              ]);

              if (this.nationalityForm.get('uyruk2_kodu')) {
                this.ulke2 = true;
                this.seciliUlke2 = this.ulkeler.filter(x => x.kodu == this.nationalityForm.get('uyruk2_kodu').value)[0];
              }
            } else {
              this.uyruk2Data = false;
            }
            //İkinci Uyruk Durumları Bitiş

            //Mavi Kart Durumları Başlangıç
            if (res.data['mavi_kart_belge'] !== null && res.data['mavi_kart_belge'] !== "" && res.data['mavi_kart_durumu'] !== 0) {
              this.maviKart = true;
              this.nationalityForm.controls["mavi_kart_belge"].setValidators([
                Validators.required
              ]);
            } else {
              this.maviKart = false;
            }
            //Mavi Kart Durumları Bitiş

            Object.keys(this.nationalityForm.controls).forEach((key) => {
              this.nationalityForm.get(key).setValue(res.data[key]);
            });
            if (res.data["pasaport_no"] != null && res.data["pasaport_no"] != '') {
              this.pasaportDurum = true;
            }

            if (this.nationalityForm.get('uyruk_kodu').value) {
              console.log('değer var');
              this.ulke1 = true;
              this.seciliUlke = this.ulkeler.filter(x => x.kodu == this.nationalityForm.get('uyruk_kodu').value)[0];
            }

            if (this.nationalityForm.get('uyruk2_kodu').value) {
              this.ulke2 = true;
              this.seciliUlke2 = this.ulkeler.filter(x => x.kodu == this.nationalityForm.get('uyruk2_kodu').value)[0];
            }

            console.log('seciliUlke', this.seciliUlke);
            //console.log('Formun Son hali', this.nationalityForm);

          } else {
            this.saveType = "save";
          }
        }),
        finalize(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }
  editModal(processParam: number): void {
    const dialogRef = this.dialog.open(AdditionalActionsComponent, {
      width: '32%',
      data: {
        process: processParam,
        form: this.nationalityForm,
        uyrukSebebi: this.uyrukSebebi,
        ulkeler: this.ulkeler
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.maviKart) {
          this.maviKart = true;
          this.nationalityForm.get('mavi_kart_durumu').setValue('1');
        } else {
          this.uyruk2Data = true;
        }
        this.cdr.markForCheck();
      } else {
        if (processParam === 1) {
          this.degerSil('maviKart', 'temizleme');
        } else {
          this.degerSil('uyruk2', 'temizleme');
        }
      }
    });
  }
  errorControl(input: string): any {
    let result = this.errorService.errorControl(input, this.nationalityForm);
    if (input === '*') {
      this.errorState = result;
    } else {
      return result;
    }
  }
  degerSil(params: string, type?: string) {
    if (type !== undefined) {
      this.formTemizleme(params);
    } else {
      Swal.fire({
        title: this.translate.instant('TEXT.DELETE_WANT'),
        showCancelButton: true,
        cancelButtonText: this.translate.instant('TEXT.CANCEL'),
        confirmButtonText: this.translate.instant('TEXT.DELETE'),
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.formTemizleme(params);
          this.formGuncelleme = true;
          this.cdr.markForCheck();
        }
      })
    }
  }
  formTemizleme(params: string) {
    if (params === 'uyruk2') {
      this.nationalityForm.get('pasaport2_no').setValue('');
      this.nationalityForm.get('pasaport2_dosya').setValue('');
      this.nationalityForm.get('uyruk2_kodu').setValue('');
      this.nationalityForm.get('uyruk2_sebebi_id').setValue('');

      this.nationalityForm.get('pasaport2_no').clearValidators();
      this.nationalityForm.get('pasaport2_dosya').clearValidators();
      this.nationalityForm.get('uyruk2_kodu').clearValidators();
      this.nationalityForm.get('uyruk2_sebebi_id').clearValidators();
      this.uyruk2Data = false;
    } else {
      this.nationalityForm.get('mavi_kart_belge').setValue('');
      this.nationalityForm.get('mavi_kart_belge').clearValidators();
      this.nationalityForm.get('mavi_kart_durumu').setValue('0');
      this.nationalityForm.get('mavi_kart_durumu').clearValidators();
      this.maviKart = false;
    }
    Object.keys(this.nationalityForm.controls).forEach((key) => {
      this.nationalityForm.get(key).updateValueAndValidity();
    });
  }
  save() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.submitDisabled = true;
      this.studentService
        .nationality_info_save(this.nationalityForm.value)
        .subscribe(res => {
          if (res.result) {
            this.pasaportDurum= true;
            this.getRouterSwal();
            this.cdr.markForCheck();
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
  }
  update() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.studentService
        .nationality_info_save(this.nationalityForm.value)
        .subscribe(res => {
          if (res.result) {
            this.pasaportDurum= true;
            this.getRouterSwal();
            this.cdr.markForCheck();
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
  getRouterSwal() {
    if (this.nationalityForm.get('uyruk_kodu').value) {
      this.ulke1 = true;
      this.seciliUlke = this.ulkeler.filter(x => x.kodu == this.nationalityForm.get('uyruk_kodu').value)[0];
    }

    if (this.nationalityForm.get('uyruk2_kodu').value) {
      this.ulke2 = true;
      this.seciliUlke2 = this.ulkeler.filter(x => x.kodu == this.nationalityForm.get('uyruk2_kodu').value)[0];
    }

    this.cdr.markForCheck();
    Swal.fire({
      title: this.translate.instant("TEXT.PROCESS_CONTINUE"),
      text: this.translate.instant("TEXT.BACK_TO_ACTION"),
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant("TEXT.DASHBOARD"),
      cancelButtonText: this.translate.instant("TEXT.CANCEL"),
      allowOutsideClick: false,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('/homepage');
      }
    });
  }

  /* update() {
    if (this.personalInfoForm.valid) {
      var personelModel = this.personalInfoForm.value;
      personelModel = this.dataFormat(personelModel);
      this.studentService
        .personalUpdate(personelModel)
        .subscribe(res => {
          if (res.result) {
            Swal.fire({
              title: this.translate.instant("TEXT.PROCESS_CONTINUE"),
              text: this.translate.instant("TEXT.BACK_TO_ACTION"),
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: this.translate.instant("TEXT.DASHBOARD"),
              cancelButtonText: this.translate.instant("TEXT.CANCEL"),
              allowOutsideClick: false,
              showConfirmButton: true,
              }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/homepage');
              }
              })
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
  } */


}