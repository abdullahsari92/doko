// Angular
import { NgIf } from '@angular/common';
import { Component, HostBinding, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
// RxJS
import { filter } from 'rxjs/operators';
// Translate
import { TranslationService } from '../../../../../core/_base/layout';
import { TranslateService } from '../../../../../core/services/translate.service';

interface LanguageFlag {
	lang: string;
	name: string;
	flag: string;
	active?: boolean;
}

@Component({
	selector: 'kt-language-selector',
	templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent implements OnInit {
	// Public properties
	@HostBinding('class') classes = '';
	@Input() iconType: '' | 'brand';
	@Input() isStudent:boolean= false;


	language: LanguageFlag;
	languages: LanguageFlag[] = [
		{
			lang: 'en',
			name: this.translate.instant("LANGUAGE.en"),
			flag: './assets/media/flags/260-united-kingdom.svg'
		},                          
		{
			lang: 'tr',
			name: this.translate.instant("LANGUAGE.tr"),
			flag: './assets/media/flags/218-turkey.svg'
		},
		{
			lang: 'ch',
			name: this.translate.instant("LANGUAGE.ch"),
			flag: './assets/media/flags/034-china.svg'
		},
		{
			lang: 'es',
			name: this.translate.instant("LANGUAGE.sp"),
			flag: './assets/media/flags/128-spain.svg'
		},
	
		{
			lang: 'de',
			name: this.translate.instant("LANGUAGE.ge"),
			flag: './assets/media/flags/162-germany.svg'
		},
		{
			lang: 'fr',
			name: this.translate.instant("LANGUAGE.fr"),
			flag: './assets/media/flags/195-france.svg'
		},
	];

	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * 
	 * @param router: Router
	 */


	constructor(private translationService: TranslationService,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,

		 private router: Router) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.setSelectedLanguage();
		this.router.events
			.pipe(filter(event => event instanceof NavigationStart))
			.subscribe(event => {
				this.setSelectedLanguage();
			});
	}

	/**
	 * Set language
	 *
	 * @param lang: any
	 */
	setLanguage(lang,reload=true) {
		this.languages.forEach((language: LanguageFlag) => {
			if (language.lang === lang) {
				language.active = true;
				this.language = language;
			} else {
				language.active = false;
			}
		});
		 	this.translationService.setLanguage(lang);
			 let currentUrl = this.router.url;

			 if(reload)
			 {
				console.log(' currentUrl',currentUrl)
				this.router.routeReuseStrategy.shouldReuseRoute = () => false;
				this.router.onSameUrlNavigation = 'reload';
				this.router.navigate([currentUrl]);
			 }
				
	}



	/**
	 * Set selected language
	 */
	setSelectedLanguage(): any {
		this.setLanguage(this.translationService.getSelectedLanguage(),false);
	}
}
