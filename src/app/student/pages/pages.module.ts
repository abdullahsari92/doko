import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { ContactInformationComponent } from './contact-information/contact-information.component';
import { PreferenceInformationComponent } from './education-information/preference-information/preference-information.component';
import { PreferenceAdditionalActionsComponent } from './education-information/preference-information/preference-additional-actions/preference-additional-actions.component';
import { MenuComponent } from './menu/menu.component';
import { ExamInformationComponent } from './exam-information/exam-information.component';
import { BaseLayoutComponent } from './base/base-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../views/pages/shared/shared.module';
import { PartialsModule } from '../../views/partials/partials.module';
import { OgrenciBasvuruModule } from './ogrenci-basvuru/ogrenci-basvuru.module';
import { NationalityInformationComponent } from './personal-information/nationality-information/nationality-information.component';
import { BasvuruGoruntulemeComponent } from './ogrenci-basvuru/basvuru-goruntuleme/basvuru-goruntuleme.component';
import { TextDisplayComponent } from './ogrenci-basvuru/text-display/text-display.component';
import { LisansBasvuruComponent } from './ogrenci-basvuru/lisans-basvuru/lisans-basvuru.component';
import { SinavBasvuruComponent } from './ogrenci-basvuru/sinav-basvuru/sinav-basvuru.component';
import { HazirlikBasvuruComponent } from './ogrenci-basvuru/hazirlik-basvuru/hazirlik-basvuru.component';
import { EducationInformationComponent } from './education-information/education-information.component';
import { GraduateInformationComponent } from './education-information/graduate-information/graduate-information.component';
import { LicenceInformationComponent } from './education-information/licence-information/licence-information.component';
import { LyceeInformationComponent } from './education-information/lycee-information/lycee-information.component';
import { LanguageInformationComponent } from './education-information/language-information/language-information.component';
import { VisaInformationComponent } from './education-information/visa-information/visa-information.component';
import { AdditionalActionsComponent } from './personal-information/additional-actions/additional-actions.component';
import { LyceeAdditionalActionsComponent } from './education-information/lycee-information/lycee-additional-actions/lycee-additional-actions.component';
import { LicenceAdditionalActionsComponent } from './education-information/licence-information/licence-additional-actions/licence-additional-actions.component';
import { GraduateAdditionalActionsComponent } from './education-information/graduate-information/graduate-additional-actions/graduate-additional-actions.component';
import { LanguageAdditionalActionsComponent } from './education-information/language-information/language-additional-actions/language-additional-actions.component';
import { VisaAdditionalActionsComponent } from './education-information/visa-information/visa-additional-actions/visa-additional-actions.component';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
	{
		path: '',
		component: BaseLayoutComponent,

		children: [
			/* {path: '', redirectTo: '/auth', pathMatch: 'full'},
			{
				path: '',
				component: HomePageComponent
			}, */
			{
				path: 'homepage',
				component: HomePageComponent
			},
			{
				path: 'personalinfo/:id',
				component: PersonalInformationComponent
			},
			{
				path: 'contactinfo',
				component: ContactInformationComponent
			},
			{
				path: 'educationinfo/:id/:basvuruID',
				component: EducationInformationComponent
			},
			{
				path: 'educationinfo',
				component: EducationInformationComponent
			},
			{
				path: 'examinfo',
				component: ExamInformationComponent
			},
			{
				path: 'preferenceinfo',
				component: PreferenceInformationComponent
			},

		]
	}
];


@NgModule({
	declarations: [
		BaseLayoutComponent,
		HomePageComponent,
		PersonalInformationComponent,
		ContactInformationComponent,
		PreferenceInformationComponent,
		PreferenceAdditionalActionsComponent,
		MenuComponent,
		ExamInformationComponent,
		NationalityInformationComponent,
		SinavBasvuruComponent,
		HazirlikBasvuruComponent,
		TextDisplayComponent, 
		LisansBasvuruComponent,
		BasvuruGoruntulemeComponent,
		LicenceInformationComponent,
		LicenceAdditionalActionsComponent,
		GraduateInformationComponent,
		GraduateAdditionalActionsComponent,
		LyceeInformationComponent,
		LyceeAdditionalActionsComponent,
		LanguageInformationComponent,
		LanguageAdditionalActionsComponent,
		VisaInformationComponent,
		VisaAdditionalActionsComponent,
		EducationInformationComponent,
		AdditionalActionsComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		SharedModule,
		//TranslateModule.forChild(),
		ReactiveFormsModule,
		PartialsModule,
		CoreModule,
		//AuthModule
		//OgrenciBasvuruModule
	],
	exports: [
		RouterModule
	]
})
export class PagesModule { }
