export class birimBasvuru {
    id: number;
    basvuru_turu: string;
    egitim_donemi_id: number;
    adi_tr: string;
    adi_en: string;
    baslangic_tarihi: string;
    bitis_tarihi: string;
    dil_bilgisi_durumu: boolean;
    vize_bilgisi_durumu: boolean;
    ucret: number;
    ucret_zamani: string;
    ucret_odeme_turu: string;
    ucret_son_odeme_tarihi: string;
    odeme_bankasi: string;
    ucret_aciklama_tr: string;
    ucret_aciklama_en: string;
    uyruk_bilgisi_durumu: string;
    kayit_turu_durumu: string;
    kullanim_kosulu_metni_tr: string;
    kullanim_kosulu_metni_en: string;
    durumu: boolean;
}

export class birimBasvuruList {
    id: number;
    adi_tr: string;
    adi_en: string;
    baslangic_tarihi: string;
    bitis_tarihi: string;
    ucret: number;
    durumu: boolean;
    // basvuran_ogrenci_saiyisi:number;
    // yerlesen_ogrenci_saiyisi:number;
    basvuran_ogrenci_sayisi: number;
    yerlesen_ogrenci_sayisi: number;
    data: any[] = [];
}


