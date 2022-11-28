// Angular
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { apiSetting } from '../../../../core/models/apiSetting';
// Layout
import { LayoutConfigService, ToggleOptions } from '../../../../core/_base/layout';

@Component({
	selector: 'kt-header-mobile',
	templateUrl: './header-mobile.component.html',
	styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {
	// Public properties
	headerLogo: string;
	asideDisplay: boolean;

	toggleOptions: ToggleOptions = {
		target: 'body',
		targetState: 'kt-header__topbar--mobile-on',
		togglerState: 'kt-header-mobile__toolbar-topbar-toggler--active'
	};
	apiSetting:apiSetting= new apiSetting();
	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService,
		private localStorageService:LocalStorageService
		) {

	  this.apiSetting =	this.localStorageService.getItem("apiSetting") as apiSetting ?? new apiSetting();

	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.headerLogo = this.layoutConfigService.getLogo();
		this.asideDisplay = this.layoutConfigService.getConfig('aside.self.display');
	}
}
