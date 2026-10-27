import React from 'react';
import { Http } from './http-client';
import { Helper } from './js-funcs';
import { getLabel } from './label';
import { Engine } from './engine';
import { fetchAdvertises as fetchAdvertisesAction, searchAdvertise as searchAdvertiseAction } from '../action';
import type { Identifier } from '../types/common';
import { route, Cache } from '../utils';
import { PageVars } from '../static/static-vars';
import { initCity, initItem } from '../hook/dropdown-hook';

interface ImageItem {
	i: Identifier;
}

interface SearchTerm {
	key: keyof typeof searchSequence;
	id: Identifier;
}

type EditableAdvertise = Record<string, any> & {
	images: number[];
	contact_method: string;
};

const searchSequence = {
		province: 1,
		city: 2,
		category: 3,
		item: 4,
		ad_keyword: 5,
	},
	swapper = {
		province: 'provIdSearch',
		city: 'cityIdSearch',
		category: 'catIdSearch',
		item: 'itemIdSearch',
		ad_keyword: 'adKeyword',
		start: 'start',
		searchByKeyword: 'searchByKeyword',
	},
	searchAdvertise = (requestData: Record<string, any>) => {
		let data: Record<string, any> = {},
			criteria: Record<string, string> = { ...swapper };

		for (let key in criteria) {
			data[key] = requestData[criteria[key]] || '';
		}

		return Http.Fetch('search-advertise', data)
			.then((promise) => {
				if (promise.data.angular_ads) {
					Helper.detachActionBox();
					route.location('');
					return {
						resultSets: {
							ads: promise.data.angular_ads,
							pages: promise.data.angular_ad_pages.p,
							searchAd: promise.data.angular_ad_pages.s ? true : false,
							currentPage: promise.data.angular_ad_pages.c,
						},
						searchTerms: promise.data.search_terms,
					};
				} else {
					return {
						error: (promise.data.error && promise.data.error) || getLabel('unknown_error'),
					};
				}
			})
			.catch((errorData) => errorData.error);
	},
	fetchAdvertises = (start: Identifier) => {
		let data = { start };

		return Http.Fetch('advertise', data)
			.then((promise) => {
				if (promise.data.ads) {
					return {
						ads: promise.data.ads.angular_ads,
						pages: promise.data.ads.angular_ad_pages.p,
						currentPage: promise.data.ads.angular_ad_pages.c,
						searchAd: false,
					};
				} else {
					return {};
				}
			})
			.catch((reason) => reason.error);
	},
	fetchAdvertise = (advertiseId: Identifier) => {
		return Http.Fetch('advertise-detail', { advertise_id: advertiseId })
			.then((promise) => {
				let provObj = PageVars.province.find((prov) => +prov.i === +promise.data.item.pr),
					cityObj = ((provObj && provObj.c) || []).find((city) => +city.i === +promise.data.item.ct),
					catObj = PageVars.category.find((cat) => +cat.i === +promise.data.item.ca),
					itemObj = ((catObj && catObj.c) || []).find((item) => +item.i === +promise.data.item.it);

				initCity(promise.data.item.ct, true);
				initItem(promise.data.item.it, true);

				return promise.data
					? {
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
								start: 0,
							},
							searchTerms: promise.data.search_terms,
							advertiseDetail: promise.data,
						}
					: null;
			})
			.catch((reason) => reason.error);
	},
	createUserAdvertiseSet = (ad: EditableAdvertise) => {
		const provObj = PageVars.province.find((prov) => +prov.i === +ad.province_id),
			catObj = PageVars.category.find((cat) => +cat.i === +ad.category_id),
			cityObj = ((provObj && provObj.c) || []).find((city) => +city.i === +ad.city_id),
			itemObj = ((catObj && catObj.c) || []).find((item) => +item.i === +ad.item_id),
			userAdvertiseSet = {
				userAdvertiseSet: {
					id: ad.id,
					name: ad.name,
					description: ad.description,
					address: ad.address,
					contact_phone: ad.contact_phone,
					contact_email: ad.contact_email,
				},
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
					contact_phone: ad.contact_phone,
				},
				_contactMethods: ad.contact_method.split(',').reduce<Record<string, number>>((current, next) => {
					current[next] = 1;
					return current;
				}, {}),
				adImages: ad.images.reduce<Record<string, number>>((current, next) => {
					current[next] = 1;
					return current;
				}, {}),
			};
		return { ...userAdvertiseSet, ...uiModelSet };
	},
	fetchUserAdvertiseForEdit = (script: string, requestData: Record<string, any>) => {
		return Http.ServerRequest(script, requestData)
			.then((promise) => {
				if (promise.data.angular_ad) {
					let ad = promise.data.angular_ad;
					if ('id' in ad) {
						return { resultSets: createUserAdvertiseSet(ad) };
					}
					return { error: getLabel('unknown_error') };
				} else {
					return { error: promise.data.error || promise.data };
				}
			})
			.catch(() => getLabel('unknown_error'));
	},
	listAdvertise = (start: number = 0) => {
		Engine.dispatch(fetchAdvertisesAction(start));
	},
	AdInfo = {
		safeHtml: (html: string) => (
			//(<SanitizedHTML html={html.replace(/[\n]/g, '<br />')} />),
			<div dangerouslySetInnerHTML={{ __html: html.replace(/[\n]/g, '<br />') }} />
		),

		byMail: (ad: { contact_method?: string } | null | undefined): boolean => {
			return ad && ad.contact_method && ad.contact_method.match(/\b(contact_)?email\b/) ? true : false;
		},

		byPhone: (ad: { contact_method?: string } | null | undefined): boolean => {
			return ad && ad.contact_method && ad.contact_method.match(/\bcontact_phone\b/) ? true : false;
		},

		getSearchSequence: () => {
			return searchSequence;
		},

		searchTerm: (term: SearchTerm) => {
			let searchTerms = [...Engine.store().searchTerms],
				selectedSequence = searchSequence[term.key],
				loopCount = searchTerms.length - selectedSequence,
				searchData: Record<string, any> = {
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

			searchTerms.forEach((thisTerm) => {
				if (thisTerm.key === 'province') {
					searchData.provIdSearch = thisTerm.id.toString();
					searchData.provObjSearch = PageVars.province.find((prov) => +prov.i === +thisTerm.id);
				} else if (thisTerm.key === 'city') {
					searchData.cityIdSearch = thisTerm.id.toString();
					searchData.cityObjSearch = ((searchData.provObjSearch && searchData.provObjSearch.c) || []).find(
						(city: ImageItem) => +city.i === +thisTerm.id
					);
					initCity(thisTerm.id.toString(), true);
				} else if (thisTerm.key === 'category') {
					searchData.catIdSearch = thisTerm.id.toString();
					searchData.catObjSearch = PageVars.category.find((cat) => +cat.i === +thisTerm.id);
				} else if (thisTerm.key === 'item') {
					searchData.itemIdSearch = thisTerm.id.toString();
					searchData.itemObjSearch = ((searchData.catObjSearch && searchData.catObjSearch.c) || []).find(
						(item: ImageItem) => +item.i === +thisTerm.id
					);
					initItem(thisTerm.id.toString(), true);
				}
			});

			return {
				searchData,
				searchTerms,
			};
		},

		selectSearchPage: (currentPage: Identifier, page: { i: number }) => {
			if (+currentPage !== +page.i) {
				Engine.dispatch(searchAdvertiseAction(page.i));
			}
		},

		selectHomePage: (currentPage: number, page: { i: number }) => {
			if (+currentPage !== +page.i) {
				listAdvertise(page.i);
			}
		},

		fetchUserAdvertise: (advertiseId: Identifier) => {
			return fetchUserAdvertiseForEdit('fetch-user-ad', { action: 'fetch_user_ad', advertise_id: advertiseId });
		},

		fetchVisitorAdvertise: () => {
			return fetchUserAdvertiseForEdit('fetch-visitor-ad', { action: 'fetch_visitor_ad' });
		},

		visitorConfirmDeletion: () => {
			Helper.confirm(getLabel('r_sure_delete'), () => {
				Http.ServerRequest('delete-visitor-advertise', { action: 'delete_visitor_advertise' }).then(
					(promise) => {
						if (promise.data.ok) {
							Cache.clear();
							Helper.location('home');
						} else {
							Helper.addMessage(promise.data.error, true);
						}
					}
				);
			});
		},

		searchAdvertise: searchAdvertise,

		fetchAdvertises: fetchAdvertises,

		fetchAdvertise: fetchAdvertise,

		listAdvertise: listAdvertise,
	};

export { AdInfo };
