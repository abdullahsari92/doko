import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toTextCamelCase'
})
export class ToTextCamelCasePipe implements PipeTransform {

  transform(str: string): string {


        var i:number; 
    
        var kelimeler = str.split('_');  
        str = '';
        var bosluk = kelimeler.length;
    
        for(i = 0 ;i<bosluk;i++) {
    
          kelimeler[i] =kelimeler[i].substr(0,1).toLocaleUpperCase() + kelimeler[i].substr(1).toLocaleLowerCase();
          
          str += kelimeler[i] + ' ';
        }

       return str;
  

  }

}
