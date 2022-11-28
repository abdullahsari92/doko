import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class KurumTanimService extends BaseCrudService {
  headers: any
  apiUrl = "admin/corporation/";
  constructor(
    protected dokoSettingsService: DokoSettingsService,
    protected http: HttpClient,
    protected localStorageService: LocalStorageService
  ) {
    super(dokoSettingsService, http, 'admin/corporation/');

  }





}
