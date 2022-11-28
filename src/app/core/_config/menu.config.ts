import { YetkiGrupEnum } from "../Enums/yetkiGrupEnum";

export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Dashboards',
					root: true,
					alignment: 'left',
					page: 'dashboard',
					translate: 'MENU.DASHBOARD',
					authorityGroup: YetkiGrupEnum.dashboard,
				},
				{
					title: 'Genel',
					root: true,
					bullet: 'dot',
					icon: 'flaticon-interface-7',
					alignment: 'left',
					toggle: 'click',
					translate: 'MENU.GENERAL_MANAGEMENT',
					authorityGroup: YetkiGrupEnum.menuGeneralManagement,
					submenu: [
						{
							title: 'banka',
							page: 'genel_yonetim/banka',
							translate: 'MENU.BANK',
							authorityGroup: YetkiGrupEnum.banka
						},
						{
							title: 'birim',
							page: 'genel_yonetim/birim',
							translate: 'MENU.UNIT',
							authorityGroup: YetkiGrupEnum.birim
						},
						{
							title: 'dil',
							page: 'genel_yonetim/dil',
							translate: 'MENU.LANGUAGE',
							authorityGroup: YetkiGrupEnum.dil							
						},
						{
							title: 'konsolosluk',
							page: 'genel_yonetim/konsolosluk',
							translate: 'MENU.CONSULATE',
							authorityGroup: YetkiGrupEnum.konsolosluk
						},
						{
							title: 'Kullanici',
							page: 'genel_yonetim/kullanici',
							translate: 'MENU.USER',
							authorityGroup: YetkiGrupEnum.kullanici
						},
						{
							title: 'Kurum',
							page: 'genel_yonetim/kurum',
							translate: 'MENU.CORPORATION',
							authorityGroup: YetkiGrupEnum.kurum
						},
						{
							title: 'Ulke',
							page: 'genel_yonetim/ulke',
							translate: 'MENU.COUNTRY',
							authorityGroup: YetkiGrupEnum.ulke
						},
						{
							title: 'yetki',
							page: 'genel_yonetim/yetki',
							translate: 'MENU.AUTHORITY',
							authorityGroup: YetkiGrupEnum.yetki
						},
						{
							title: 'settings',
							page: 'genel_yonetim/settings',
							translate: 'MENU.SETTINGS',
							authorityGroup: YetkiGrupEnum.settings
						},
					]
				},
				{
					title: 'Ogrenci',
					root: true,
					alignment: 'left',
					page: 'ogrenci',
					translate: 'MENU.STUDENT',
					authorityGroup: YetkiGrupEnum.menuStudent,
				},
				{
					title: 'Birim',
					root: true,
					bullet: 'dot',
					icon: 'flaticon-interface-7',
					alignment: 'left',
					toggle: 'click',
					translate: 'MENU.UNIT_MANAGEMENT',
					authorityGroup: YetkiGrupEnum.menuUnitManagement,
					submenu: [
						{
							title: 'bolum',
							page: 'birim_yonetim/bolum/list',
							translate: 'MENU.DEPARTMENT',
							authorityGroup: YetkiGrupEnum.birimBolumleri
						},
						{
							title: 'DilSinav',
							page: 'birim_yonetim/dil-sinav/list',
							translate: 'MENU.LANGUAGE_EXAM',
							authorityGroup: YetkiGrupEnum.birimDilSinavlari
						},
						{
							title: 'training',
							page: 'birim_yonetim/egitim-donemi/list',
							translate: 'MENU.TRAINING_PERIOD',
							authorityGroup: YetkiGrupEnum.birimEgitimDonemleri
						},
						{
							title: 'fakulte',
							page: 'birim_yonetim/fakulte/list',
							translate: 'MENU.FACULTY',
							authorityGroup: YetkiGrupEnum.birimFakulteleri
						},
						{
							title: 'language',
							page: 'birim_yonetim/istenen-diller/list',
							translate: 'MENU.LANGUAGE_REQUIRED',
							authorityGroup: YetkiGrupEnum.birimDilleri
						},
						{
							title: 'registration',
							page: 'birim_yonetim/kayit-turleri/list',
							translate: 'MENU.REGISTRATION_TOURS',
							authorityGroup: YetkiGrupEnum.birimKabulKosullari
						},
						{
							title: 'score',
							page: 'birim_yonetim/puan-turleri/list',
							translate: 'MENU.SCORE_TOURS',
							authorityGroup: YetkiGrupEnum.birimPuanTurleri
						},
						{
							title: 'Sablon',
							page: 'birim_yonetim/sablon/list',
							translate: 'MENU.PATTERN',
							authorityGroup: YetkiGrupEnum.birimSablon
						}
					]
				},
				{
					title: 'basvuru',
					root: true,
					bullet: 'dot',
					icon: 'flaticon-interface-7',
					alignment: 'left',
					toggle: 'click',
					translate: 'MENU.RECOURSE',
					authorityGroup: YetkiGrupEnum.menuRecourse,
					submenu: [
						{
							title: 'basuvuru',
							page: 'basvuru/sinav-basvuru',
							translate: 'MENU.EXAM_APPLICATION',
							authorityGroup: YetkiGrupEnum.bSinav
						},
						{
							title: 'lisans',
							page: 'basvuru/lisans-basvuru',
							translate: 'MENU.LICENSE_APPLICATION',
							authorityGroup: YetkiGrupEnum.bLisans

						},
						{
							title: 'Yüksek Lisans',
							page: 'basvuru/yuksek-lisans-basvuru',
							translate: 'MENU.GRADUATE_APPLICATION',
							authorityGroup: YetkiGrupEnum.bYuksekLisans
						},
						{
							title: 'doktora',
							page: 'basvuru/doktora-basvuru',
							translate: 'MENU.DOCTORAL_APPLICATION',
							authorityGroup: YetkiGrupEnum.bDoktora
						},
						{
							title: 'girisUcreti',
							page: 'basvuru/giris-ucreti-basvuru',
							translate: 'MENU.ENTRANCE_FEE_APPLICATION',
							authorityGroup: YetkiGrupEnum.bGirisUcreti
						},
					]
				},
			]
		},

		// aside: {
		// 	self: {},
		// 	items: [
		// 		{
		// 			title: 'Dashboard',
		// 			root: true,
		// 			icon: 'flaticon2-architecture-and-city',
		// 			page: '/dashboard',
		// 			translate: 'MENU.DASHBOARD',
		// 			bullet: 'dot',
		// 		},
		// 		{
		// 			title: 'Layout Builder',
		// 			root: true,
		// 			icon: 'flaticon2-expand',
		// 			page: '/builder'
		// 		},
		// 		{section: 'Components'},
		// 		{
		// 			title: 'Google Material',
		// 			root: true,
		// 			bullet: 'dot',
		// 			icon: 'flaticon2-browser-2',
		// 			submenu: [
		// 				{
		// 					title: 'Form Controls',
		// 					bullet: 'dot',
		// 					submenu: [
		// 						{
		// 							title: 'Auto Complete',
		// 							page: '/material/form-controls/autocomplete',
		// 							permission: 'accessToECommerceModule'
		// 						},
		// 						{
		// 							title: 'Checkbox',
		// 							page: '/material/form-controls/checkbox'
		// 						},
		// 						{
		// 							title: 'Radio Button',
		// 							page: '/material/form-controls/radiobutton'
		// 						},
		// 						{
		// 							title: 'Datepicker',
		// 							page: '/material/form-controls/datepicker'
		// 						},
		// 						{
		// 							title: 'Form Field',
		// 							page: '/material/form-controls/formfield'
		// 						},
		// 						{
		// 							title: 'Input',
		// 							page: '/material/form-controls/input'
		// 						},
		// 						{
		// 							title: 'Select',
		// 							page: '/material/form-controls/select'
		// 						},
		// 						{
		// 							title: 'Slider',
		// 							page: '/material/form-controls/slider'
		// 						},
		// 						{
		// 							title: 'Slider Toggle',
		// 							page: '/material/form-controls/slidertoggle'
		// 						}
		// 					]
		// 				},
		// 				{
		// 					title: 'Navigation',
		// 					bullet: 'dot',
		// 					submenu: [
		// 						{
		// 							title: 'Menu',
		// 							page: '/material/navigation/menu'
		// 						},
		// 						{
		// 							title: 'Sidenav',
		// 							page: '/material/navigation/sidenav'
		// 						},
		// 						{
		// 							title: 'Toolbar',
		// 							page: '/material/navigation/toolbar'
		// 						}
		// 					]
		// 				},
		// 				{
		// 					title: 'Layout',
		// 					bullet: 'dot',
		// 					submenu: [
		// 						{
		// 							title: 'Card',
		// 							page: '/material/layout/card'
		// 						},
		// 						{
		// 							title: 'Divider',
		// 							page: '/material/layout/divider'
		// 						},
		// 						{
		// 							title: 'Expansion panel',
		// 							page: '/material/layout/expansion-panel'
		// 						},
		// 						{
		// 							title: 'Grid list',
		// 							page: '/material/layout/grid-list'
		// 						},
		// 						{
		// 							title: 'List',
		// 							page: '/material/layout/list'
		// 						},
		// 						{
		// 							title: 'Tabs',
		// 							page: '/material/layout/tabs'
		// 						},
		// 						{
		// 							title: 'Stepper',
		// 							page: '/material/layout/stepper'
		// 						},
		// 						{
		// 							title: 'Default Forms',
		// 							page: '/material/layout/default-forms'
		// 						},
		// 						{
		// 							title: 'Tree',
		// 							page: '/material/layout/tree'
		// 						}
		// 					]
		// 				},
		// 				{
		// 					title: 'Buttons & Indicators',
		// 					bullet: 'dot',
		// 					submenu: [
		// 						{
		// 							title: 'Button',
		// 							page: '/material/buttons-and-indicators/button'
		// 						},
		// 						{
		// 							title: 'Button toggle',
		// 							page: '/material/buttons-and-indicators/button-toggle'
		// 						},
		// 						{
		// 							title: 'Chips',
		// 							page: '/material/buttons-and-indicators/chips'
		// 						},
		// 						{
		// 							title: 'Icon',
		// 							page: '/material/buttons-and-indicators/icon'
		// 						},
		// 						{
		// 							title: 'Progress bar',
		// 							page: '/material/buttons-and-indicators/progress-bar'
		// 						},
		// 						{
		// 							title: 'Progress spinner',
		// 							page: '/material/buttons-and-indicators/progress-spinner'
		// 						},
		// 						{
		// 							title: 'Ripples',
		// 							page: '/material/buttons-and-indicators/ripples'
		// 						}
		// 					]
		// 				},
		// 				{
		// 					title: 'Popups & Modals',
		// 					bullet: 'dot',
		// 					submenu: [
		// 						{
		// 							title: 'Bottom sheet',
		// 							page: '/material/popups-and-modals/bottom-sheet'
		// 						},
		// 						{
		// 							title: 'Dialog',
		// 							page: '/material/popups-and-modals/dialog'
		// 						},
		// 						{
		// 							title: 'Snackbar',
		// 							page: '/material/popups-and-modals/snackbar'
		// 						},
		// 						{
		// 							title: 'Tooltip',
		// 							page: '/material/popups-and-modals/tooltip'
		// 						}
		// 					]
		// 				},
		// 				{
		// 					title: 'Data table',
		// 					bullet: 'dot',
		// 					submenu: [
		// 						{
		// 							title: 'Paginator',
		// 							page: '/material/data-table/paginator'
		// 						},
		// 						{
		// 							title: 'Sort header',
		// 							page: '/material/data-table/sort-header'
		// 						},
		// 						{
		// 							title: 'Table',
		// 							page: '/material/data-table/table'
		// 						}
		// 					]
		// 				}
		// 			]
		// 		},

		// 		{section: 'Applications'},
		// 		{
		// 			title: 'eCommerce',
		// 			bullet: 'dot',
		// 			icon: 'flaticon2-list-2',
		// 			root: true,
		// 			permission: 'accessToECommerceModule',
		// 			submenu: [
		// 				{
		// 					title: 'Customers',
		// 					page: '/ecommerce/customers'
		// 				},
		// 				{
		// 					title: 'Products',
		// 					page: '/ecommerce/products'
		// 				},
		// 			]
		// 		},
		// 		{
		// 			title: 'User Management abdullah',
		// 			root: true,
		// 			bullet: 'dot',
		// 			icon: 'flaticon2-user-outline-symbol',
		// 			submenu: [
		// 				{
		// 					title: 'Users',
		// 					page: '/user-management/users'
		// 				},
		// 				{
		// 					title: 'Roles',
		// 					page: '/user-management/roles'
		// 				}
		// 			]
		// 		},
		// 		{section: 'Custom'},
		// 		{
		// 			title: 'Error Pages',
		// 			root: true,
		// 			bullet: 'dot',
		// 			icon: 'flaticon2-list-2',
		// 			submenu: [
		// 				{
		// 					title: 'Error 1',
		// 					page: '/error/error-v1'
		// 				},
		// 				{
		// 					title: 'Error 2',
		// 					page: '/error/error-v2'
		// 				},
		// 				{
		// 					title: 'Error 3',
		// 					page: '/error/error-v3'
		// 				},
		// 				{
		// 					title: 'Error 4',
		// 					page: '/error/error-v4'
		// 				},
		// 				{
		// 					title: 'Error 5',
		// 					page: '/error/error-v5'
		// 				},
		// 				{
		// 					title: 'Error 6',
		// 					page: '/error/error-v6'
		// 				},
		// 			]
		// 		},
		// 		{
		// 			title: 'Wizard',
		// 			root: true,
		// 			bullet: 'dot',
		// 			icon: 'flaticon2-mail-1',
		// 			submenu: [
		// 				{
		// 					title: 'Wizard 1',
		// 					page: '/wizard/wizard-1'
		// 				},
		// 				{
		// 					title: 'Wizard 2',
		// 					page: '/wizard/wizard-2'
		// 				},
		// 				{
		// 					title: 'Wizard 3',
		// 					page: '/wizard/wizard-3'
		// 				},
		// 				{
		// 					title: 'Wizard 4',
		// 					page: '/wizard/wizard-4'
		// 				},
		// 			]
		// 		},
		// 	]
		// },
	};

	public get configs(): any {
		return this.defaults;
	}
}
