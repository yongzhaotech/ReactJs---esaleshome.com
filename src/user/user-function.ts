import { Http } from '../common/http-client';
import { Helper } from '../common/js-funcs';
import { getLabel } from '../common/label';
import { Engine } from '../common/engine';
import {
	userSignedOut,
	updateStateModelData,
	fetchUserDataSuccess
} from '../action';
import { Cache } from '../common/cache';
import type { Identifier } from '../types/common';

type DataKey = 'profile' | 'ads' | 'siteUsers' | 'siteAds' | 'visitorHits' | 'files' | 'categories' | 'subCategories';

interface DataFetchInfo {
	script: string;
	requestData: Record<string, string>;
	responseKey?: string;
}

interface UserDataFetchArg {
	dataKey: DataKey;
	page: { i: Identifier } | undefined;
}

interface UserAd {
	id: Identifier;
}

interface ServerResponse {
	data: Record<string, any>;
}

interface RequestError {
	data: unknown;
}

const dataFetchInfo: Record<DataKey, DataFetchInfo> = {
	profile: {
		script: 'fetch-user-profile',
		requestData: { action: 'fetch_user_profile' },
		responseKey: 'user'
	},
	ads: {
		script: 'fetch-user-ads',
		requestData: { action: 'fetch_user_ads' },
		responseKey: 'ads'
	},
	siteUsers: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_users' },
		responseKey: 'users'
	},
	siteAds: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_ads' }
	},
	visitorHits: {
        script: 'admin-function',
        requestData: { action: 'fetch_adm_visitor_hits' }
	},
	files: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_files' },
		responseKey: 'files'
	},
	categories: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_categories' },
		responseKey: 'categories'
	},
	subCategories: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_subcategories' },
		responseKey: 'subCategories'
	}	
};

const signOutUser = (): void => {
	Engine.dispatch(fetchUserDataSuccess([{profile: null}, {ads: null}]));
	Engine.dispatch(userSignedOut());
};

const remove = (ad: UserAd): void => {
	const currentAds = Engine.store().USER['ads'] as UserAd[] | undefined,
		ads = [...currentAds || []],
		index = ads.indexOf(ad);
	if(index >= 0) {
        ads.splice(index, 1);
        Engine.dispatch(fetchUserDataSuccess([{ads: ads}]));
	}
};

const UserFunction = {
    /**
	 * if sign out is successful, the server would delete the session_id cookie
     */
	signOut: () => {
        Helper.confirm(
        	getLabel('confirm_signout'),
			() => {
				Http.ServerRequest('sign-out', {action: 'sign_out'}).then((promise: ServerResponse) => {
					if(promise.data.ok) {
						signOutUser();
					}else {
						Helper.addMessage(promise.data, true);
					}
				}, (promise: RequestError) => {
					Helper.addMessage(promise.data, true);
				});
			}
		);
	},

	userPage: (page: string) => {
        Helper.location(page);
	},

	fetchUserDataFromServer: ({dataKey, page}: UserDataFetchArg) => {
		const info = dataFetchInfo[dataKey],
			requestData = {...info.requestData, ...(page ? {start: page.i} : {})};
        return Http.ServerRequest(info.script, requestData).then(promise => {
			return {
				[dataKey]: info.responseKey ? promise.data[info.responseKey] : promise.data
			};
        }).catch(() => 'Error processing your request');
	},
	
	deleteAd: (ad: UserAd) => {
        Helper.confirm(
        	getLabel('r_sure_delete'),
			() => {
				Http.ServerRequest('delete-user-advertise', {advertise_id: ad.id, action: 'delete_user_advertise'}).then((promise: ServerResponse) => {
                    if(promise.data.error) {
                        Helper.addMessage(promise.data.error, true);
                    }else {
						Cache.clear();
                        remove(ad);
                        Helper.location('user-advertise');
                    }
                });
			}
		);
	},

    genStaticContent: () => {
		Http.ServerRequest('generate-static-content', {action: 'gen_static_content'}).then((promise: ServerResponse) => {
            if(promise.data.ok) {
                Helper.addMessage(promise.data.ok);
            }else {
                Helper.addMessage(promise.data.error, true);
            }
        }).catch(
            () => {
                Helper.addMessage('Error processing your request', true);
            }
        );
	},

    genStaticHtmls: () => {
		Http.ServerRequest('generate-htmls', {action: 'gen_static_htmls'}).then((promise: ServerResponse) => {
            if(promise.data.ok) {
                Helper.addMessage(promise.data.ok);
            }else {
                Helper.addMessage(promise.data.error, true);
            }
        }).catch(
            () => {
                Helper.addMessage('Error processing your request', true);
            }
        );
	},

	validateAccCode: (accCode: string) => {
		Http.ServerRequest('request', {action: 'validate_acc_code', acc_code: accCode}).then((promise: ServerResponse) => {
            if(promise.data.ok) {
                Engine.dispatch(updateStateModelData({
					accCode: accCode
				}));
                Engine.setCookie('lang', promise.data.lang)
            }
        }).catch(
            () => {
                Helper.addMessage('Error processing your request', true);
            }
        );
    },

	oddRow: (n: number): boolean => n % 2 === 0
};

export { UserFunction };
