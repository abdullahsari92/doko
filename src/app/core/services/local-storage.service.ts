import { Injectable } from '@angular/core';
import { loginModel } from '../models/loginModel';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}
  loginModel: loginModel;
  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify({ objectName: value }));
  }
  getItem(key: string): any {
    const items = JSON.parse(localStorage.getItem(key));
    return items == null ? null : items.objectName;
  }
  removeItem(key: string) {
    localStorage.removeItem(key);
  }


  setObjectItems(fullPath:string,value:any)
  {
  
    let path = fullPath.split(".")[0];
    let arrayName = fullPath.split(".")[1];
    var yeniDizi:any;
       var anaDizi:any[] = this.getItem(path);
  

       var eklenecekDizi = {[arrayName]:value};
       if(anaDizi)
       {
         yeniDizi= {...anaDizi,...eklenecekDizi}
       }
       else{
        yeniDizi= {...eklenecekDizi}
       }
    

    this.setItem(path,yeniDizi)
  }

  getObjectItems(fullPath:string):any
  {
    let path = fullPath.split(".")[0];
    let arrayName = fullPath.split(".")[1];

    var anaDizi:any[] = this.getItem(path);

    if(anaDizi)       
      return anaDizi[arrayName];
   
    
  }

}
