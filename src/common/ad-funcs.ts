import React from 'react';
import { PageVars, StaticVars } from '../static/static-vars';
import { Engine } from './engine';
import {
	selectCity as selectCityAction,
	selectProv as selectProvAction,
	selectItem as selectItemAction,
	selectCat as selectCatAction,
	expandCity as expandCityAction,
	expandProv as expandProvAction,
	expandItem as expandItemAction,
	expandCat as expandCatAction,
	updateStateModelData,
	saveStateObjects
} from '../action';

type Identifier = string | number;
export type SearchMode = '' | 'Search';
type Language = 'en' | 'cn';

interface AdOption {
	i: Identifier;
	n: Record<Language, string>;
	c?: AdOption[];
	s?: Record<Language, string>;
}

interface AdIdentity {
	id: Identifier;
}

interface ProvinceOption extends AdOption {
	s: Record<Language, string>;
}

interface CollapseTarget {
	dispatch(action: unknown): unknown;
}

let images: number[] = [],
	_contactMethods: Record<string, number> = {},
	contactMethods: Record<string, string> = { email: '', contact_phone: '' },
	selectedImages: Record<string, string> = {},
	provonceList: ProvinceOption[] = PageVars.province,
	provId: Identifier | '' = '',
	provObj: AdOption | null = null,
	group = '',
	cityId: Identifier | '' = '',
	cityObj: AdOption | null = null,
	categoryList: AdOption[] = PageVars.category,
	catId: Identifier | '' = '',
	catObj: AdOption | null = null,
	itemId: Identifier | '' = '',
	itemObj: AdOption | null = null,
	_removeAdImages: Record<string, number> = {};

let provIdSearch: Identifier | '' = '',
	provObjSearch: AdOption | null = null,
	cityIdSearch: Identifier | '' = '',
	cityObjSearch: AdOption | null = null,
	catIdSearch: Identifier | '' = '',
	catObjSearch: AdOption | null = null,
	itemIdSearch: Identifier | '' = '',
	itemObjSearch: AdOption | null = null;

const collapse = {
	cat: (o: CollapseTarget) => { o.dispatch(expandCatAction(false)); },
	item: (o: CollapseTarget) => { o.dispatch(expandItemAction(false)); },
	prov: (o: CollapseTarget) => { o.dispatch(expandProvAction(false)); },
	city: (o: CollapseTarget) => { o.dispatch(expandCityAction(false)); },
	catSearch: (o: CollapseTarget) => { o.dispatch(expandCatAction(false, 'Search')); },
	itemSearch: (o: CollapseTarget) => { o.dispatch(expandItemAction(false, 'Search')); },
	provSearch: (o: CollapseTarget) => { o.dispatch(expandProvAction(false, 'Search')); },
	citySearch: (o: CollapseTarget) => { o.dispatch(expandCityAction(false, 'Search')); }
};

type CollapseKey = keyof typeof collapse;

const collapseAll = (o: CollapseTarget, m: string): void => {
	for(const d of Object.keys(collapse) as CollapseKey[]) {
		if(d !== m) {
			collapse[d](o);
		}
	}
};
		
const AdFuncs = {

	adIsFree: () => {
		Engine.dispatch(updateStateModelData({
			price: '',
			is_free: '1',
			currency: ''
		}));
	},

	adNotFree: () => {
		Engine.dispatch(updateStateModelData({
			is_free: '0'
		}));
	},
	
	setCurrency: (c: string) => {
		Engine.dispatch(updateStateModelData({
			currency: c
		}));
	},

	adImageFull: () => {
		return images.length >= StaticVars.inum ? true : false;
	},
	
	addAdImage: () => {
		let len = images.length;
		let n = len === 0 ? 1 : +images[len - 1] + 1;
		images.push(n);
		Engine.dispatch(updateStateModelData({
			images: images
		}));
	},
	
	rmAdImage: (n: number) => {
		let idx = images.indexOf(n),
			adImages = {...Engine.store().MODELS['adImages']};
		if(idx >= 0) {
			images.splice(idx, 1);
			if(n in selectedImages) {
				delete selectedImages[n];
			}
			Engine.dispatch(updateStateModelData({
				images: images,
			}));
			if(+Engine.store().MODELS['imageErrorNumber'] === n) {
				Engine.dispatch(updateStateModelData({
					imageErrorNumber: '',
					imageErrorCode: ''
				}));
			}
			if(+Engine.store().MODELS['mainPictureId'] === n) {
				Engine.dispatch(updateStateModelData({
					mainPictureId: ''
				}));
			}
		}

		if(n in adImages) {
			delete adImages[n];
			_removeAdImages[n] = 1;
			Engine.dispatch(updateStateModelData({
				adImages: adImages
			}));	
		}
	},
	
	setMainPicture: (n: number) => {
		Engine.dispatch(updateStateModelData({
			mainPictureId: n
		}));
	},
		
	contactMethod: () => {
		return Object.keys(_contactMethods).join(',');
	},

	setContactMethod: (c: string) => {
		if((c in _contactMethods)) {
			delete _contactMethods[c];
			contactMethods[c] = '';
			Engine.dispatch(updateStateModelData({
				contactMethods: contactMethods
			}));
		}else {
			_contactMethods[c] = 1;
			Engine.dispatch(updateStateModelData({
				_contactMethods: _contactMethods
			}));
		}
	},

	isContactMethod: (c: string) => {
		return (c in _contactMethods);
	},

	imageFound: (n: number) => {
		return (n in {...Engine.store().MODELS['adImages'] || {}});
	},

	imageSelected: (n: number) => {
		return (n in selectedImages);
	},
	
	imageSource: (n: number): string | undefined => {
		return selectedImages[n];
	},
	
	imageError: (n: number) => {
		return +Engine.store().MODELS['imageErrorNumber'] === n;
	},
	
	imageErrorCode: () => {
		return Engine.store().MODELS['imageErrorCode'];
	},
	
	browseAdImage: (n: number) => {
		let camera = document.getElementById(`ad_image_${n}`);
		if(camera) {
			camera.click();
		}
	},
	
	selectFile: (e: React.ChangeEvent<HTMLInputElement>) => {
		let error = '',
			info = e.target.files?.[0];
		const match = e.target.name.match(/^ad_image_(\d+)$/);
		if(!match) {
			throw new Error(`Unexpected ad image input name: ${e.target.name}`);
		}
		const n = match[1];
		
		if(!info) {
			return;
		}
		
		if(!info.type.match(/^image.*(peg)|(bmp)|(png)$/i)) {
			error = 'w_pit_file';
		}else if((info.size/1048576) > StaticVars['imb']) {
			error = 'w_max_pit_size';
		}
		if(error) {
			Engine.dispatch(updateStateModelData({
				imageErrorNumber: n,
				imageErrorCode: error
			}));
		}else {
			Engine.dispatch(updateStateModelData({
				imageErrorNumber: '',
				imageErrorCode: ''
			}));
			let reader = new FileReader();
			reader.readAsDataURL(info);
			reader.onload = () => {
				if(typeof reader.result !== 'string') {
					return;
				}
				selectedImages[n] = reader.result;
				Engine.dispatch(updateStateModelData({
					selectedImages: selectedImages
				}));
			};			
		}
	},
	
	category: () => {
		return categoryList;
	},
	
	selectCat: (c: AdOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			expandCat = !MODELS[`expandCat${Search}`];
		Engine.dispatch(expandCatAction(expandCat, Search));
		if(expandCat) {collapseAll(Engine, `cat${Search}`);}
		if(Search) {
			if(catIdSearch === c.i) { return; }
			[catIdSearch, catObjSearch, itemIdSearch] = [c.i, c, ''];
		}else {
			if(catId === c.i) { return; }
			[catId, catObj, itemId] = [c.i, c, ''];
		}
		Engine.dispatch(selectCatAction(Search ? catIdSearch : catId, Search ? catObjSearch : catObj, Search));
	},

	showCat: (c: AdOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			[catId, expandCat] = [MODELS[`catId${Search}`], MODELS[`expandCat${Search}`]];
		return expandCat || (!c.i && !catId) || (catId && catId === c.i);
	},

	catSelected: (c: AdOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			catId = MODELS[`catId${Search}`];
		return catId && catId === c.i;
	},

	item: (Search: SearchMode = ''): AdOption[] => {
		let MODELS = Engine.store().MODELS,
			catObj = MODELS[`catObj${Search}`];
		return catObj?.c || [];
	},

	selectItem: (i: AdOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			expandItem = !MODELS[`expandItem${Search}`]
		Engine.dispatch(expandItemAction(expandItem, Search));
		if(expandItem) {collapseAll(Engine, `item${Search}`);}
		if(Search) {
			if(itemIdSearch === i.i) { return; }
			[itemIdSearch, itemObjSearch] = [i.i, i];
		}else {
			if(itemId === i.i) { return; }
			[itemId, itemObj] = [i.i, i];
		}
		Engine.dispatch(selectItemAction(Search ? itemIdSearch : itemId, Search ? itemObjSearch : itemObj, Search));
	},

	showItem: (i: AdOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			[expandItem, itemId] = [MODELS[`expandItem${Search}`], MODELS[`itemId${Search}`]];
		return expandItem || (!i.i && !itemId) || (itemId && itemId === i.i);
	},

	itemSelected: (i: AdOption, Search: SearchMode = '') => {
		return Search ? (itemIdSearch && itemIdSearch === i.i ? true : false) : (itemId && itemId === i.i ? true : false);
	},
	
	province: () => {
		return provonceList;
	},
	
	selectProv: (p: ProvinceOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			expandProv = !MODELS[`expandProv${Search}`];
		Engine.dispatch(expandProvAction(expandProv, Search));
		if(expandProv) {collapseAll(Engine, `prov${Search}`);}
		if(Search) {
			if(provIdSearch === p.i) { return; }
			[provIdSearch, provObjSearch, cityIdSearch] = [p.i, p, ''];
		}else {
			if(provId === p.i) { return; }
			[provId, provObj, cityId] = [p.i, p, ''];
		}
		Engine.dispatch(selectProvAction(Search ? provIdSearch : provId, Search ? provObjSearch : provObj, Search));
	},

	showProv: (p: ProvinceOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			[provId, expandProv] = [MODELS[`provId${Search}`], MODELS[`expandProv${Search}`]];
		return expandProv || (!p.i && !provId) || (provId && provId === p.i);
	},

	provSelected: (p: ProvinceOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			provId = MODELS[`provId${Search}`];
		return provId && provId === p.i;
	},

	displayGroup: (p: ProvinceOption): boolean => {
		const language = Engine.store().LANGUAGE as Language;
		if(p.s[language] !== '' && p.s[language] !== group) {
			group = p.s[language];
			return true;
		}
		return false;
	},
	
	city: (Search: SearchMode = ''): AdOption[] => {
		let MODELS = Engine.store().MODELS,
			provObj = MODELS[`provObj${Search}`];
		return provObj ? provObj.c : [];
	},

	selectCity: (c: AdOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			expandCity = !MODELS[`expandCity${Search}`];
		Engine.dispatch(expandCityAction(expandCity, Search));
		if(expandCity) {collapseAll(Engine, `city${Search}`);}
		if(Search) {
			if(cityIdSearch === c.i) { return; }
			[cityIdSearch, cityObjSearch] = [c.i, c];
		}else {
			if(cityId === c.i) { return; }
			[cityId, cityObj] = [c.i, c];
		}
		Engine.dispatch(selectCityAction(Search ? cityIdSearch : cityId, Search ? cityObjSearch : cityObj, Search));
	},

	showCity: (c: AdOption, Search: SearchMode = '') => {
		let MODELS = Engine.store().MODELS,
			[expandCity, cityId] = [MODELS[`expandCity${Search}`], MODELS[`cityId${Search}`]];
		return expandCity || (!c.i && !cityId) || (cityId && cityId === c.i);
	},

	citySelected: (c: AdOption, Search: SearchMode = '') => {
		return Search ? (cityIdSearch && cityIdSearch === c.i ? true : false) : (cityId && cityId === c.i ? true : false);
	},

	removeAdImage: () => Object.keys(_removeAdImages).join(','),

	clearScreen: () => {
		[images, _contactMethods, contactMethods, selectedImages, provId, provObj, group, cityId, cityObj, catId, catObj, itemId, itemObj, _removeAdImages] = [
			[],
			{},
			{email: '', contact_phone: ''},
			{},
			'',
			null,
			'',
			'',
			null,
			'',
			null,
			'',
			null,
			{}
		];

        [provIdSearch, provObjSearch, cityIdSearch, cityObjSearch, catIdSearch, catObjSearch, itemIdSearch, itemObjSearch] = ['', null, '', null, '', null, '', null];
	},
	
	expandUserAd: (ad: AdIdentity) => {
		let expandedAds = {...Engine.store().OBJECTS['EXPANDEDADS'] || {}};
		if(ad.id in expandedAds) {
			delete expandedAds[ad.id];
		}else {
			expandedAds[ad.id] = 1;
		}
		Engine.dispatch(saveStateObjects({
			EXPANDEDADS: expandedAds
		}));
	},

	userAdExpanded: (ad: AdIdentity): boolean => {
		let expandedAds = Engine.store().OBJECTS['EXPANDEDADS'] || {};
		return (ad.id in expandedAds);
	},

	itemIsFree: () => {
        let isFree = Engine.store().MODELS['is_free'],
            nothing = isFree === null;

        return !nothing && +isFree === 1;
	},

	itemIsNotFree: () => {
		let isFree = Engine.store().MODELS['is_free'],
			nothing = isFree === null;

		return !nothing && +isFree === 0;
	},

	initCity: (value: Identifier | '', search: boolean = false) => {
		if(search) {
			cityIdSearch = value;
		}else {
			cityId = value;
		}
	},
	
	initItem: (value: Identifier | '', search: boolean = false) => {
		if(search) {
			itemIdSearch = value;
		}else {
			itemId = value;
		}
	},

	initImages: (value: number[]) => {
		images = value;
	},

	initContactMethods: (...methods: [Record<string, string>, Record<string, number>]) => {
		[contactMethods, _contactMethods] = methods;
	},

	initOtherItems: () => {
		_removeAdImages = {};
	}
};

export { AdFuncs };
