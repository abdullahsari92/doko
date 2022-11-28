
export class  apiSetting{
   adi_en: string="";
   adi_tr: string="";
   birim_uid: string="";
   default_dil: string="";
   logo_url: string="";
   iptal_iade_kosullari_url: string="";

   setting:Setting=new Setting()
}

export class Setting{

   langVersion:string=""
}