import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { BasvuruTurEnum } from '../../../core/Enums/BasvuruTurEnum';
import { StudentService } from '../../services/student.service';
import { finalize, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'kt-education-information',
	templateUrl: './education-information.component.html',
	styleUrls: [
		//'./education-information.component.scss',
	]
})
export class EducationInformationComponent implements OnInit {

	public aktifIslemler: any[] = [];
	public selectedTab: number = 1;
	public routerBasvuruID: number;
	public basvuruTurEnum = BasvuruTurEnum;

	constructor(
		private localStorageService: LocalStorageService,
		private studentService: StudentService,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private router: Router
	) { }
	ngOnInit() {
		this.getBirimIslemListesi();
		this.route.params.subscribe(params => {
			if (Object.keys(params).length > 0) {
				this.selectedTab = params['id'];
				this.routerBasvuruID = params['basvuruID'];
			}
		});
	}
	changeTab(tab: number) {
		this.selectedTab = tab;
	}
	getBirimIslemListesi() {
		let yonlendirme = true;
		let islemler = this.localStorageService.getUnitReferenceModule();
		Object.keys(islemler).forEach((value) => {
			if (islemler[value]) {
				this.aktifIslemler.push(value);

				if (value == this.basvuruTurEnum.lisans || value == this.basvuruTurEnum.yuksekLisans || value == this.basvuruTurEnum.doktora) {
					yonlendirme = false;
				}
			}
		});

		if (yonlendirme) {
			this.router.navigateByUrl('/homepage');
		}
		this.cdr.markForCheck();

		/* if (value != this.basvuruTurEnum.lisans && value != this.basvuruTurEnum.yuksekLisans && value != this.basvuruTurEnum.doktora) {
			this.router.navigateByUrl('/homepage');
		} */
	}
	aktifEgitimDereceleri(islem): any {
		let durum = (this.aktifIslemler).filter(y => y == islem);
		return durum.length > 0 ? true : false;
	}
}
