import { ChangeDetectorRef, Component, DoCheck, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SloginModel } from '../../../models/slogin.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '../../../../core/services/translate.service';
import { tokenModel } from '../../../../core/models/tokenModel';
import { IdentityStudentService } from '../../../../student/services/identity-student.service';
import { apiSetting } from '../../../../../../src/app/core/models/apiSetting';

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	styleUrls: [
		'./login.component.scss',
	]
})
export class LoginComponent implements DoCheck, OnInit {
	public login_page: boolean = true;
	public forgot_page: boolean = false;
	public page_change_effect: string = 'login';
	public login_data: SloginModel = new SloginModel();
	tokenModel: tokenModel;
	apiSetting: apiSetting = new apiSetting();

	constructor(
		private translate: TranslateService,
		public autService: AuthService,
		public router: Router,
		private localStorageService: LocalStorageService,
		public identityStudentService: IdentityStudentService,
		private cdr: ChangeDetectorRef,
	) { }
	ngDoCheck(): void {

		// console.log('STUDENT GİRDI ')
		// this.cdr.markForCheck();

	}
	ngOnInit(): void {
		this.apiSetting = this.localStorageService.getItem("apiSetting") as apiSetting;
	}
	login(form: NgForm) {
		this.getSwal();
		if (form.valid) {
			this.autService.login(this.login_data)
				.subscribe(res => {
					if (res.result) {
						this.tokenModel = res.data as tokenModel;
						this.identityStudentService.set(this.tokenModel.token);

						this.localStorageService.setItem('loggedUserModel', res.data);
						//Swal.close();
						this.router.navigateByUrl('homepage');
					} else {
						Swal.fire({
							title: this.translate.instant('VALIDATION.ERROR'),
							text: res.error.message,
							icon: 'error'
						});
					}
				},
					error => {
						Swal.fire({
							title: this.translate.instant('VALIDATION.ERROR'),
							text: error.error.error.message,
							icon: 'error'
						});
					});

			//Swal.close();
		}else{
			Swal.close();
		}
	}
	getSwal() {
		Swal.fire({
			title: this.translate.instant("TEXT.LOADING"),
			timer: 1000000,
			timerProgressBar: true,
			didOpen: () => {
				Swal.showLoading();
			}
		});
	}

	getValidation(state: any) {
		if (state.name === 'forgotEmail') {
			state.name = 'Email';
		}
		let controlName: string = (state.name).charAt(0).toUpperCase() + (state.name).slice(1).toLowerCase();
		let message: string[] = [];
		if (state.errors) {
			for (let errorName in state.errors) {
				switch (errorName) {
					case 'required':
						message.push(controlName + ' zorunlu alan');
						break;
				}
			}
		}
		return message;
	}

	page_change(page: string) {
		if (page) {
			if (page === 'forgot_pass') {
				this.page_change_effect = 'forgot_pass';
				this.login_page = false;
				this.forgot_page = true;
			} else if (page === 'login') {
				this.page_change_effect = 'login';
				this.login_page = true;
				this.forgot_page = false;
			}
			this.login_data = new SloginModel();
		}
	}

	pageChange(): string {
		if (this.page_change_effect === 'login') {
			return (this.login_page) ? 'login-signin-on' : null;
		} else if (this.page_change_effect === 'forgot_pass') {
			return (this.forgot_page) ? 'login-forgot-on' : null;
		}
	}
	pageChangeEffect(page: string): string {
		if (page === 'login') {
			return (this.login_page) ? 'animate__animated animate__backInUp' : null;
		} else if (page === 'forgot_pass') {
			return (this.forgot_page) ? 'animate__animated animate__backInUp' : null;
		}
	}
	// Parola Güncelleme Alanı Başlangıç
	updatePass(form: NgForm) {
		if (form.valid) {
			this.autService.updatePass(this.login_data.eposta)
				.subscribe(snc => {
					if (snc.result) {

						Swal.fire({
							text: this.translate.instant('TEXT.PROCESS_CONTINUE'),
							icon: 'success',
							showConfirmButton: false,
							timer: 3000
						});
						this.router.navigateByUrl('/');

					} else {
						Swal.fire({
							title: 'Hata!',
							text: snc.error.message,
							icon: 'error'
						});
					}
				},
					error => {
						console.log('err', error);
						Swal.fire({
							title: 'Hata!',
							text: error.error.error.message,
							icon: 'error'
						});
					});
		}
	}
	// Parola Güncelleme Alanı Bitiş
}
