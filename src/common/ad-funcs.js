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

let [images, _contactMethods, contactMethods, selectedImages, provonceList, provId, provObj, group, cityId, cityObj, categoryList, catId, catObj, itemId, itemObj, _removeAdImages] = [
	[],
	{},
	{email: '', contact_phone: ''},
	{},
	PageVars.province,
	'',
	null,
	'',
	'',
	null,
	PageVars.category,
	'',
	null,
	'',
	null,
	{}
];

// extra parameters for search box
let [provIdSearch, provObjSearch, cityIdSearch, cityObjSearch, catIdSearch, catObjSearch, itemIdSearch, itemObjSearch] = ['', null, '', null, '', null, '', null];

const collapse = {
	cat: o => { o.dispatch(expandCatAction(false)); },
	item: o => { o.dispatch(expandItemAction(false)); },
	prov: o => { o.dispatch(expandProvAction(false)); },
	city: o => { o.dispatch(expandCityAction(false)); },
	catSearch: o => { o.dispatch(expandCatAction(false, 'Search')); },
	itemSearch: o => { o.dispatch(expandItemAction(false, 'Search')); },
	provSearch: o => { o.dispatch(expandProvAction(false, 'Search')); },
	citySearch: o => { o.dispatch(expandCityAction(false, 'Search')); }
};

const collapseAll = (o, m) => {
	for(let d in collapse) {
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
	
	setCurrency: (c) => {
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
	
	rmAdImage: n => {
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
	
	setMainPicture: n => {
		Engine.dispatch(updateStateModelData({
			mainPictureId: n
		}));
	},
		
	contactMethod: () => {
		return Object.keys(_contactMethods).join(',');
	},

	setContactMethod: c => {
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

	isContactMethod: c => {
		return (c in _contactMethods);
	},

	imageFound: n => {
		return (n in {...Engine.store().MODELS['adImages'] || {}});
	},

	imageSelected: n => {
		return (n in selectedImages);
	},
	
	imageSource: n => {
		return selectedImages[n];
	},
	
	imageError: n => {
		return +Engine.store().MODELS['imageErrorNumber'] === n;
	},
	
	imageErrorCode: () => {
		return Engine.store().MODELS['imageErrorCode'];
	},
	
	browseAdImage: n => {
		let camera = document.getElementById(`ad_image_${n}`);
		if(camera) {
			camera.click();
		}
	},
	
	selectFile: e => {
		let [error, info] = ['', e.target.files[0]];
		let [, n] = e.target.name.match(/^ad_image_(\d+)$/);
		
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
			reader.onload = evt => {
				selectedImages[n] = evt.target.result;
				Engine.dispatch(updateStateModelData({
					selectedImages: selectedImages
				}));
			};			
		}
	},
	
	category: () => {
		return categoryList;
	},
	
	selectCat: (c, Search = '') => {
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

	showCat: (c, Search = '') => {
		let MODELS = Engine.store().MODELS,
			[catId, expandCat] = [MODELS[`catId${Search}`], MODELS[`expandCat${Search}`]];
		return expandCat || (!c.i && !catId) || (catId && catId === c.i);
	},

	catSelected: (c, Search = '') => {
		let MODELS = Engine.store().MODELS,
			catId = MODELS[`catId${Search}`];
		return catId && catId === c.i;
	},

	item: (Search = '') => {
		let MODELS = Engine.store().MODELS,
			catObj = MODELS[`catObj${Search}`];
		return catObj ? catObj.c : [];
	},

	selectItem: (i, Search = '') => {
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

	showItem: (i, Search = '') => {
		let MODELS = Engine.store().MODELS,
			[expandItem, itemId] = [MODELS[`expandItem${Search}`], MODELS[`itemId${Search}`]];
		return expandItem || (!i.i && !itemId) || (itemId && itemId === i.i);
	},

	itemSelected: (i, Search = '') => {
		return Search ? (itemIdSearch && itemIdSearch === i.i ? true : false) : (itemId && itemId === i.i ? true : false);
	},
	
	province: () => {
		return provonceList;
	},
	
	selectProv: (p, Search = '') => {
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

	showProv: (p, Search = '') => {
		let MODELS = Engine.store().MODELS,
			[provId, expandProv] = [MODELS[`provId${Search}`], MODELS[`expandProv${Search}`]];
		return expandProv || (!p.i && !provId) || (provId && provId === p.i);
	},

	provSelected: (p, Search = '') => {
		let MODELS = Engine.store().MODELS,
			provId = MODELS[`provId${Search}`];
		return provId && provId === p.i;
	},

	displayGroup: p => {
		if(p.s[Engine.store().LANGUAGE] !== '' && p.s[Engine.store().LANGUAGE] !== group) {
			group = p.s[Engine.store().LANGUAGE];
			return true;
		}
		return false;
	},
	
	city: (Search = '') => {
		let MODELS = Engine.store().MODELS,
			provObj = MODELS[`provObj${Search}`];
		return provObj ? provObj.c : [];
	},

	selectCity: (c, Search = '') => {
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

	showCity: (c, Search = '') => {
		let MODELS = Engine.store().MODELS,
			[expandCity, cityId] = [MODELS[`expandCity${Search}`], MODELS[`cityId${Search}`]];
		return expandCity || (!c.i && !cityId) || (cityId && cityId === c.i);
	},

	citySelected: (c, Search = '') => {
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
	
	expandUserAd: ad => {
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

	userAdExpanded: ad => {
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

	initCity: (value, search = false) => {
		if(search) {
			cityIdSearch = value;
		}else {
			cityId = value;
		}
	},
	
	initItem: (value, search = false) => {
		if(search) {
			itemIdSearch = value;
		}else {
			itemId = value;
		}
	},

	initImages: value => {
		images = value;
	},

	initContactMethods: (...methods) => {
		[contactMethods, _contactMethods] = methods;
	},

	initOtherItems: () => {
		_removeAdImages = {};
	}
};

export { AdFuncs };
