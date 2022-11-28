import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { countryModel } from '../models/country.model';
import { apiResult } from '../../core/models/apiResult';
import { BasvuruTurEnum } from '../../core/Enums/BasvuruTurEnum';

@Injectable({
	providedIn: 'root'
})
export class StudentService {
	endPoint: string = "student/student/";
	constructor(
		private dokoApi: DokoSettingsService,
		private http: HttpClient
	) { }
	generalInfo() {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'general_info_get', '');
	}
	studentNotifications(basvuruTuru?: number) {
		var body = { basvuru_turu: basvuruTuru }
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'notifications', body);
	}
	confirmNotifications(bildirim_id: number) {
		var body = { id: bildirim_id }
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'confirm_notifications', body);
	}
	personalInfo() {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'personal_info_get', '');
	}
	contactInfo() {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'contact_info_get', '');
	}
	countryInfo(): Observable<any> {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'country_get_list', '');
	}
	visaInfo(): Observable<any> {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'visa_get_list', '');
	}
	getBirimIslemListesi(): Observable<any> {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'unit_action_get_list', "");
	}
	getAktifBasvurular(basvuruTuru): Observable<any> {
		var body = { basvuru_turu: basvuruTuru }
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'application_get_list', body);
	}
	getTamamlanmayanBasvurular(basvuruTuru): Observable<any> {
		var body = { basvuru_turu: basvuruTuru }
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'continue_get_list', body);
	}
	getGecmisBasvurular(basvuruTuru): Observable<any> {
		var body = { basvuru_turu: basvuruTuru }
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'past_application_get_list', body);
	}
	getYerlestirmeSonrasiOdeme(): Observable<any> {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'post_placement_payment_get_list', "");
	}
	getGirisUcretiOdeme(): Observable<any> {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'post_entrance_fee_get_list', "");
	}

	getSinavBasvuruDetay(basvuruId: number, basvuru_turu: number): Observable<apiResult> {
		var body = { basvuru_id: basvuruId }
		let url = 'application_exam_get';
		if (basvuru_turu == 2) {
			url = 'application_degree_get';
		}
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + url, body);
	}

	sinavBasvuruKaydet(body: any): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_exam_save', body);
	}
	lisansBasvuruKaydet(body: any): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_degree_save', body);
	}
	approve_application(ogrenci_basvuru_id: any, basvuru_id: any) {
		var body = { ogrenci_basvuru_id: ogrenci_basvuru_id, basvuru_id: basvuru_id }
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'approve_application', body);
	}
	uploadExamDekont(data: any) {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_exam_file_save', data);
	}

	// Dil İşlemleri Başlangıç
	language_exams_get_list(): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'language_exams_get_list', '');
	}
	language_get_list(basvuruId: number): Observable<apiResult> {
		var body = { basvuru_id: basvuruId }
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_language_get_list', body);
	}
	language_save(body: apiResult): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_language_save', body);
	}
	language_delete(data: any) {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_language_delete', data);
	}
	visa_delete() {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_visa_delete', '');
	}
	// Dil İşlemleri Bitiş

	// Lise İşlemleri Başlangıç
	high_school_get_list(): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'high_school_get_list', "");
	}
	high_school_file_save(body: apiResult): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'high_school_file_save', body);
	}
	high_school_save(body: apiResult): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'high_school_save', body);
	}
	high_school_delete(data: any) {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'high_school_delete', data);
	}
	// Lise İşlemleri Bitiş

	// Lisans İşlemleri Başlangıç
	getListLicence(): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'degree_get_list', "");
	}
	getLisansBasvuruDetay(basvuruId): Observable<apiResult> {
		var body = { basvuru_id: basvuruId }
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_degree_get', body);
	}
	saveLicence(data: any) {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'degree_save', data);
	}
	deleteLicence(data: any) {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'degree_delete', data);
	}
	// Lisans İşlemleri Bitiş
	// Yüksek Lisans İşlemleri Başlangıç
	saveGraduate(data: any) {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'graduate_save', data);
	}
	deleteGraduate(data: any) {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'graduate_delete', data);
	}
	graduate_get_list(): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'graduate_get_list', "");
	}
	// Yüksek Lisans İşlemleri Bitiş

	score_type_get_list(basvuruTur: number/* BasvuruTurEnum */): Observable<apiResult> {
		var body = { basvuru_turu: basvuruTur }
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'score_type_get_list', body);
	}
	
	getConsulateList(): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'consulate_get_list', '');
	}
	applicationTypeGetList(basvuruTur: BasvuruTurEnum): Observable<apiResult> {
		var body = { basvuru_turu: basvuruTur }
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_type_get_list', body);
	}
	exam_place_get_list(basvuruId: any): Observable<apiResult> {
		var body = { basvuru_id: basvuruId }
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'exam_place_get_list', body);
	}
	/* required_language_get_list(): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'required_language_get_list', "");
	} */
	preference_faculty_list(basvuru_id: number): Observable<apiResult> {
		var body = { basvuru_id: basvuru_id }
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_faculty_get_list', body);
	}
	preference_episode_list(basvuru_id: number): Observable<apiResult> {
		var body = { basvuru_id: basvuru_id }
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_episode_get_list', body);
	}
	preference_info_get(basvuruID: number, ogrenci_basvuruID: number): Observable<apiResult> {
		var body = {
			basvuru_id: basvuruID,
			ogrenci_basvuru_id: ogrenci_basvuruID
		}
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'preference_info_get', body);
	}
	preference_save(body: any): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_degree_preference_save', body);
	}
	preference_delete(basvuruID: number, ogrenci_basvuruID: number): Observable<apiResult> {
		var body = {
			basvuru_id: basvuruID,
			ogrenci_basvuru_id: ogrenci_basvuruID
		}
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'application_degree_preference_delete', body);
	}
	nationality_info_get(body?: any): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'nationality_info_get', body);
	}
	nationality_info_save(body: any): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'nationality_info_save', body);
	}
	nationality_reasons_get_list(): Observable<apiResult> {
		return this.http.post<apiResult>(this.dokoApi.apiUrl + this.endPoint + 'nationality_reasons_get_list', "");
	}

	//Raporlama Başlangıç
	reportViewerData(id: number, basvuruId: number) {
		var body = { id: id, basvuru_id: basvuruId }
		return this.http.post<apiResult>(this.dokoApi.apiUrl + 'student/report/report_viewer', body);
	}
	report_file(id: any): Observable<any> {
		var body = { sablon_tanimlari_id: id };
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		});
		return this.http.post<Blob>(this.dokoApi.apiUrl + 'student/report/report_file', body,
			{
				headers: headers,
				responseType: 'blob' as 'json'
			}
		);
	}
	/* report_file(id: any): Observable<any> {
		var regTime = new Date().getTime() / 1000;
		var reg = regTime.toString().split('.')[0];
		var httpOpt = {
			headers: new HttpHeaders({
				"Req-Time": reg,
			}),
			responseType: "blob" as 'json'
		}
		console.log(' report_file girdi')
		return this.http.get<any>(this.dokoApi.apiUrl + 'public_methods/report_file/' + id + '.mrt', httpOpt);
	} */
	//Raporlama Bitiş

	// Update Begin
	personalUpdate(form: any) {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'personal_info_save', form);
	}
	contactUpdate(form: any) {
		return this.http.post<any>(this.dokoApi.apiUrl + this.endPoint + 'contact_info_save', form);
	}
	// Update End


}

