// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '../../../../core/services/translate.service';
// Store
// Auth
import { AuthenticationService } from '../../../services/auth.service';
import { apiSetting } from '../../../../core/models/apiSetting';
import { loginModel } from '../../../../core/models/loginModel';
import { tokenModel } from '../../../../core/models/tokenModel';
import { IdentityService } from '../../../../core/services/identity.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { BirimYonetimService } from '../../../../views/services/birim_yonetim.service';
import { AuthModel } from '../../../../core/models/authModel';
import { YetkiTanimService } from '../../../../views/services/yetki-tanim.service';
/**
 * ! Just example => Should be removed in development
 */
// const DEMO_PARAMS = {
// 	EMAIL: 'abdullah.sari@dpu.edu.tr',
// 	PASSWORD: '12345'
// };

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];
	tokenModel: tokenModel
	private unsubscribe: Subject<any>;
	apiSetting: apiSetting = new apiSetting();

	private returnUrl: any;
	logiModel: loginModel = new loginModel();
	constructor(
		private router: Router,
		private translate: TranslateService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private serviceAuth: AuthenticationService,
		private identityService: IdentityService,
		private localStorageService: LocalStorageService,
		private BirimYonetimService: BirimYonetimService,
		private yetkiTanimService:YetkiTanimService

	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params.returnUrl || '/';
		});

		this.getApiSetting();

	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}


	getApiSetting() {

		this.apiSetting = this.localStorageService.getItem("apiSetting") as apiSetting;

		if (!this.apiSetting) {

			console.log('apisetting girdi')
			this.apiSetting = new apiSetting();
			this.apiSetting.birim_uid = "d";
		}

		console.log('apisett ', this.apiSetting)
	}

	donemler: [] = [];
	getBirimDeneme() {
		this.BirimYonetimService.getListTrainingPeriod().subscribe(res => {

			this.donemler = res.data;

			console.log('donemler', this.donemler)
			this.cdr.markForCheck();


		})
	}
	// signUp() {
	// 	let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
	// 	const _saveMessage = this.translate.instant(saveMessageTranslateParam);
	// 	const dialogRef = this.dialog.open(RegisterComponent);
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			return;
	// 		}

	// 		//this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);

	// 	});
	// }

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {

		// demo message to show
		// if (!this.authNoticeService.onNoticeChanged$.getValue()) {
		// 	const initialNotice = `Use account
		// 	<strong>${DEMO_PARAMS.EMAIL}</strong> and password
		// 	<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
		// 	this.authNoticeService.setNotice(initialNotice, 'info');
		// }

		// this.loginForm = this.fb.group({
		// 	email: [DEMO_PARAMS.EMAIL, Validators.compose([
		// 		Validators.required,
		// 		Validators.email,
		// 		Validators.minLength(3),
		// 		Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
		// 	])
		// 	],
		// 	password: [DEMO_PARAMS.PASSWORD, Validators.compose([
		// 		Validators.required,

		// 		Validators.minLength(3),
		// 		Validators.maxLength(100)
		// 	])
		// 	]
		// });
		this.loginForm = this.fb.group({
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: ['', Validators.compose([
				Validators.required,

				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}



	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}


		this.loading = true;

		const authData = {
			email: controls.email.value,
			password: controls.password.value
		};

		this.logiModel.eposta = authData.email;
		this.logiModel.sifre = authData.password;
		this.logiModel.birimUid = this.apiSetting.birim_uid;


		this.serviceAuth
			.login(this.logiModel).pipe(tap(res => {

				//	var gelenData = JSON.parse(res)	

				console.log(' login ', res);
				if (res.result) {
					this.tokenModel = res.data as tokenModel;

					console.log("TokenModel", this.tokenModel);
					//this.store.dispatch(new Login({ authToken: this.tokenModel.token }));
					this.identityService.set(this.tokenModel);
					this.localStorageService.setItem("tokenModel", this.tokenModel);

					this.getYetkilerSetLocalStorage(this.tokenModel.user.rol_id);
					// Main page
				
				} else {
					//this.authNoticeService.setNotice(this.translate.instant('VALIDATION.INVALID_LOGIN'), 'danger');
				}

				

			}), takeUntil(this.unsubscribe),
				finalize(() => {

					this.loading = false;
					this.cdr.markForCheck();
					// Main page
					this.router.navigateByUrl("admin/dashboard");
					//	this.router.navigate(['menu/list'], { relativeTo: this.activatedRoute });

				})).subscribe(p => { }, err => {
					console.log('loginEERRRO ', err);
				})

		//	this.router.navigateByUrl("dashboard"); 
		// subscribe(res=>{ 

		// 	this.tokenModel = res.data as tokenModel 	  

		// 	console.log(" tokenModel: " ,this.tokenModel);

		// 	console.log(" token: " ,this.tokenModel.token);


		// 	  if (res.result) {	  
		// 	    console.log(" res: " ,res);
		// 		this.store.dispatch(new Login({authToken: this.tokenModel.token}));

		// 		this.identityService.set(this.tokenModel);	
		// 		this.router.navigateByUrl(this.returnUrl); // Main page			
		// 	  }


		//   });


		// this.auth
		// 	.login(authData.email, authData.password)
		// 	.pipe(
		// 		tap(user => {
		// 			if (user) {
		// 				this.store.dispatch(new Login({authToken: user.accessToken}));
		// 				this.router.navigateByUrl(this.returnUrl); // Main page
		// 			} else {
		// 				this.authNoticeService.setNotice(this.translate.instant('VALIDATION.INVALID_LOGIN'), 'danger');
		// 			}
		// 		}),
		// 		takeUntil(this.unsubscribe),
		// 		finalize(() => {
		// 			this.loading = false;
		// 			this.cdr.markForCheck();
		// 		})
		// 	)
		// 	.subscribe();
	}
	bodyTemizleme()
	{

		document.body.removeAttribute("style");
		document.body.removeAttribute("class");

	}
	
	//yetkiler veri tabanından çekiliyor local storage yazılıyor.
	authModelList:AuthModel[]=[];
	getYetkilerSetLocalStorage(roleId)
	{
		if(!this.localStorageService.getItem("getAuthCanView"))
		{
			this.yetkiTanimService.getAuthCanView(roleId).subscribe(res => {
				if(res.result)
				{
					this.authModelList= res.data;
					this.localStorageService.setItem("getAuthCanView",this.authModelList);
				}
				})
		}
		else{
			this.authModelList = this.localStorageService.getItem("getAuthCanView");
		}		
	}
	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
