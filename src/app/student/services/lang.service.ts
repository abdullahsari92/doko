import {Injectable} from '@angular/core';
import {TranslationService} from '../../core/_base/layout';
import {Router} from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class langService {
	public flagsURL = '../../assets/media/flags/';
	public language = [
		{
			'kod': 'tr',
			'bayrak': this.flagsURL + '218-turkey.svg',
			'durumu': true
		}, {
			'kod': 'en',
			'bayrak': this.flagsURL + '226-united-states.svg',
			'durumu': true
		}, {
			'kod': 'sp',
			'bayrak': this.flagsURL + '128-spain.svg',
			'durumu': false
		}, {
			'kod': 'ge',
			'bayrak': this.flagsURL + '162-germany.svg',
			'durumu': false
		}, {
			'kod': 'ja',
			'bayrak': this.flagsURL + '063-japan.svg',
			'durumu': false
		} , {
			'kod': 'fr',
			'bayrak': this.flagsURL + '195-france.svg',
			'durumu': false
		}
	];
	constructor(
		private translation: TranslationService,
		private router: Router,
	) {}
	changeLang(code?: string){
		if(code === undefined){
			code = this.translation.getSelectedLanguageStudent();
		}
		return this.language.filter(data => data.kod === code)[0];
	}
	changeLangLocal(code: string){
		this.translation.setLanguageStudent(code);
	}
	getLang(){
		return this.language.filter(state => state.durumu);
	}
}
