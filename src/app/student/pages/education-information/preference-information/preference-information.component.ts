import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { ErrorService } from '../../../services/error.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StudentService } from '../../../services/student.service';
import { TranslateService } from '../../../../core/services/translate.service';
import { DokoSettingsService } from '../../../../core/services/doko-settings.service';
import { ChangeDetectorRef, Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PreferenceAdditionalActionsComponent } from './preference-additional-actions/preference-additional-actions.component';

@Component({
  selector: 'kt-preference-information',
  templateUrl: './preference-information.component.html',
  styleUrls: ['./preference-information.component.scss']
})

export class PreferenceInformationComponent implements OnInit {

  //Input Başlangıç
  @Input() basvuruID = new EventEmitter<number>();
  @Input() ogrenciBasvuruID = new EventEmitter<number>();
  //Input Bitiş


  //Output Başlangıç
  @Output() tercihDurumu = new EventEmitter<boolean>();
  //Output Bitiş

  //Diziler Başlangıç
  tercihFakulteleri: any[] = [];
  tercihBolumleri: any[] = [];
  rowDataBolumler: any[] = [];
  tercihListesi: any[] = [];
  tercihPuanBilgisi: any[] = [];
  rowDatatercihListesi: any[] = [];
  puanTurleri: any[] = [];
  //Diziler Bitiş

  //Tanımlar Başlangıç
  basvuru_id: any = null;
  ogrenci_basvuru_id: any = null;
  preference_info: boolean = false;
  //Tanımlar Bitiş

  //Enum Durumlar Başlangıç
  //Enum Durumlar Bitiş

  //Formlar Başlangıç
  public form!: FormGroup;
  public formControl!: FormControl;
  //Formlar Bitiş

  //AgGrid Başlangıç
  //AgGrid Bitiş

  constructor(
    private studentService: StudentService,
    private dokoSettingsService: DokoSettingsService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private errorService: ErrorService,
    private dialog: MatDialog,
    private controlContainer: ControlContainer
  ) { }

  ngOnInit(): void {
    //console.log('this.ogrenciBasvuruID', this.ogrenciBasvuruID);
    if (typeof (this.basvuruID) == 'number' && this.basvuruID !== null) {
      this.basvuru_id = this.basvuruID;
    }
    if (typeof (this.ogrenciBasvuruID) == 'number' && this.ogrenciBasvuruID !== null) {
      this.ogrenci_basvuru_id = this.ogrenciBasvuruID;
    }

    if (this.basvuru_id && this.ogrenci_basvuru_id) {
      this.preference_info_get();
      this.getPuanTurleri();
    }

    this.getFakulteListesi();
    this.cdr.detectChanges();
  }
  getPuanTurleri() {
    this.studentService
      .score_type_get_list(2).pipe(tap(res => {
        console.log('puanTurleri', res);
        if (res.result) {
          this.puanTurleri = res.data;
        }
      }), finalize(() => {

      })).subscribe();
  }
  getFakulteListesi() {
    this.studentService
      .preference_faculty_list(this.basvuru_id).pipe(tap(res => {
        if (res.result) {
          this.tercihFakulteleri = res.data;
        }
      }), finalize(() => {
        this.getBolumListesi();
      })).subscribe()
  }
  getBolumListesi() {
    this.studentService
      .preference_episode_list(this.basvuru_id).pipe(tap(res => {
        if (res.result) {
          this.tercihBolumleri = res.data;
        }
      }), finalize(() => {
        this.preference_info_get();

        this.cdr.markForCheck();
      }))
      .subscribe();
  }
  tercihModal() {
    let dialogRef = this.dialog.open(PreferenceAdditionalActionsComponent, {
      width: '32%',
      maxHeight: '80vh',
      data: {
        basvuruID: this.basvuru_id,
        tercihIslemi: 0,
        ogrenciBasvuruID: this.ogrenci_basvuru_id,
        puanTurBilgisi: this.puanTurleri,
        tercihPuanBilgisi: this.tercihPuanBilgisi,
        tercihBilgisi: this.tercihListesi,
        fakulteler: this.tercihFakulteleri,
        bolumler: this.tercihBolumleri
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('dialog kapanır', result);
      if (result !== undefined) {
        if (result.tercihEkle !== undefined && result.tercihEkle) {
          /* this.preference_info= true;
          this.tercihListesi = result.tercihListesi; */
          this.preference_info_get();
        } else if (result.tercihSil !== undefined && result.tercihSil) {
          this.preference_info_get();
        }
      }
      console.log('dialog kapanır preference_info', this.preference_info);
      //console.log('dialog kapanır tercihListesi', this.tercihListesi);
      this.cdr.detectChanges();
    });
  }
  tercihSil() {
    Swal.fire({
      title: this.translate.instant('TEXT.DELETE_WANT'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('TEXT.CANCEL'),
      confirmButtonText: this.translate.instant('TEXT.DELETE'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService
          .preference_delete(this.basvuru_id, this.ogrenci_basvuru_id)
          .pipe(
            tap(rest => {
              if (rest.result) {
                Swal.fire({
                  text: this.translate.instant("TEXT.DELETE_SUCCESSFUL"),
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3000
                });
              } else {
                Swal.fire({
                  text: this.translate.instant("TEXT.OPERATION_FAILED"),
                  html: this.errorService.arrayError(rest.error.message),
                  icon: 'error',
                  showConfirmButton: true
                });
              }
            }),
            finalize(() => {
              this.preference_info_get();
              this.cdr.markForCheck();
            })
          )
          .subscribe();
      }
    });
  }
  preference_info_get() {
    this.tercihListesi = [];
    this.tercihPuanBilgisi = [];
    let promise = new Promise((resolve, reject) => {
      this.studentService
        .preference_info_get(this.basvuru_id, this.ogrenci_basvuru_id)
        .pipe(
          tap(
            res => {
              console.log(' preference_info_get', res);
              if (res.result) {
                this.tercihListesi = res.data.tercih;

                console.log('tercihListesi-------', this.tercihListesi);
                
                this.tercihPuanBilgisi = res.data.puan;
                this.preference_info = true;
                this.tercihDurumu.emit(true);
              } else {
                this.tercihListesi = [];
                this.preference_info = false;
                this.tercihDurumu.emit(false);
              }
            }), finalize(() => {
              this.cdr.markForCheck();
              setTimeout(() => {
                resolve(true);
              }, 100);
            })).subscribe();

      console.log('tercihListesi', this.tercihListesi);
      console.log('tercihPuanBilgisi', this.tercihPuanBilgisi);
    });
    //console.log('bilgiler', this.tercihListesi);
  }

}
