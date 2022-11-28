// Angular
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { apiSetting } from '../../../core/models/apiSetting';
import { LocalStorageService } from '../../../core/services/local-storage.service';
// Layout
import { LayoutConfigService } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';

@Component({
	selector: 'kt-brand',
	templateUrl: './brand.component.html',
	styleUrls: ['brand.component.scss']
})
export class BrandComponent implements OnInit, AfterViewInit {
	// Public properties
	headerLogo: string;
	headerStickyLogo: string;
	apiSetting:apiSetting = new apiSetting();

	constructor(private layoutConfigService: LayoutConfigService, 
		private localStorageService:LocalStorageService,
		public htmlClassService: HtmlClassService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {


		this.headerLogo = this.layoutConfigService.getLogo();
		this.headerStickyLogo = this.layoutConfigService.getStickyLogo();
			this.getApiSetting()
	}

	/**
	 * On after view init
	 */
	ngAfterViewInit(): void {
	}

	getApiSetting()
	{

     	this.apiSetting =	this.localStorageService.getItem("apiSetting") as apiSetting;

		 if	(!this.apiSetting)
		 {
			console.log('apisetting girdi')
				this.apiSetting = new apiSetting();
				this.apiSetting.birim_uid="d";
		 }
			 
	}
}
