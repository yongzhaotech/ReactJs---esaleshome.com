import { useCallback } from 'react';
import { messageCenter, ADD_MESSAGE } from '../action';
import { Http } from '../common/http-client';
import { useSelector, useDispatch } from 'react-redux';
import RootReducer from '../reducer';
import { signOut as signUserOut, fetchUserDataSuccess } from '../action';
import { Cache } from '../common/cache';
import type { Identifier } from '../types/common';
import { route } from '../utils';

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

const dataFetchInfo: Record<DataKey, DataFetchInfo> = {
	profile: {
		script: 'fetch-user-profile',
		requestData: { action: 'fetch_user_profile' },
		responseKey: 'user',
	},
	ads: {
		script: 'fetch-user-ads',
		requestData: { action: 'fetch_user_ads' },
		responseKey: 'ads',
	},
	siteUsers: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_users' },
		responseKey: 'users',
	},
	siteAds: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_ads' },
	},
	visitorHits: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_visitor_hits' },
	},
	files: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_files' },
		responseKey: 'files',
	},
	categories: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_categories' },
		responseKey: 'categories',
	},
	subCategories: {
		script: 'admin-function',
		requestData: { action: 'fetch_adm_subcategories' },
		responseKey: 'subCategories',
	},
};

type RootState = ReturnType<typeof RootReducer>;

export const signOut = () => Http.ServerRequest('sign-out', { action: 'sign_out' });

export const fetchUserDataFromServer = ({ dataKey, page }: UserDataFetchArg) => {
	const info = dataFetchInfo[dataKey],
		requestData = { ...info.requestData, ...(page ? { start: page.i } : {}) };
	return Http.ServerRequest(info.script, requestData)
		.then((promise) => {
			return {
				[dataKey]: info.responseKey ? promise.data[info.responseKey] : promise.data,
			};
		})
		.catch(() => 'Error processing your request');
};

export const useUserFunctions = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.USER);
	const { ads: currentAds = [] } = user;

	const signOut = useCallback(() => {
		dispatch(signUserOut());
	}, [dispatch]);

	const remove = useCallback(
		(ad: UserAd) => {
			const ads = [...(currentAds as UserAd[])];
			const index = ads.indexOf(ad);

			if (index >= 0) {
				ads.splice(index, 1);
				dispatch(fetchUserDataSuccess([{ ads: ads }]));
			}
		},
		[currentAds, dispatch]
	);

	const userPage = (page: string) => {
		route.location(page);
	};

	return { signOut, remove, userPage };
};

export const useServerFunctions = () => {
	const dispatch = useDispatch();
	const { remove } = useUserFunctions();

	const deleteAd = useCallback(
		(ad: UserAd) => {
			Http.ServerRequest('delete-user-advertise', {
				advertise_id: ad.id,
				action: 'delete_user_advertise',
			}).then((promise: ServerResponse) => {
				if (promise.data.error) {
					dispatch(messageCenter(ADD_MESSAGE, promise.data.error, true));
				} else {
					Cache.clear();
					remove(ad);
					route.location('user-advertise');
				}
			});
		},
		[remove, dispatch]
	);

	return { deleteAd };
};
