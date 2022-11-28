import {NgModule, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../../../views/pages/shared/shared.module';
import { PartialsModule } from '../../../views/partials/partials.module';
import { CoreModule } from '../../../core/core.module';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				component: LoginComponent

			},
			{
				path: 'login',
				component: LoginComponent

			},
			{
				path: 'register',
				component: RegisterComponent
			}
			// ,
			// {
			// 	path: 'forgot-password',
			// 	component: ForgotPasswordComponent,
			// }
		]
	}
];

@NgModule({
	declarations: [AuthComponent, LoginComponent, RegisterComponent],
	imports: [
		CommonModule,
		//RouterModule.forChild(routes),
		RouterModule,
		FormsModule,
		SharedModule,
	//	TranslateModule.forChild(),
		ReactiveFormsModule,
		PartialsModule,
		SharedModule,
		CoreModule
	]
})
export class AuthModule {}
