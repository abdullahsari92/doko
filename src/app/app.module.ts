// Angular
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
// Angular in memory
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// Perfect Scroll bar
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { NgxPermissionsModule } from 'ngx-permissions';

import { AppComponent } from './app.component';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ThemeModule } from './views/theme/theme.module';
// Partials
import { PartialsModule } from './views/partials/partials.module';
// Layout Services
import {
	DataTableService, KtDialogService, LayoutConfigService, LayoutRefService, MenuAsideService, MenuConfigService, MenuHorizontalService, PageConfigService,
	SplashScreenService,
	SubheaderService
} from './core/_base/layout';

import { HttpUtilsService, LayoutUtilsService, TypesUtilsService } from './core/_base/crud';
// Config
import { LayoutConfig } from './core/_config/layout.config';
// Highlight JS
import { HIGHLIGHT_OPTIONS, HighlightLanguage } from 'ngx-highlightjs';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as scss from 'highlight.js/lib/languages/scss';
import * as xml from 'highlight.js/lib/languages/xml';
import * as json from 'highlight.js/lib/languages/json';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WelcomeService } from './views/services/welcome.service';
import { StimulsoftViewerModule } from 'stimulsoft-viewer-angular';
import { TranslateService } from './core/services/translate.service';
import { AuthModule } from './student/pages/auth/auth.module';
import { AdminAuthModule } from './views/pages/auth/adminAuth.module';


/*
ABDULLAH SRAI
*/

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	wheelSpeed: 0.5,
	swipeEasing: true,
	minScrollbarLength: 40,
	maxScrollbarLength: 300,
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
	// initialize app by loading default demo layout config
	return () => {
		if (appConfig.getConfig() === null) {
			appConfig.loadConfigs(new LayoutConfig().configs);
		}
	};
}

export function hljsLanguages(): HighlightLanguage[] {
	return [
		{ name: 'typescript', func: typescript },
		{ name: 'scss', func: scss },
		{ name: 'xml', func: xml },
		{ name: 'json', func: json }
	];
}

export function getApiSettings(welcomeService: WelcomeService){
	return () => {
			welcomeService.getApiSetting().subscribe(res => {
				localStorage.setItem('apiSetting', JSON.stringify({ objectName: res }));

			}, err => {
				console.error('ERR ', err);
			})
		};
			
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		NgxPermissionsModule.forRoot(),
		PartialsModule,
		CoreModule,
		OverlayModule,
		AdminAuthModule.forRoot(),
		MatProgressSpinnerModule,
		InlineSVGModule.forRoot(),
		ThemeModule,
		StimulsoftViewerModule,
		AuthModule
	],
	exports: [],
	providers: [

	//	AuthService,
		LayoutConfigService,
		LayoutRefService,
		MenuConfigService,
		PageConfigService,
		KtDialogService,
		DataTableService,
		WelcomeService,
		TranslateService,
		SplashScreenService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},
		{
			// layout config initializer
			provide: APP_INITIALIZER,
			useFactory: initializeLayoutConfig,
			deps: [LayoutConfigService], multi: true
		},	
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: { languages: hljsLanguages }
		},
		SubheaderService,
		MenuHorizontalService,
		MenuAsideService,
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
		// template services

	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
