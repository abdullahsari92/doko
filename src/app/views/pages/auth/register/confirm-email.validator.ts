import { AbstractControl } from '@angular/forms';

export class ConfirmEmailValidator {
	/**
	 * Check matching password with confirm password
	 * @param control AbstractControl
	 */

	static MatchConfirm(controlName:string,controlConfirmNae:string,control: AbstractControl){
		const password = control.get(controlName).value;

		const confirmPassword = control.get(controlConfirmNae).value;

		if (password !== confirmPassword) {
			control.get(controlConfirmNae).setErrors({ConfirmPassword: true});
		} else {
			return null;
		}
	}
}
