import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { BaseCrudService } from './base-crud.service';
import { Observable } from 'rxjs';
import { apiResult } from '../../core/models/apiResult';
@Injectable({
  providedIn: 'root'
})
export class DilTanimService extends BaseCrudService {
  headers: any
  apiUrl = "admin/language/";
  constructor(
    protected dokoSettingsService: DokoSettingsService =  inject(DokoSettingsService),
    protected http: HttpClient = inject(HttpClient),
    protected localStorageService: LocalStorageService =inject(LocalStorageService)
  ) {
    super(dokoSettingsService, http, 'admin/language/');

  }


}



// 2
// 3
// 4
// 5
// @Directive()
// export abstract class BaseComponent {
//   protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
//   protected readonly router: Router = inject(Router);
// }
