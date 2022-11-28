export class SdataModel {
 token: string = '';
 site: Site = new Site();
 user: User = new User();
}

export class Site {
	 adi_en:string = '';
	 adi_tr: string = '';
	 default_dil: string = '';
	 logo_url:string = '';
	 kisa_adi:string = '';
}

export class User {
	 adi_soyadi:string = '';
	 eposta: string = '';
	 uid:string="";
}


