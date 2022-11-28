import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SinavMerkez } from '../../../../views/models/SinavMerkez';
import { BasvuruService } from '../../../../views/services/basvuru.service';
import { SinavMerkezAddComponent } from './sinav-merkez-add/sinav-merkez-add.component';
import { TranslateService } from '../../../../core/services/translate.service';
import { DeleteEntityDialogComponent } from '../../../../views/partials/content/crud';
import { AgGridAngular } from 'ag-grid-angular';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { fromEvent, interval, Subject } from 'rxjs';

@Component({
	selector: 'kt-sinav-merkez',
	templateUrl: './sinav-merkez.component.html',
	styleUrls: ['./sinav-merkez.component.scss']
})
export class SinavMerkezComponent implements OnInit, OnDestroy {

	sinavMerkezSalon: SinavMerkez = new SinavMerkez();
	loader: boolean = true;
	basvuruId: number;
	activeClass: string = "current";
	rowData: any;
	agGrid: AgGridAngular;
	sinavMerkezleri: SinavMerkez[] = [];
	private unsubscribe: Subject<any>;

	@ViewChild('wizard', { static: true }) el: ElementRef;

	submitted = false;

	constructor(private basvuruService: BasvuruService,
		private cdr: ChangeDetectorRef,
		private dialog: MatDialog,
		private activatRoute: ActivatedRoute,
		private translate: TranslateService,
		private router: Router) {
		this.basvuruId = parseInt(this.router.getCurrentNavigation().extras.state.toString());
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.getSinavMerkez();
	}

	goBackWithoutId() {
		this.router.navigate(['../sinav-basvuru'], { relativeTo: this.activatRoute });
	}

	ngAfterViewInit(): void {
		const wizard = new KTWizard(this.el.nativeElement, {
			startStep: 1
		});
		wizard.on('beforeNext', (wizardObj) => {
		});
		wizard.on('change', () => {
			setTimeout(() => {
				KTUtil.scrollTop();
			}, 500);
		});
	}

	onSubmit() {
		this.submitted = true;
	}

	getSinavSalonList(merkezId) {
		this.basvuruService.getSinavSalonList(merkezId).pipe(tap(res => {
			if (res.result) {
				this.rowData = res.data;
			}
		}), takeUntil(this.unsubscribe), finalize(() => {
			this.sinavMerkezleri[0].currentItem = "current";
			this.cdr.markForCheck();
		})).subscribe()
	}

	editModal(data) {
		data.basvuru_id = this.basvuruId;
		const dialogRef = this.dialog.open(SinavMerkezAddComponent, { data });
	
		dialogRef.afterClosed().pipe(tap(refData => {
			if (!refData) {
			  return;
			}
			this.getSinavMerkez();
		  }),takeUntil(this.unsubscribe)).subscribe();  

	
	}


	deleteModal(data) {
		data.basvuru_id = this.basvuruId;
		var description = this.translate.instant('TEXT.DELETE_WANT');
		var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');

		const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
			width: '440px',
		});

		dialogRef.afterClosed().pipe(tap(refData => {
			if (!refData) {
			  return;
			}
			this.basvuruService.getSinavMerkezDelete(data.id).subscribe(res => {
				if (res.result) {
					this.getSinavMerkez();
				}
			});
		  }),takeUntil(this.unsubscribe)).subscribe();  

	

	}

	getSalonlar(sinavMerkez) {
		this.sinavMerkezSalon = sinavMerkez;
		const wizard = new KTWizard(this.el.nativeElement, {
			startStep: 3
		});
		this.loader = true;
		this.activeClass = "current";
		var promise = new Promise((resolve, reject) => {
			this.getSinavSalonList(sinavMerkez.id);
			setTimeout(() => {
				resolve(true);
			}, 100);
		}).then(() => {
			console.log('satır164-rowdataThen ', this.rowData)
			this.cdr.markForCheck();

			this.loader = false;
		});
	}

	actifLink(item, index) {
		if (item.id == this.sinavMerkezSalon.id) {
			return "currentItem";
		}
		return "";
	}

	getSinavMerkez() {
		this.basvuruService.getSinavMerkezList(this.basvuruId).pipe(tap(res => {
			if (res.result) {
				this.sinavMerkezleri = res.data;
			}
		}), takeUntil(this.unsubscribe), finalize(() => {
			this.sinavMerkezleri[0].currentItem = "current";
			this.getSalonlar(this.sinavMerkezleri[0])
			console.log('finalize sinavMerkezleri  ', this.sinavMerkezleri)
			this.cdr.markForCheck();
		})).subscribe()
	}

	// getDeneme() {
	// 	const source = interval(1000);
	// 	const clicks = fromEvent(document, 'click');
	// 	const result = source.pipe(takeUntil(clicks));
	// 	result.subscribe(x => console.log(x));
	// }

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

}
