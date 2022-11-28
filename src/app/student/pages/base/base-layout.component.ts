import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '../../../core/services/translate.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SdataModel } from '../../models/sdata.model';
import { Router } from '@angular/router';
import { langService } from '../../services/lang.service';
import { StudentService } from '../../services/student.service';
import { SharedService } from '../../services/shared.service';
import { apiSetting } from '../../../../../src/app/core/models/apiSetting';
import { Subject, Subscription } from 'rxjs';

@Component({
	selector: 'kt-base-controller',
	templateUrl: './base-layout.component.html',
	styleUrls: [
		'./base-layout.component.scss',
	]
})
export class BaseLayoutComponent implements OnInit {
	public userData = new SdataModel().user;
	public language = [];
	public selectedLang: any;
	public menuBarActive: boolean = false;
	private clickEventsubscription: Subscription;
	apiSetting: apiSetting = new apiSetting();

	constructor(
		private sharedService: SharedService,
		private translate: TranslateService,
		private localStorage: LocalStorageService,
		private cdr: ChangeDetectorRef,
		private router: Router,
		private langServicee: langService,
		private baseContService: StudentService
	) {
		/*this.baseContService.studentGeneralData()
			.subscribe(data => {
				console.log('Base-controller', data);
			});*/

		if (this.localStorage.getItem('student_data'))
			this.userData = this.localStorage.getItem('student_data').data.user;
		//	this.language = this.langServicee.getLang();
		//	this.changeLang();
		this.cdr.markForCheck();
	}
	ngOnInit(): void {
		this.apiSetting = this.localStorage.getItem("apiSetting") as apiSetting;
		this.clickEventsubscription = this.sharedService.selectedProduct.subscribe((value) => {
			if (value == 97) {
				this.menuBarActive = false;
			}
		});
	}
	changeLang(code?: string) {
		this.selectedLang = this.langServicee.changeLang(code);
		if (this.selectedLang) {
			this.langServicee.changeLangLocal(this.selectedLang.kod);

			this.router.navigateByUrl('/homepage');
		}
	}
	sekmeSec() {
		this.sharedService.sendClickEvent(99);// Başvuru türü 4 tane şu anda. Anasayfa 99 olarak rastgele belirlendi.
		this.menuBarActive = false;
	}
	menuBar() {
		if (this.menuBarActive) {
			this.menuBarActive = false;
		} else {
			this.menuBarActive = true;
		}
		this.sharedService.sendClickEvent(98);
	}
}
