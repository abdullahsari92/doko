import { TranslateService } from '../../core/services/translate.service';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class ErrorService {
	public language_change = [];
	constructor(
		private translate: TranslateService
	) { }

	errorControl(input: string, validArray: object): any {
		let errorState: boolean;
		const message = [];
		if (input === "*") {
			for (let err in validArray['controls']) {
				if (validArray['controls'][err]['errors'] === null) {
					errorState = false;
				} else {
					errorState = true;
					break;
				}
			}
		} else {
			if (input && validArray) {
				//if (validArray['controls'][input]['touched']) {
				if (validArray['status'] === 'VALID') {
					return null;
				} else {
					if (validArray['controls'][input]['errors'] !== null) {
						for (const error in validArray['controls'][input]['errors']) {
							message.push(this.errorMessage(input, error.toUpperCase()));
						}
					}
				}
				//}
			}
		}
		return (input === "*" ? errorState : message);
	}
	errorMessage(input: string, errorName: string): any {
		if (errorName) {
			return (this.translate.instant('VALIDATION.' + (errorName).toUpperCase())).replace('{{name}}', this.translate.instant('TEXT.' + input));
		}
	}
	arrayError(params: Object): any {
		let message: string = "";
		if (typeof (params) == "object") {
			for (let keys in params) {
				message += this.errorMessage(keys, params[keys]) + '<br/>';
			}
		} else {
			message = this.translate.instant(params);
		}

		return message;
	}
}
