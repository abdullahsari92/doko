// Angular
import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
// Auth
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { AuthenticationService } from '../../services/auth.service';
import { AuthenticationGuard } from '../../../authentication.guard';
import { MatDatepicker, MatDatepickerToggle } from '@angular/material/datepicker';
import { SharedModule } from '../shared/shared.module';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { PartialsModule } from '../../partials/partials.module';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full'
			},
			{
				path: 'login',
				component: LoginComponent,
				data: {returnUrl: window.location.pathname}
			},
			{
				path: 'register',
				component: RegisterComponent
			},
			{
				path: 'forgot-password',
				component: ForgotPasswordComponent,
			}
		]
	}
];


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule.forChild(routes),
		MatInputModule,
		MatFormFieldModule,
	//	MatDatepicker,
		//MatDatepickerToggle,
		MatFileUploadModule,
		MatCheckboxModule,
		//TranslateModule.forChild(),
		//EffectsModule.forFeature([AuthEffects]),
		SharedModule,
		PartialsModule
	],
	providers: [
		// InterceptService,
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: InterceptService,
		// 	multi: true
		// },
	],
	exports: [AuthComponent,MatFileUploadModule],
	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterComponent,
		ForgotPasswordComponent,
	]
})

export class AdminAuthModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AdminAuthModule,
			providers: [
				
				AuthenticationService,
				AuthenticationGuard,
			]
		};
	}
}
