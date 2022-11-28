import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { exit } from 'process';
import { Observable } from 'rxjs';
import { OgrenciBasvuruDurumEnum } from '../../core/Enums/OgrenciBasvuruDurum.enum';
import { BasvuruTurEnum } from '../../core/Enums/BasvuruTurEnum';
import { apiResult } from '../../core/models/apiResult';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { SinavBasvuru } from '../models/sinavBasvuru';
import { OgrenciYerlesmeDurumEnum } from '../../core/Enums/OgrenciYerlesmeDurum.enum';
import { TrueFalseEnum } from '../../core/Enums/TrueFalse.enum';

@Injectable({
  providedIn: 'root'
})
export class BasvuruService {

  endPoint = "admin/application/";

  constructor(
    private http: HttpClient,
    private dokoSettingsService: DokoSettingsService
  ) { }

  //Ortak başvuruları listeleme alanı
  getOrtakBasvuruList(egitimDonemId, basvuruTuru): Observable<apiResult> {
    var body = { egitim_donemi_id: egitimDonemId, basvuru_turu: basvuruTuru };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "education_get_list", body);
  }

  //Sınav listeleme alanı
  getSinavList(egitimDonemId): Observable<apiResult> {
    var body = { egitim_donemi_id: egitimDonemId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "exam_get_list", body);
  }

  //Sınav Merkezleri listeleme alanı
  getSinavMerkezList(basvuruId): Observable<apiResult> {
    var body = { basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "exam_center_get_list", body);
  }

  //Sınav Salonları listeleme alanı
  getSinavSalonList(merkezId): Observable<apiResult> {
    var body = { merkez_id: merkezId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "exam_center_class_get_list", body);
  }

  //Sınava başvuran öğrencileri listeleme alanı
  getSinavBasvuruOgrencilerList(basvuruId): Observable<apiResult> {
    var body = { basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_exam_get_list", body);
  }

  //Tercihlere başvuran öğrencileri listeleme alanı
  getOrtakBasvuruOgrencilerList(basvuruId): Observable<apiResult> {
    var body = { basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_education_get_list", body);
  }

  //Başvuru yapılacak bölümlerin listesi
  getBasvuruBolumleriList(basvuruId): Observable<apiResult> {
    var body = { basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "departments_apply_get_list", body);
  }

  //Birimdeki Fakültelerin listesi
  getBirimFakulteList(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "faculty_unit_get_list", null);
  }

  //Birimdeki Bölümlerin listesi
  getFakulteBolumList(basvuruId): Observable<apiResult> {
    var body = { basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "department_faculty_get_list", body);
  }

  //Bildirimleri Listesi
  getBildirimList(basvuruId): Observable<apiResult> {
    var body = { basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "notification_get_list", body);
  }

  //Merkezleri listeleme alanı başvuru
  getSinavAtanacakMerkezList(basvuruId): Observable<apiResult> {
    var body = { basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_exam_center_get_list", body);
  }

  topluOgrenciOrtakBasvuruDurumGuncelle(ogrBasvuruIds, durumu: OgrenciBasvuruDurumEnum): Observable<apiResult> {
    var body = { ogrBasvuruIds: ogrBasvuruIds, durumu: durumu };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_education_application_status", body);
  }

  topluOgrenciOrtakOdemeDurumGuncelle(ogrBasvuruIds, durumu: TrueFalseEnum): Observable<apiResult> {
    var body = { ogrBasvuruIds: ogrBasvuruIds, odeme_onay: durumu };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_education_payment_confirmation", body);
  }

  topluOgrenciOrtakYerlestirmeDurumGuncelle(ogrBasvuruIds, durumu: OgrenciYerlesmeDurumEnum): Observable<apiResult> {
    var body = { ogrBasvuruIds: ogrBasvuruIds, yerlesme_durumu: durumu };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_placement_status", body);
  }

  topluOgrenciSinavBasvuruDurumGuncelle(ogrBasvuruIds, durumu: OgrenciBasvuruDurumEnum): Observable<apiResult> {
    var body = { ogrBasvuruIds: ogrBasvuruIds, durumu: durumu };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_exam_application_status", body);
  }

  topluOgrenciSinavOdemeDurumGuncelle(ogrBasvuruIds, durumu: TrueFalseEnum): Observable<apiResult> {
    var body = { ogrBasvuruIds: ogrBasvuruIds, odeme_onay: durumu };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_exam_payment_confirmation", body);
  }

  topluOgrenciSinavGirisDurumGuncelle(ogrBasvuruIds, sinav_durumu: any, sinav_durum_aciklama: any): Observable<apiResult> {
    var body = { ogrBasvuruIds: ogrBasvuruIds, sinav_durumu: sinav_durumu, sinav_durum_aciklama: sinav_durum_aciklama };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_exam_entry_status", body);
  }

  topluMerkezeGoreSalonAtama(merkezId: any, basvuruId): Observable<apiResult> {
    var body = { merkezId: merkezId, basvuruId: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "center_class_assignment", body);
  }

  //Başvuruya göre öğrencilerin Listesi
  getBildirimOgrenciList(basvuruId): Observable<apiResult> {
    var body = { basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "notification_student_list", body);
  }

  //Başvuruya göre şablon türlerinin listesi
  getSablonTreeList(parent_id): Observable<apiResult> {
    var body = { parent_id: parent_id };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "report_tree", body);
  }

  //Şablon türlerine göre oluşturulan şablonların listesi
  getSablonlarList(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "report_list", null);
  }

  //Sınavlar alanındaki çıktı alınacak raporları listeleyebilsin.
  getSinavCiktiRaporlarList(basvuruId): Observable<apiResult> {
    var body = { basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "report_exam_get_list", body);
  }

  //Sınavlar alanındaki çıktı alınacak rapor bilgisi.
  getExamReportViewerId() {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "exam_report_viewer", null);
  }

  //Kayıt - güncelleme alanı
  getSaveOrtakBasvuru(data): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "education_save", data);
  }

  getSinavSave(data): Observable<apiResult> {
    data.basvuru_turu = BasvuruTurEnum.sinav;
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "exam_save", data);
  }

  getSinavMerkezSave(data): Observable<apiResult> {
    data.basvuru_turu = BasvuruTurEnum.sinav;
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "exam_center_save", data);
  }

  getSinavSalonSave(data): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "exam_center_class_save", data);
  }

  getBasvuruOgrencilerSave(data): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_education_application_save", data);
  }

  getSinavOgrencilerUpdate(data): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_exam_update", data);
  }

  getSinavOgrencilerResultSave(data): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "student_exam_result_save", data);
  }

  getBasvuruBolumleriSave(datas, basvuruId): Observable<apiResult> {
    var data = { data: datas, basvuru_id: basvuruId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "departments_apply_save", data);
  }

  getBildirimSave(data, basvuruId): Observable<apiResult> {
    data.basvuru_id = basvuruId;
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "notification_save", data);
  }

  getSinavDigerİslemlerUpdate(data): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "other_exam_procedures_update", data);
  }

  getBasvuruDigerİslemlerSave(data): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "other_application_procedures_save", data);
  }

  //Başvuru Bilgileri getirir
  getOrtakBasvuruId(id: number, basvuruTuru) {
    var body = { id: id, basvuru_turu: basvuruTuru }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "education_get", body);
  }

  //Sınav Bilgileri getirir
  getSinavById(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "exam_get", body);
  }

  //Başvuruların Diğer İşlem Bilgilerini getirir
  getDigerBasvuruBilgi(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "other_application_procedures_get", body);
  }

  //Sınavların Diğer İşlem Bilgilerini getirir
  getDigerSinavBilgi(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "other_exam_procedures_get", body);
  }

  //Silme alanı
  getSinavDelete(id: string): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'exam_delete/', body);
  }

  getOrtakBasvuruDelete(id: string, basvuruTuru): Observable<apiResult> {
    var body = { id: id, basvuru_turu: basvuruTuru }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'education_delete/', body);
  }

  getSinavMerkezDelete(id: string): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'exam_center_delete/', body);
  }

  getSinavSalonDelete(id: string): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'exam_center_class_delete/', body);
  }

  getBasvuruBolumleriDelete(id: string): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'departments_apply_delete/', body);
  }

  getBildirimDelete(id: string): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'notification_delete/', body);
  }

  //atamayap
  getAtamaYap(basvuru_id, egitim_donemi_id): Observable<apiResult> {
    var body = { basvuru_id: basvuru_id, egitim_donemi_id: egitim_donemi_id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "make_preference_assignments", body);
  }

  //atamayap
  getAtamayiGeriAl(basvuru_id): Observable<apiResult> {
    var body = { basvuru_id: basvuru_id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "revert_preference_assignments", body);
  }



}

