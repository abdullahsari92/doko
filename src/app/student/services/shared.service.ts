import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private basvuru_turu:number;
    private subject = new Subject<any>();
    private image_url:string;
    private subject2 = new Subject<any>();
    selectedProduct = this.subject.asObservable();
    selectedProduct2 = this.subject2.asObservable();

    sendClickEvent(basvuru_tur:number) {
        this.basvuru_turu= basvuru_tur;
        this.subject.next(this.basvuru_turu);
    }
    sendImageEvent(imageUrl:string) {
        this.image_url= imageUrl;
        this.subject2.next(this.image_url);
    }
    /* getClickEvent(): Observable<any> {
        return 
    } */
}