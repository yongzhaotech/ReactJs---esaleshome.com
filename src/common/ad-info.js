import React from 'react';
import { Http } from './http-client';
import { Helper } from './js-funcs';
import { AdFuncs } from './ad-funcs';
import { getLabel } from './label';
import { Engine } from './engine';
import { largeImageSrc } from './config';
import {
	fetchAdvertises as fetchAdvertisesAction,
	searchAdvertise as searchAdvertiseAction,
	updateStateModelData,
	changeColumnNumber,
	performSearch,
	saveStateObjects,
	loadingData,
	loadingLargeImageCount,
	viewLargeImages
} from '../action';
import { Cache } from './cache';

let timeOutId = null;
const searchSequence = {
	province: 1,
	city: 2,
	category: 3,
	item: 4,
	ad_keyword: 5
},
	swapper = {
		province: 'provIdSearch',
		city: 'cityIdSearch',
		category: 'catIdSearch',
		item: 'itemIdSearch',
		ad_keyword: 'adKeyword',
		start: 'start',
		searchByKeyword: 'searchByKeyword'
	},
	loadImages = (imgs, imageCount, count) => {
		let init = 0;
		return imgs.map(imageObject => {
			return new Promise((res, rej) => {
				let img = new Image();
				timeOutId = setTimeout(() => {
					img.src = `${largeImageSrc}${imageObject.i}.jpg`;
				}, 250 * ++init);
				img.onload = () => {
					Engine.dispatch(loadingLargeImageCount(`${++count} / ${imageCount}`));
					res(true);
				};
				img.onerror = () => {
					rej(false);
				};
			});
		});
	},
	viewImages = n => {
		let images = Engine.store().MODELS['listImages'] || [],
			imageCount = images.length,
			count = 0;
		if (imageCount) {
			Engine.dispatch(loadingData(true, false, true));
			Engine.dispatch(loadingLargeImageCount(`${++count} / ${imageCount}`));
			Promise.all(loadImages(images, imageCount, count)).then(() => {
				if (!!timeOutId) {
					clearTimeout(timeOutId);
					timeOutId = null;
				}
				Engine.dispatch(loadingData());
				Engine.dispatch(loadingLargeImageCount());
				Engine.dispatch(updateStateModelData({
					currentImage: n,
					largeImageFlag: true
				}));
			}).catch(e => { Engine.dispatch(loadingLargeImageCount()); });
		}
	},
	imageIndex = (listImages, currentImage) => {
		let len = listImages.length;

		for (let i = 0; i < len; i++) {
			if (+currentImage === +listImages[i]['i']) {
				return i;
			}
		}
		return 0;
	},
	searchAdvertise = (requestData) => {
		let data = {},
			criteria = { ...swapper };

		for (let key in criteria) {
			data[key] = requestData[criteria[key]] || '';
		}

		return Http.Fetch('search-advertise', data).then(promise => {
			if (promise.data.angular_ads) {
				Engine.dispatch(performSearch());
				Helper.detachActionBox();
				Helper.location('');
				return {
					resultSets: {
						ads: promise.data.angular_ads,
						pages: promise.data.angular_ad_pages.p,
						searchAd: promise.data.angular_ad_pages.s ? true : false,
						currentPage: promise.data.angular_ad_pages.c
					},
					searchTerms: promise.data.search_terms
				};
			} else {
				return {
					error: (promise.data.error && promise.data.error) || getLabel('unknown_error')
				};
			}
		}).catch(errorData => errorData.error);
	},
	fetchAdvertises = (start) => {
		let data = { start };

		return Http.Fetch('advertise', data).then(promise => {
			if (promise.data.ads) {
				return {
					ads: promise.data.ads.angular_ads,
					pages: promise.data.ads.angular_ad_pages.p,
					currentPage: promise.data.ads.angular_ad_pages.c,
					searchAd: false
				};
			} else {
				return {};
			}
		}).catch(reason => reason.error);
	},
	fetchAdvertise = advertiseId => {
		return Http.Fetch('advertise-detail', { advertise_id: advertiseId }).then(promise => {
			let provObj = AdFuncs.province().find(prov => +prov.i === +promise.data.item.pr),
				cityObj = ((provObj && provObj.c) || []).find(city => +city.i === +promise.data.item.ct),
				catObj = AdFuncs.category().find(cat => +cat.i === +promise.data.item.ca),
				itemObj = ((catObj && catObj.c) || []).find(item => +item.i === +promise.data.item.it);

			AdFuncs.initCity(promise.data.item.ct, true);
			AdFuncs.initItem(promise.data.item.it, true);

			return promise.data ? {
				searchData: {
					provIdSearch: promise.data.item.pr,
					provObjSearch: provObj,
					cityObjSearch: cityObj,
					cityIdSearch: promise.data.item.ct,
					catIdSearch: promise.data.item.ca,
					catObjSearch: catObj,
					itemObjSearch: itemObj,
					itemIdSearch: promise.data.item.it,
					adKeyword: promise.data.item.kw,
					start: 0
				},
				searchTerms: promise.data.search_terms,
				advertiseDetail: promise.data
			} : null;
		}).catch(reason => reason.error);
	},
	createUserAdvertiseSet = ad => {
		const provObj = AdFuncs.province().find(prov => +prov.i === +ad.province_id),
			catObj = AdFuncs.category().find(cat => +cat.i === +ad.category_id),
			cityObj = ((provObj && provObj.c) || []).find(city => +city.i === +ad.city_id),
			itemObj = ((catObj && catObj.c) || []).find(item => +item.i === +ad.item_id),
			userAdvertiseSet = {
				userAdvertiseSet: {
					id: ad.id,
					name: ad.name,
					description: ad.description,
					address: ad.address,
					contact_phone: ad.contact_phone,
					contact_email: ad.contact_email
				}
			},
			uiModelSet = {
				provId: ad.province_id,
				provObj: provObj,
				cityId: ad.city_id,
				catId: ad.category_id,
				catObj: catObj,
				cityObj: cityObj,
				itemObj: itemObj,
				itemId: ad.item_id,
				is_free: ad.is_free,
				price: ad.price,
				currency: ad.currency,
				mainPictureId: ad.main_picture_id,
				images: ad.images.sort((a, b) => a - b),
				contactMethods: {
					contact_email: ad.contact_email,
					contact_phone: ad.contact_phone
				},
				_contactMethods: ad.contact_method.split(',').reduce((current, next) => {
					current[next] = 1;
					return current;
				}, {}),
				adImages: ad.images.reduce((current, next) => {
					current[next] = 1;
					return current;
				}, {})
			};
		return { ...userAdvertiseSet, ...uiModelSet };
	},
	fetchUserAdvertiseForEdit = (script, requestData) => {
		return Http.ServerRequest(script, requestData).then(promise => {
			if (promise.data.angular_ad) {
				let ad = promise.data.angular_ad;
				if ('id' in ad) {
					return { resultSets: createUserAdvertiseSet(ad) };
				}
				return { error: getLabel('unknown_error') };
			} else {
				return { error: promise.data.error || promise.data };
			}
		}).catch(() => getLabel('unknown_error'));
	},
	listAdvertise = (start = 0) => {
		Engine.dispatch(fetchAdvertisesAction(start));
	},
	AdInfo = {
		safeHtml: html => //(<SanitizedHTML html={html.replace(/[\n]/g, '<br />')} />),
			(<div dangerouslySetInnerHTML={{ __html: html.replace(/[\n]/g, '<br />') }} />),

		byMail: ad => {
			return ad && ad.contact_method && ad.contact_method.match(/\b(contact_)?email\b/) ? true : false;
		},

		byPhone: ad => {
			return ad && ad.contact_method && ad.contact_method.match(/\bcontact_phone\b/) ? true : false;
		},

		largeImageOnList: ad => {
			if (!ad.picture_ids.length) {
				return;
			}
			Engine.dispatch(updateStateModelData({
				listImages: ad.picture_ids.map(p => ({ i: p }))
			}));
			setTimeout(() => {
				Engine.dispatch(viewLargeImages(ad.main_picture_id || ad.picture_id));
			}, 0);
		},

		largeImageOnDetail: (ad, p) => {
			if (!ad.picture_ids.length) {
				return;
			}
			Engine.dispatch(updateStateModelData({
				listImages: ad.picture_ids
			}));
			setTimeout(() => {
				Engine.dispatch(viewLargeImages(p.i));
			}, 0);
		},

		clearLargeImage: (currentImageRef = null) => {
			if (currentImageRef) {
				currentImageRef.className = 'fade-out';
			}
			setTimeout(() => {
				Engine.dispatch(updateStateModelData({
					currentImage: null,
					largeImageFlag: null,
					listImages: null
				}));
			}, 1201);
		},

		hasNextImage: (listImages, currentImage) => {
			return imageIndex(listImages, currentImage) < listImages.length - 1;
		},

		hasPrevImage: (listImages, currentImage) => {
			return imageIndex(listImages, currentImage) > 0;
		},

		nextImage: (listImages, currentImage, currentImageRef) => {
			currentImageRef.className = 'fade-out';
			setTimeout(() => {
				Engine.dispatch(updateStateModelData({
					currentImage: listImages[imageIndex(listImages, currentImage) + 1]['i']
				}));
			}, 1201);
		},

		prevImage: (listImages, currentImage, currentImageRef) => {
			currentImageRef.className = 'fade-out';
			setTimeout(() => {
				Engine.dispatch(updateStateModelData({
					currentImage: listImages[imageIndex(listImages, currentImage) - 1]['i']
				}));
			}, 1201);
		},

		getSearchSequence: () => {
			return searchSequence;
		},

		searchTerm: term => {
			let searchTerms = [...Engine.store().searchTerms],
				selectedSequence = searchSequence[term.key],
				loopCount = searchTerms.length - selectedSequence,
				searchData = {
					start: '',
					adKeyword: '',
					provObjSearch: null,
					cityObjSearch: null,
					catObjSearch: null,
					itemObjSearch: null,
					provIdSearch: '',
					cityIdSearch: '',
					catIdSearch: '',
					itemIdSearch: '',
				};

			while (loopCount-- > 0) {
				searchTerms.pop();
			}

			searchTerms.forEach(thisTerm => {
				if (thisTerm.key === 'province') {
					searchData.provIdSearch = thisTerm.id.toString();
					searchData.provObjSearch = AdFuncs.province().find(prov => +prov.i === +thisTerm.id);
				} else if (thisTerm.key === 'city') {
					searchData.cityIdSearch = thisTerm.id.toString();
					searchData.cityObjSearch = ((searchData.provObjSearch && searchData.provObjSearch.c) || []).find(city => +city.i === +thisTerm.id);
					AdFuncs.initCity(thisTerm.id.toString(), true);
				} else if (thisTerm.key === 'category') {
					searchData.catIdSearch = thisTerm.id.toString();
					searchData.catObjSearch = AdFuncs.category().find(cat => +cat.i === +thisTerm.id);
				} else if (thisTerm.key === 'item') {
					searchData.itemIdSearch = thisTerm.id.toString();
					searchData.itemObjSearch = ((searchData.catObjSearch && searchData.catObjSearch.c) || []).find(item => +item.i === +thisTerm.id);
					AdFuncs.initItem(thisTerm.id.toString(), true);
				}
			});

			return {
				searchData,
				searchTerms
			};
		},

		selectSearchPage: (currentPage, page) => {
			if (+currentPage !== +page.i) {
				Engine.dispatch(searchAdvertiseAction(page.i));
			}
		},

		selectHomePage: (currentPage, page) => {
			if (+currentPage !== +page.i) {
				listAdvertise(page.i);
			}
		},

		fetchUserAdvertise: advertiseId => {
			return fetchUserAdvertiseForEdit('fetch-user-ad', { action: 'fetch_user_ad', advertise_id: advertiseId });
		},

		fetchVisitorAdvertise: () => {
			return fetchUserAdvertiseForEdit('fetch-visitor-ad', { action: 'fetch_visitor_ad' });
		},

		visitorConfirmDeletion: () => {
			Helper.confirm(
				getLabel('r_sure_delete'),
				() => {
					Http.ServerRequest('delete-visitor-advertise', { action: 'delete_visitor_advertise' }).then(promise => {
						if (promise.data.ok) {
							Cache.clear();
							Helper.location('home');
						} else {
							Helper.addMessage(promise.data.error, true);
						}
					});
				}
			);
		},

		flagDetail: ad => {
			let [flag, open] = ['', Engine.store().OBJECTS['OPENFLAG']];
			if (open && open === ad.id) {
				open = '';
			} else {
				flag = ad.id;
				open = ad.id;
			}
			Engine.dispatch(saveStateObjects({
				DETAILFLAG: flag,
				OPENFLAG: open
			}));
		},

		toPreviousColumn: () => {
			Engine.dispatch(changeColumnNumber(-1));
		},

		toNextColumn: () => {
			Engine.dispatch(changeColumnNumber(1));
		},

		searchAdvertise: searchAdvertise,

		fetchAdvertises: fetchAdvertises,

		fetchAdvertise: fetchAdvertise,

		listAdvertise: listAdvertise,

		viewImages: viewImages
	};

export { AdInfo };
