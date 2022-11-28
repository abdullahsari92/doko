// Angular
import {AfterViewInit,ChangeDetectionStrategy,ChangeDetectorRef,Component,DoCheck,ElementRef,OnInit,Renderer2} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter, finalize, map, takeUntil, tap } from 'rxjs/operators';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import {LayoutConfigService,MenuConfigService,MenuHorizontalService,MenuOptions,OffcanvasOptions} from '../../../../core/_base/layout';
// HTML Class
import { HtmlClassService } from '../../html-class.service';
import { YetkiTanimService } from '../../../../views/services/yetki-tanim.service';
import { AuthModel } from '../../../../core/models/authModel';
import { YetkiGrupEnum } from '../../../../core/Enums/yetkiGrupEnum';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { Subject } from 'rxjs';
import { subtract } from 'lodash';
import { tokenModel } from '../../../../core/models/tokenModel';
import { promise } from 'protractor';

@Component({
	selector: 'kt-menu-horizontal',
	templateUrl: './menu-horizontal.component.html',
	styleUrls: ['./menu-horizontal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHorizontalComponent implements OnInit, AfterViewInit {
	// Public properties
	menuDisplay=false;
	currentRouteUrl: any = '';
	tokenmodel:tokenModel = new tokenModel();

	menuList:any[]=[];
	yetkisiOlanGrupAdlari:any;
	rootArrowEnabled: boolean;
	menuOptions: MenuOptions = {
		submenu: {
			desktop: 'dropdown',
			tablet: 'accordion',
			mobile: 'accordion'
		},
		accordion: {
			slideSpeed: 200, // accordion toggle slide speed in milliseconds
			expandAll: false // allow having multiple expanded accordions in the menu
		},
		dropdown: {
			timeout: 50
		}
	};

	offcanvasOptions: OffcanvasOptions = {
		overlay: true,
		baseClass: 'kt-header-menu-wrapper',
		closeBy: 'kt_header_menu_mobile_close_btn',
		toggleBy: {
			target: 'kt_header_mobile_toggler',
			state: 'kt-header-mobile__toolbar-toggler--active'
		}
	};
	private unsubscribe: Subject<any>;

	/**
	 * Component Conctructor
	 *
	 * @param el: ElementRef
	 * @param htmlClassService: HtmlClassService
	 * @param menuHorService: MenuHorService
	 * @param menuConfigService: MenuConfigService
	 * @param layoutConfigService: LayouConfigService
	 * @param router: Router
	 * @param render: Renderer2
	 * @param cdr: ChangeDetectorRef
	 */
	constructor(
		private el: ElementRef,
		public htmlClassService: HtmlClassService,
		public menuHorService: MenuHorizontalService,
		private menuConfigService: MenuConfigService,
		private layoutConfigService: LayoutConfigService,
		private router: Router,
		private render: Renderer2,
		private cdr: ChangeDetectorRef,
		private yetkiTanimService: YetkiTanimService,
		private localStorageService:LocalStorageService

	) {
		this.unsubscribe = new Subject();

	}
	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
	this.menuDisplay = true;
	}

	/**
	 * On init
	 */
	ngOnInit(): void {

		//this.getYetkiler();


		this.rootArrowEnabled = this.layoutConfigService.getConfig('header.menu.self.root-arrow');

		this.currentRouteUrl = this.router.url;
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				this.currentRouteUrl = this.router.url;
	
			

				this.cdr.markForCheck();
			});
			//console.log(' menu horizontal girdi')
	}


	yetkiGrup = YetkiGrupEnum;
	getMenus()
	{


		this.menuHorService.menuList$.asObservable().subscribe(menus=>{
		
				this.yetkisiOlanGrupAdlari =this.authModelList.filter(p=>p.yetki==1).map(r=>r.grup_adi);	

				menus = this.menuListYetkiKontorl(menus,this.yetkisiOlanGrupAdlari);	


				//   this.menuHorService.loadMenuItems(this.menuList);
				
	 
		});					
	}

	menuListYetkiKontorl(menus:any[],yetkisiOlanGrupAdlari:any)
	{
		var newMenu =[];
		menus.forEach(menu => {		
			
			var menuYetkivar =	yetkisiOlanGrupAdlari.find( f  => f ==this.getKeyByValue(menu.authorityGroup))
	    				
				if(menuYetkivar)
				{
					newMenu.push(menu);

				 	if(menu.submenu &&menu.submenu.length>0)
						{
							menu.submenu =	this.menuListYetkiKontorl(menu.submenu,this.yetkisiOlanGrupAdlari);
						}
				}	
		});
		return newMenu;
	}
	isMenuAuth(menu:any):boolean
	{

		this.getMenuYetki();
		var menuYetkivar =	this.yetkisiOlanGrupAdlari?.find( f  => f ==this.getKeyByValue(menu.authorityGroup))

		if(menuYetkivar || this.tokenmodel.user.super_user==1) return true;else return false;

	}
	//bu method grid 
	 getKeyByValue(value: string) {
		const indexOfS = Object.values(YetkiGrupEnum).indexOf(value as unknown as YetkiGrupEnum);
	  
		const key = Object.keys(YetkiGrupEnum)[indexOfS];
	  
	//	console.log(value +" => ",key)
		return key;
	  }
	/**
	 * Return Css Class Name
	 * @param item: any
	 */
	getItemCssClasses(item) {
		let classes = 'kt-menu__item';

		if (objectPath.get(item, 'submenu')) {
			classes += ' kt-menu__item--submenu';
		}

		if (!item.submenu && this.isMenuItemIsActive(item)) {
			classes += ' kt-menu__item--active kt-menu__item--here';
		}

		if (item.submenu && this.isMenuItemIsActive(item)) {
			classes += ' kt-menu__item--open kt-menu__item--here';
		}

		if (objectPath.get(item, 'resizer')) {
			classes += ' kt-menu__item--resize';
		}

		const menuType = objectPath.get(item, 'submenu.type') || 'classic';
		if ((objectPath.get(item, 'root') && menuType === 'classic')
			|| parseInt(objectPath.get(item, 'submenu.width'), 10) > 0) {
			classes += ' kt-menu__item--rel';
		}

		const customClass = objectPath.get(item, 'custom-class');
		if (customClass) {
			classes += ' ' + customClass;
		}

		if (objectPath.get(item, 'icon-only')) {
			classes += ' kt-menu__item--icon-only';
		}

		return classes;
	}

	/**
	 * Returns Attribute SubMenu Toggle
	 * @param item: any
	 */
	getItemAttrSubmenuToggle(item) {
		let toggle = 'hover';
		if (objectPath.get(item, 'toggle') === 'click') {
			toggle = 'click';
		} else if (objectPath.get(item, 'submenu.type') === 'tabs') {
			toggle = 'tabs';
		} else {
			// submenu toggle default to 'hover'
		}

		return toggle;
	}

	/**
	 * Returns Submenu CSS Class Name
	 * @param item: any
	 */
	getItemMenuSubmenuClass(item) {
		let classes = '';

		const alignment = objectPath.get(item, 'alignment') || 'right';

		if (alignment) {
			classes += ' kt-menu__submenu--' + alignment;
		}

		const type = objectPath.get(item, 'type') || 'classic';
		if (type === 'classic') {
			classes += ' kt-menu__submenu--classic';
		}
		if (type === 'tabs') {
			classes += ' kt-menu__submenu--tabs';
		}
		if (type === 'mega') {
			if (objectPath.get(item, 'width')) {
				classes += ' kt-menu__submenu--fixed';
			}
		}

		if (objectPath.get(item, 'pull')) {
			classes += ' kt-menu__submenu--pull';
		}

		return classes;
	}

	/**
	 * Check Menu is active
	 * @param item: any
	 */
	isMenuItemIsActive(item): boolean {
		if (item.submenu) {
			return this.isMenuRootItemIsActive(item);
		}

		if (!item.page) {
			return false;
		}

		return this.currentRouteUrl.indexOf(item.page) !== -1;
	}

	/**
	 * Check Menu Root Item is active
	 * @param item: any
	 */
	isMenuRootItemIsActive(item): boolean {
		if (item.submenu.items) {
			for (const subItem of item.submenu.items) {
				if (this.isMenuItemIsActive(subItem)) {
					return true;
				}
			}
		}

		if (item.submenu.columns) {
			for (const subItem of item.submenu.columns) {
				if (this.isMenuItemIsActive(subItem)) {
					return true;
				}
			}
		}

		if (typeof item.submenu[Symbol.iterator] === 'function') {
			for (const subItem of item.submenu) {
				const active = this.isMenuItemIsActive(subItem);
				if (active) {
					return true;
				}
			}
		}

		return false;
	}

	
	authModelList:AuthModel[]=[];
	getYetkiler(): Promise<{}>
	{
      return new Promise((resolve, reject) =>{


			var tokenmodel = this.localStorageService.getItem("tokenModel") as tokenModel;
			if(!this.localStorageService.getItem("getAuthCanView"))
			{
				this.yetkiTanimService.getAuthCanView(tokenmodel.user.rol_id).subscribe(res => {
					if(res.result)
					{
						this.authModelList= res.data;
						this.localStorageService.setItem("getAuthCanView",this.authModelList);
						this.getMenus();
					}
					})
			}
			else{
				this.authModelList = this.localStorageService.getItem("getAuthCanView");
				this.getMenus();
			}	

			setTimeout(() => {
				resolve(true);
			  }, 500);			 

		   });
	
		
	}

	getMenuYetki()
	{
     
		this.tokenmodel = this.localStorageService.getItem("tokenModel") as tokenModel;


			if(!this.localStorageService.getItem("getAuthCanView"))
			{
				this.yetkiTanimService.getAuthCanView(this.tokenmodel.user.rol_id).subscribe(res => {
					if(res.result)
					{
						this.authModelList= res.data;
						this.localStorageService.setItem("getAuthCanView",this.authModelList);	
          this.yetkisiOlanGrupAdlari =this.authModelList.filter(p=>p.yetki==1).map(r=>r.grup_adi);	

					}
					})
			}
			else{
				this.authModelList = this.localStorageService.getItem("getAuthCanView");	
				this.yetkisiOlanGrupAdlari =this.authModelList.filter(p=>p.yetki==1).map(r=>r.grup_adi);	

			}	
 
		
	}

}
