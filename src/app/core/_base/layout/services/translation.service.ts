// Angular
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { TranslateService } from '../../../services/translate.service';
// Tranlsation
//import { TranslateService } from '../../../../core/services/translate.service';

export interface Locale {
	lang: string;
	// tslint:disable-next-line:ban-types
	data: Object;
}

@Injectable({
	providedIn: 'root'
})
export class TranslationService {
	// Private properties
	private langIds: any = [];

	/**
	 * Service Constructor
	 *
	 * @param translate: TranslateService
	 */
	constructor(private translate: TranslateService,
		private localStorageService:LocalStorageService
		) {
		// add new langIds to the list
		//this.translate.addLangs(['en']);

		// this language will be used as a fallback when a translation isn't found in the current language
	//	this.translate.setDefaultLang('en');
	}

	/**
	 * Load Translation
	 *
	 * @param args: Locale[]
	 */
	loadTranslations(...args: Locale[]): void {
		const locales = [...args];

		locales.forEach(locale => {
			// use setTranslation() with the third argument set to true
			// to append translations instead of replacing them
		//	this.translate.setTranslation(locale.lang, locale.data, true);

			this.langIds.push(locale.lang);
		});

		// add new languages to the list
		//this.translate.addLangs(this.langIds);
	}

	/**
	 * Setup language
	 *
	 * @param lang: any
	 */
	setLanguage(lang) {
		if (lang) {
			//this.translate.use(this.translate.getDefaultLang());
			this.translate.use(lang);
			this.localStorageService.setItem('language', lang);
		}
	}

	setLanguageStudent(lang) {
		if (lang) {
			this.translate.use(this.translate.getDefaultLang());
			this.translate.use(lang);
			this.localStorageService.setItem('languageStudent', lang);
		}
	}
	/**
	 * Returns selected language
	 */
	getSelectedLanguage(): any {

		var selectLanguages = this.localStorageService.getItem('language');
		if(selectLanguages)		
		  return selectLanguages;
		 else 
		   'tr';
	}

	getSelectedLanguageStudent(): any {
		return localStorage.getItem('languageStudent') || 'tr';
	}
}
