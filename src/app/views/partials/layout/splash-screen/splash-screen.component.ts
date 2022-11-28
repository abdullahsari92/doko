// Angular
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// Object-Path
import * as objectPath from 'object-path';
import { apiSetting } from '../../../../core/models/apiSetting';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
// Layout
import { LayoutConfigService, SplashScreenService } from '../../../../core/_base/layout';

@Component({
	selector: 'kt-splash-screen',
	templateUrl: './splash-screen.component.html',
	styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
	// Public proprties
	loaderLogo: string;
	loaderType: string;
	loaderMessage: string;
	apiSetting: apiSetting = new apiSetting();

	@ViewChild('splashScreen', { static: true }) splashScreen: ElementRef;

	/**
	 * Component constructor
	 *
	 * @param el: ElementRef
	 * @param layoutConfigService: LayoutConfigService
	 * @param splashScreenService: SplachScreenService
	 */
	constructor(
		private el: ElementRef,
		private layoutConfigService: LayoutConfigService,
		private localStorageService: LocalStorageService,

		private splashScreenService: SplashScreenService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.getApiSetting();
		// init splash screen, see loader option in layout.config.ts
		const loaderConfig = this.layoutConfigService.getConfig('loader');
		this.loaderLogo = objectPath.get(loaderConfig, 'logo');
		this.loaderType = objectPath.get(loaderConfig, 'type');
		this.loaderMessage = objectPath.get(loaderConfig, 'message');
		this.splashScreenService.init(this.splashScreen);
	}

	getApiSetting() {
		this.apiSetting = this.localStorageService.getItem("apiSetting") as apiSetting;

		if (!this.apiSetting) {
			console.log('apisetting girdi')
			this.apiSetting = new apiSetting();
			this.apiSetting.birim_uid = "d";
		}

	}
}
