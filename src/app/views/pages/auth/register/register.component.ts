// Angular
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '../../../../core/services/translate.service';
// NGRX
// Auth
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../services/auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { validateTest } from './validateTest';

const validatinProperty = {
	controlName: '',
	controConfirmlName: ''
};

@Component({
	selector: 'kt-register',
	templateUrl: './register.component.html',
	encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy {
	registerForm: FormGroup;
	loading = false;
	errors: any = [];
	private registerControls :any;

	validateTest:validateTest = new validateTest();
	public registerController:AbstractControl
	objectTest:ObjectConstructor;

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	constructor(
		private translate: TranslateService,
		private router: Router,
		private auth: AuthenticationService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.unsubscribe = new Subject();
	}

	/*
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	*/

	/**
	 * On init
	 */
	ngOnInit() {
		this.initRegisterForm();
	}

	/*
	* On destroy
	*/
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initRegisterForm() {

	
		this.registerForm = this.fb.group({
			//agree: [false, Validators.compose([Validators.required])],
			adi: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			soyadi: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			kimlik_no: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],

			anne_adi: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			baba_adi: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			adres: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],			
				
			dogum_yeri: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			ulke_kodu: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			eposta: ['', Validators.compose([Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(320)]),],
			eposta_dogrulama: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			eposta_dogrulama_kodu: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			//id: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			sehir: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			sifre: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(255)])],
			//son_oturum: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			telefon: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			telefon2: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			dogum_tarihi: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			cinsiyet: [false, Validators.compose([Validators.required])],			
		//	resim: ['', Validators.required],
		});

	}

	objecDeneme()
	{
		const controls = this.registerForm.controls;

		return Object.keys(controls);
	}

	ifTextBox(item):boolean
	{
	
		if(item == 'birim_id' || item== "cinsiyet" || item=="dogum_tarihi" || item=="resim")
		{ 
			return false;
		 }
		else{
			this.registerForm.get(item).setValue;
			return true;
		 }
	


	}

	isFileControlHasError:boolean;
	uploadImage:any;
	onFileChange(imgFile) {


		const reader = new FileReader();
		if (imgFile.target.files && imgFile.target.files[0]) {
		  let file = imgFile.target.files[0];
		  if (!file.name.match(/(\.jpg|\.png|\.JPG|\.PNG|\.jpeg|\.JPEG)$/)) {
				this.isFileControlHasError = true;
			//this.authNoticeService.setNotice('jpg uazantılı dosya yükleyin', 'danger');

			this.registerForm.get('resim').setValue(null);
		  } else {
			if (file.size > 1024 * 1024 * 1) {
				this.isFileControlHasError = true;
		
			  this.registerForm.get('resim').setValue(null);
			} else {
				this.isFileControlHasError = false;
				//console.log('else girdi',this.registerForm.get('resim').value)
			  reader.readAsDataURL(file);
			  reader.onload = () => {
				this.uploadImage = reader.result;
				this.registerForm.get('resim').setValue({
				  lastModified: file.lastModified,
				  name: file.name,
				  size: file.size,
				  type: file.type,
				  value: reader.result
				});
			  };
			}
	
	
		  }
	
		}

	  }
	

	ifcheckbox(item):boolean
	{	
		const controls = this.registerForm.controls;

		if(controls[item].value.toString() == "false")
		{
			return true;
		}
		return false;

	}

	contorlerForHtml():string
	{
		const controls = this.registerForm.controls;
		var html ="";

		Object.keys(controls).forEach(controlName =>
			{
				html += `<div class="form-group">
				<mat-form-field>
					<mat-label>${controlName} </mat-label>
					<input matInput type="text" placeholder="${controlName} " formControlName="${controlName}"/>
					<mat-error *ngIf="isControlHasError('${controlName} ','required')">
						<strong>{{ 'VALIDATION.REQUIRED_FIELD' | translate }}</strong>
					</mat-error>
					<mat-error *ngIf="isControlHasError('${controlName}','minlength')">
						<strong>{{ 'VALIDATION.MIN_LENGTH_FIELD' | translate }} 3</strong>
					</mat-error>
					<mat-error *ngIf="isControlHasError('${controlName}','maxlength')">
						<strong>{{ 'VALIDATION.MAX_LENGTH_FIELD' | translate }} 100</strong>
					</mat-error>
				</mat-form-field>
			</div>`
			}		
		);
	
	  return html;


	}
	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.registerForm.controls;
    
		// check form
		if (this.registerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
				
			);
			return;
		}
	

		this.loading = true;

		// if (!controls.agree.value) {
		// 	// you must agree the terms and condition
		// 	// checkbox cannot work inside mat-form-field https://github.com/angular/material2/issues/7891
		// 	this.authNoticeService.setNotice('You must agree the terms and condition', 'danger');
		// 	return;
		// }

	
		//console.log("registerFormValue", this.registerForm.value);

		controls["dogum_tarihi"].setValue("2000-05-15");
		this.auth.register(this.registerForm.value).pipe(
			tap(user => {
				if (user) {
					//this.store.dispatch(new Register({authToken: user.accessToken}));
					// pass notice message to the login page
					//this.authNoticeService.setNotice(this.translate.instant('TEXT.REGISTER_SUCCESS'), 'success');
					this.router.navigateByUrl('admin/auth/login');
				} else {
					//this.authNoticeService.setNotice(this.translate.instant('VALIDATION.INVALID_LOGIN'), 'danger');
					console.log
				}
			}),
			takeUntil(this.unsubscribe),
			finalize(() => {
				this.loading = false;
				this.cdr.markForCheck();
			})
		).subscribe();




	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.registerForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}




}
