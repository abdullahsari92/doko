import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { birimBasvuru } from '../models/birimBasvuru';
import { SinavBasvuru } from '../models/sinavBasvuru';

@Injectable({
  providedIn: 'root'
})
export class BasvuruSubjectService {

  private birimBasvuruSubject = new BehaviorSubject<birimBasvuru>(new birimBasvuru());
  private sinavBasvuruSubject = new BehaviorSubject<SinavBasvuru>(new SinavBasvuru());

  currentBirim = this.birimBasvuruSubject.asObservable();
  currentSinav = this.sinavBasvuruSubject.asObservable();

  constructor() { }

  basvuruDegistir(birimBasvuru: birimBasvuru) {
    this.birimBasvuruSubject.next(birimBasvuru);
  }

  sinavDegistir(sinavBasvuru: SinavBasvuru) {
    this.sinavBasvuruSubject.next(sinavBasvuru);
  }

}
