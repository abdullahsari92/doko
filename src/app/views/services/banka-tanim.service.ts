import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { BaseCrudTestService } from './base-crud-test.service';

@Injectable({
  providedIn: 'root'
})
export class BankaTanimService extends BaseCrudTestService {
  headers: any
  apiUrl = "admin/bank/";
  constructor(
    protected dokoSettingsService: DokoSettingsService,
    protected http: HttpClient,
    protected localStorageService: LocalStorageService
  ) {
    super( 'admin/bank/');

  }





}
