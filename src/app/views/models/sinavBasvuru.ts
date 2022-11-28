export class SinavBasvuru{
     
    id	:number;
    egitim_donemi_id	:number;
    adi_tr	:string;
    adi_en	:string;
    baslangic_tarihi	:string;
    bitis_tarihi	:string;
    dil_bilgisi_durumu	:boolean;
    vize_bilgisi_durumu	:boolean;
    ucret	:number;
    ucret_zamani	:string;
    ucret_odeme_turu	:string;
    ucret_son_odeme_tarihi	:string;
    odeme_bankasi	:string;
    ucret_aciklama_tr	:string;
    ucret_aciklama_en	:string;
    basvuru_turu:number = 1;
    uyruk_bilgisi_durumu	:string;
    kayit_turu_durumu	:string;
    kullanim_kosulu_metni_tr	:string;
    kullanim_kosulu_metni_en	:string;
    durumu	:boolean;
    soru_sayisi :number;
    sinav_tarihi:string;
    sinav_suresi:number;
    //sinav_belgesi_aciklama_tr:string;
    //sinav_belgesi_aciklama_en:string;

}


export class SinavBasvuruList{

adi_en: string;
adi_tr: string;
baslangic_tarihi: string;
basvuran_ogrenci_sayisi: number;
bitis_tarihi: string;
durumu: boolean;
id: number;
sinav_tarihi: string;
sinava_giren_ogrenci_sayisi: number;
sonuclari_goster: boolean;
ucret: number;
data:any[]=[];
}



