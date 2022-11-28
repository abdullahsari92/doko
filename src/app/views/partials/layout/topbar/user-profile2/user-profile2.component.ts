// Angular
import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { tokenModel } from '../../../../../core/models/tokenModel';
import { IdentityService } from '../../../../../core/services/identity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/auth.service';

@Component({
	selector: 'kt-user-profile2',
	templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {
	// Public properties

	tokenmodel: tokenModel = new tokenModel();
	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 * @param store: Store<AppState>
	 */
	constructor(
		private localStorageService: LocalStorageService,
		private identityService: IdentityService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public autService: AuthenticationService,

	) { }

	ngOnInit(): void {

		if (this.localStorageService.getItem("tokenModel")) {
			this.tokenmodel = this.localStorageService.getItem("tokenModel") as tokenModel;
		}
	}

	/*Log out*/
	logout() {
		this.identityService.remove();
		this.autService.logout().subscribe(res => {
			if (res.result) { }
		})	
		this.router.navigate(['/admin/auth'], { relativeTo: this.activatedRoute });
			
	}
}
