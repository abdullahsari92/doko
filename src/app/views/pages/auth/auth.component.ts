// Angular
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
// Layout
import { LayoutConfigService, SplashScreenService, TranslationService } from '../../../core/_base/layout';
// Auth
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { apiSetting } from '../../../core/models/apiSetting';
import { WelcomeService } from '../../services/welcome.service';

@Component({
	selector: 'kt-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
	// Public properties
	today: number = Date.now();
	headerLogo: string;
	apiSetting:apiSetting = new apiSetting();

	/**
	 * Component constructor
	 *
	 * @param el
	 * @param render
	 * @param layoutConfigService: LayoutConfigService
	 * @param authNoticeService: authNoticeService
	 * @param translationService: TranslationService
	 * @param splashScreenService: SplashScreenService
	 */
	constructor(
		private el: ElementRef,
		private render: Renderer2,
		private layoutConfigService: LayoutConfigService,
		private translationService: TranslationService,
		private splashScreenService: SplashScreenService,
		private localStorageService:LocalStorageService,
		private cdr: ChangeDetectorRef,
		private welcomeService: WelcomeService,


		) {
		//this.getApiSetting();

	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.translationService.setLanguage(this.translationService.getSelectedLanguage());
		this.headerLogo = this.layoutConfigService.getLogo();

		this.splashScreenService.hide();
		this.getApiSetting();
	}

	/**
	 * Load CSS for this specific page only, and destroy when navigate away
	 * @param styleUrl
	 */
	private loadCSS(styleUrl: string) {
		return new Promise((resolve, reject) => {
			const styleElement = document.createElement('link');
			styleElement.href = styleUrl;
			styleElement.type = 'text/css';
			styleElement.rel = 'stylesheet';
			styleElement.onload = resolve;
			this.render.appendChild(this.el.nativeElement, styleElement);
		});
	}

	
	
	getApiSetting()
	{
		var promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				this.apiSetting =this.localStorageService.getItem("apiSetting") as apiSetting;	
			  resolve(true);
			}, 100);
		  }).then(()=>{

			this.cdr.markForCheck();

		 });

		 if	(!this.apiSetting)
		 {
				this.apiSetting = new apiSetting();
				this.apiSetting.birim_uid="d";
		 }


	}
}
