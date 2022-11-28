import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { IdentityService } from './core/services/identity.service';
import { apiSetting } from './core/models/apiSetting';
import { LocalStorageService } from './core/services/local-storage.service';
import { IdentityStudentService } from './student/services/identity-student.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

	token: string;
	session:string;
	headers: HttpHeaders;
	regTime:number;
	birimUID: string;
	apisetting:apiSetting=new apiSetting();
	updatedRequest:any;
	constructor(
		private identityService: IdentityService,
		private identityStudentService: IdentityStudentService,
		private router: Router,
		private localStorageService: LocalStorageService
	) {}
	getApiSetting() {
		var apisetting = this.localStorageService.getItem("apiSetting") as apiSetting;

		if(apisetting)
			this.apisetting= apisetting;
		else{
			this.apisetting = new apiSetting();

			this.apisetting.birim_uid="d";
			console.log('new apisetting ',apisetting)

			//return apisetting;
		}

	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if(this.localStorageService.getItem("apiSetting")) {
			this.apisetting =this.localStorageService.getItem("apiSetting") as apiSetting;
		}

		if (this.identityService.isLogged()) {
			this.token = this.identityService.get();
			
			this.session=this.identityService.getSession();
		} else {
			this.token = '';
			this.session='';
		}
	

		this.regTime = new Date().getTime() / 1000;
		var urlName = request.url.split('/');
		var isStudent = urlName[3] === 'student';

		var isReport = urlName[4] === 'report';

	
		if(isStudent){
			this.token = '';
			if (this.identityStudentService.isLogged()) {
				this.token = this.identityStudentService.get();				
			} else {
				this.token = '';
			}		
			if( this.localStorageService.getItem('apiSetting') !== null) {
				this.birimUID = this.localStorageService.getItem('apiSetting').birim_uid;
			} else {
				this.birimUID = '';
			}
			this.headers = new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.token,
				'BirimUID': this.birimUID,
				'Req-Time': this.regTime.toString()
			});

			this.updatedRequest = request.clone({ headers: this.headers });

		} else {


			this.headers = new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': "Bearer "+this.token,
				'BirimUID': this.apisetting.birim_uid,
				'Req-Time': this.regTime.toString()
			});

			this.updatedRequest = request.clone({ headers: this.headers});
		}
		

		return next.handle(this.updatedRequest).pipe(
			tap(
				event => {

				 isStudent = this.updatedRequest.url.split('/')[3] === 'student';
				
					if (event instanceof HttpResponse) {
						if (event.status === 401) {
							this.router.navigate(['/User/MyProfile']);
						} else {
						}
					}
				},
				error => {
					if (error.status === 401) {
								
						  this.router.navigate(['/admin/auth/login']);	
					} else {
					
					}
				}
			)
		);
	}
}
