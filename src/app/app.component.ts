import { Subject, Subscription } from 'rxjs';
// Angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// Layout
import { SplashScreenService } from './core/_base/layout';



import { WelcomeService } from './views/services/welcome.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { PublicMethodService } from './views/services/public-method.service';
import { apiSetting } from './core/models/apiSetting';
@Component({
	// tslint:disable-next-line:component-selector
	selector: 'body[kt-root]',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
	// Public properties
	title = 'Metronic';
	loader: boolean;
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	private unsubscribeLungages: Subject<any>;
	apisetting:apiSetting=new apiSetting();

	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * @param router: Router
	 * @param layoutConfigService: LayoutCongifService
	 * @param splashScreenService: SplashScreenService
	 */
	constructor(//private translationService: TranslationService,
		private router: Router,
		private splashScreenService: SplashScreenService,
		private welcomeService: WelcomeService,
		private localStorageService: LocalStorageService,
		private cdf:ChangeDetectorRef,
	) {
		this.apisetting = this.localStorageService.getItem("apiSetting") as apiSetting;
		this.unsubscribeLungages = new Subject();
	}

	ngOnInit(): void {

		this.loader = true;
		new Promise((resolve, reject) => {
		const routerSubscription = this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.splashScreenService.hide();
		  this.apisetting = this.localStorageService.getItem("apiSetting") as apiSetting;

		  this.getApiSetting().then(()=>{

			this.setLocalStorageLanguages().then(()=>{			
					resolve(true);
				this.cdf.markForCheck();
			});
			this.getCountry();			
		  });
		  document.body.classList.add('kt-page--loaded');
				window.scrollTo(0, 0);			
			}
		});
	}).then(() => {
		this.loader = false;
		this.cdf.markForCheck();
	});

	}	

	getApiSetting() {

		
		return new Promise((resolve, reject) => {
		
				this.welcomeService.getApiSetting().pipe(tap(res=>{
					this.localStorageService.setItem('apiSetting', res);
					this.apisetting = this.localStorageService.getItem("apiSetting") as apiSetting;

				}),finalize(()=>{	
					resolve(true);				
				})).subscribe();
		})		

	}	
	
	setLocalStorageLanguages() {	
		return new Promise((resolve, reject) => {
		if (this.isLanguagesVersionChange() || (this.localStorageService.getItem('languagesDefitions') === null)) {
			this.welcomeService
				.getlanguages()
				.pipe(
					tap(res => {
						if (res.result) {	

							this.localStorageService.setItem("languagesDefitions", res.data);
							this.localStorageService.setItem("langVersion", this.apisetting.setting.langVersion); //dilin version güncelleniyor.

							if (!this.localStorageService.getItem("language")) {						
								this.localStorageService.setItem("language", "tr");
							}
						}
					}), takeUntil(this.unsubscribeLungages), finalize(() => {
						this.cdf.markForCheck();
					})).subscribe()
		}
	})		
	}

	getCountry()
	{

		if(!this.localStorageService.getItem("countryList"))
		{
			this.welcomeService.getCountry().subscribe(data => {
				this.localStorageService.setItem('countryList', data);
			}, error => {
			});
		}		
	}

	isLanguagesVersionChange(): boolean {
				var currentLanguages = this.localStorageService.getItem("langVersion");
		var databaseLangVersion = this.apisetting?.setting.langVersion;

		if (!databaseLangVersion) {
			databaseLangVersion = "0"
		}
		return currentLanguages !== databaseLangVersion;
	}

	setLocalStorageLanguagesESKI(resolve:any) {	

		if (this.isLanguagesVersionChange() || (this.localStorageService.getItem('languagesDefitions') === null)) {
			this.welcomeService
				.getlanguages()
				.pipe(
					tap(res => {
						if (res.result) {						

							this.localStorageService.setItem("languagesDefitions", res.data);
							this.localStorageService.setItem("currentLanguagesVersion", this.localStorageService.getItem("databaseLanguageVersion")); //dilin version güncelleniyor.

							if (this.localStorageService.getItem("language")) {
								this.localStorageService.setItem("language", this.localStorageService.getItem("language"));
							} else {
								this.localStorageService.setItem("language", "tr");
							}

							resolve(true);
						}
					}), takeUntil(this.unsubscribeLungages), finalize(() => {
						this.cdf.markForCheck();
					})).subscribe()

		}
	}

	isLanguagesVersionChangeESKI(): boolean {
		var currentLanguages = this.localStorageService.getItem("currentLanguagesVersion");
		var databaseLangVersion = this.localStorageService.getItem("databaseLanguageVersion");

		if (!databaseLangVersion) {
			this.localStorageService.setItem("databaseLanguageVersion", 1);
			databaseLangVersion = this.localStorageService.getItem("databaseLanguageVersion");
		}
		return currentLanguages !== databaseLangVersion;
	}

	
	ngOnDestroy() {
		this.unsubscribe.forEach(sb => sb.unsubscribe());

		this.unsubscribeLungages.next();
		this.unsubscribeLungages.unsubscribe();
	}
}
