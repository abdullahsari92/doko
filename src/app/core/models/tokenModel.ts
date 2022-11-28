import { StringNullableChain } from "lodash";

export class  tokenModel{
 
   token:string;
   kullaniciAdi:string;
   site:site = new site();
   user:user = new user();
   result:boolean;
}

export class  site{
 
   adi_en:string;
   adi_tr: string;
   default_dil: string;
   kisa_adi:string;
   logo_url:string;
}

export class  user{
 
   adi_soyadi: string;
   auths:string;
   eposta:string;
   rol_id:number;
   super_user:number;
   kurum_id:number;
}


// token,site,user dolu olan alanı kapattım 
// export class  tokenModel{
 
//    token:string="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE2MjE4NDQxMTEsImlhdCI6MTYyMTg0NDExMSwidXNlciI6eyJ1c2VyX3VpZCI6ImhmYTZzd2kzYXVqZ2p4M2p2Mmk4In19.A1NZykBVaXLmGOydiUxpA0B8wIxs595JyotN15AAEzc";
//    kullaniciAdi:string="abdullah.sari";
//    site:site = new site();
//    user:user = new user();
//    result:boolean;
// }

// export class  site{
 
//    adi_en:string="abdullah";
//    adi_tr: string="abdullah";
//    default_dil: string="sarı";
//    kisa_adi:string;
//    logo_url:string="";
// }

// export class  user{
 
//    adi_soyadi: string="abdullah.sari";
//    auths:string;
//    eposta:string="abdullah.sari@dpu.edu.tr";
// }











// {
//    "result": true,
//    "data": {
//      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE2MzQ3MTQ0MDksImlhdCI6MTYzNDcxNDQwOSwidXNlciI6eyJ1c2VyX3VpZCI6InhtZGh2eTg0OHlhZmdtdzZlbmdjIn19.U2ZmWghvuNm8jDEVDS4qdUkGd-9JJHhRLhsIqC81MjQ",
//      "site": {
//        "logo_url": "https:\/\/dokoapi.dpu.edu.tr\/\/uploads\/3\/logo_url.png",
//        "default_dil": "tr",
//        "kisa_adi": "doko",
//        "adi_tr": "DOKO Test Birimi",
//        "adi_en": "DOKO Test Birimi"
//      },
//      "user": {
//        "eposta": "abdullah.sari@dpu.edu.tr",
//        "adi_soyadi": "Abdullah SARI",
//        "auths": "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110"
//      }
//    }
//  }
 