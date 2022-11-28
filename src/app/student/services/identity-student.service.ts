import { Injectable } from '@angular/core';
import { DokoSettingsService } from '../../core/services/doko-settings.service';


@Injectable({
  providedIn: 'root'
})
export class IdentityStudentService {


  constructor(
    private dokoSettingsService: DokoSettingsService,

  ) { }

  set(token: any): void {
    this.remove();
    sessionStorage.setItem(this.dokoSettingsService.studentTokenKey, token);
  }

  get(): string {
    return sessionStorage.getItem(this.dokoSettingsService.studentTokenKey);
  }


  remove(): void {
    sessionStorage.removeItem(this.dokoSettingsService.studentTokenKey);
    localStorage.removeItem('loggedUserModel');
  }

  isLogged(): boolean {
    let token = this.get();
    if (token != null && token.length > 0) {
      return true;
    }
    return false;
  }
}
