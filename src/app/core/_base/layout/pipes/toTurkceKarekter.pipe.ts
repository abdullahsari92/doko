import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'turkceKarekterPipe'
})
export class ToTurkceKarekterPipe implements PipeTransform {

  transform(text: string): string {


    text = text.replace("I","İ");
    text = text.replace("i","ı");
    text = text.replace("G","Ğ");
    text = text.replace("g","ğ");
    text = text.replace("O","Ö");
    text = text.replace("o","ö");
    text = text.replace("U","Ü");
    text = text.replace("u","ü");
    text = text.replace("S","Ş");
    text = text.replace("s","ş");
    text = text.replace("C","Ç");
    text = text.replace("c","ç");
    text = text.replace("_"," ");
    return text;

 

  }

}
