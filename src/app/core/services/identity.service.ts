import { Injectable } from '@angular/core';
import { tokenModel } from '../models/tokenModel';
import {  DokoSettingsService } from './doko-settings.service';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {


  constructor(
    private dokoSettingsService: DokoSettingsService,

  ) { }

  set(tokenmodel:tokenModel): void {
    this.remove();
    // sessionStorage.setItem(this.dokoSettingsService.tokenKey, tokenmodel.token); //burası tek sekmede saklıyor
     localStorage.setItem(this.dokoSettingsService.tokenKey, tokenmodel.token);
  }

  get(): string {
    return localStorage.getItem(this.dokoSettingsService.tokenKey);
  
    // return sessionStorage.getItem(this.dokoSettingsService.tokenKey);
  } 

  getSession(): string {
    return sessionStorage.getItem(this.dokoSettingsService.sessionKey);
    
  }  

  remove(): void {
    localStorage.removeItem(this.dokoSettingsService.tokenKey);

    localStorage.removeItem('tokenModel');
    localStorage.removeItem('getAuthCanView');

    // localStorage.removeItem(this.appSettings.tokenKey);
  }

  isLogged(): boolean {
    if (this.get() != null) {
      if (this.get().length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
      
    }
  }
}
