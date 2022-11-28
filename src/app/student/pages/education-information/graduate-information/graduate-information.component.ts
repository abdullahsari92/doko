import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { StudentService } from '../../../services/student.service';
import { TranslateService } from '../../../../core/services/translate.service';
import { MatDialog } from '@angular/material/dialog';
import { GraduateAdditionalActionsComponent } from './graduate-additional-actions/graduate-additional-actions.component';
import { LocalStorageService } from '../../../../student/services/local-storage.service';
@Component({
  selector: 'kt-graduate-information',
  templateUrl: './graduate-information.component.html',
  styleUrls: ['./graduate-information.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GraduateInformationComponent implements OnInit {
  public dataState: boolean = true;
  graduateInfo = [];
  ulkeler: any[] = [];
  
  constructor(
    private studentService: StudentService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
		private localStorageService: LocalStorageService,
    private dialog:MatDialog
  ) { }
  ngOnInit(): void {
		this.getUlkeler();
    this.getListGraduate();
  }
  yuksekLisansModal(id?: number) {
    let data;
    if (id !== undefined) {
      data = this.graduateInfo.filter(key => key.id === id);
      if (data !== null) {
        data = data[0];
      }
    }
    let dialogRef = this.dialog.open(GraduateAdditionalActionsComponent, {
      width: '32%',
      maxHeight: '80vh',
      data: {
        id: id,
        yuksekLisansBilgisi: data,
        ulkeler: this.ulkeler
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.yuksekLisansEkle !== undefined && result.yuksekLisansEkle) {
          this.getListGraduate();
        } else if (result.yuksekLisansGuncelle !== undefined && result.yuksekLisansGuncelle) {
          this.getListGraduate();
        } else if (result.yuksekLisansSil !== undefined && result.yuksekLisansSil) {
          this.getListGraduate();
          document.getElementById(result.silinenID).remove();
        }
      }
    });
  }
  getListGraduate() {
    this.studentService
      .graduate_get_list()
      .pipe(
        tap(rest => {
          if (rest.result) {
            this.dataState = true;
            this.graduateInfo = rest.data;
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
