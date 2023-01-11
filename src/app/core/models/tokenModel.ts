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
