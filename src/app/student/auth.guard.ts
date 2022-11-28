import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { IdentityStudentService } from './services/identity-student.service';


@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router,
		private identityStudentService: IdentityStudentService
	) { }
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.identityStudentService.isLogged()) {
			return true;
		} else {
			this.router.navigate(['/login', { redirectUrl: state.url }]);
			return false;
		}
	}


	canActivateChild(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

		if (this.identityStudentService.isLogged()) {
			return true;
		} else {
			this.router.navigate(['/login', { redirectUrl: state.url }]);
			return false;
		}
	}




}
