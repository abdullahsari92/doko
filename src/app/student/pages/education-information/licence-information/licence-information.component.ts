import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '../../../../core/services/translate.service';
import { finalize, tap } from 'rxjs/operators';
import { StudentService } from '../../../services/student.service';
import { MatDialog } from '@angular/material/dialog';
import { LicenceAdditionalActionsComponent } from './licence-additional-actions/licence-additional-actions.component';
import { LocalStorageService } from '../../../../student/services/local-storage.service';

@Component({
  selector: 'kt-licence-information',
  templateUrl: './licence-information.component.html',
  styleUrls: ['./licence-information.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LicenceInformationComponent implements OnInit {
  public dataState: boolean = true;
  licenceInfo = [];
  ulkeler: any[] = [];

  constructor(
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
		private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
		this.getUlkeler();
    this.getListLicence();
  }
  lisansModal(id?: number) {
    let data;
    if (id !== undefined) {
      data = this.licenceInfo.filter(key => key.id === id);
      if (data !== null) {
        data = data[0];
      }
    }
    let dialogRef = this.dialog.open(LicenceAdditionalActionsComponent, {
      width: '32%',
      maxHeight: '80vh',
      data: {
        id: id,
        lisansBilgisi: data,
        ulkeler: this.ulkeler
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.lisansEkle !== undefined && result.lisansEkle) {
          this.getListLicence();
        } else if (result.lisansGuncelle !== undefined && result.lisansGuncelle) {
          this.getListLicence();
        } else if (result.lisansSil !== undefined && result.lisansSil) {
          this.getListLicence();
          document.getElementById(result.silinenID).remove();
        }
      }
    })
  }
  getListLicence() {
    this.studentService
      .getListLicence()
      .pipe(
        tap(rest => {
          if (rest.result) {
            this.dataState = true;
            this.licenceInfo = rest.data;
          } else {
            this.dataState = false;
          }
        }),
        finalize(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }
	getUlkeler() {
		if (this.localStorageService.getCountryList()) {
			this.ulkeler = this.localStorageService.getCountryList();
		}
	}
	getUlkeAdi(kod: string) {
		if (this.ulkeler.length > 0) {
			return this.ulkeler.filter(x => x.kodu == kod)[0];
		}
		return false;
	}

}
