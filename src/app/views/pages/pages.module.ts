// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';

import { GenelYonetimModule } from './genel-yonetim/genel-yonetim.module';
import { AuthenticationInterceptor } from '../../authentication-interceptor';

@NgModule({
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,		
	//	GenelYonetimModule

	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },

	]
})
export class PagesModule {
}
