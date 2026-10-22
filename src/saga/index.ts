import { fork, put, takeLatest, takeEvery, call, all, select } from 'redux-saga/effects';
import { AnyAction } from 'redux';
import { AdInfo } from '../common/ad-info';
import { getLabel } from '../common/label';
import * as Action from '../action';
import { UserFunction } from '../user/user-function';
import { smallImageSrc } from '../common/config';
import { submitFormData } from '../common/form-process';
import { ApiResponse, routes } from '../common/http-client';
import { Cache } from '../common/cache';
import { route } from '../utils';
import { signOut } from '../hook/user-function-hook';

type TypedSaga = Generator<unknown, void, any>;
interface UserDataFetchArg {
	dataKey: 'profile' | 'ads' | 'siteUsers' | 'siteAds' | 'visitorHits' | 'files' | 'categories' | 'subCategories';
	page: { i: string | number } | undefined;
}

function* fetchAdvertises(action: AnyAction): TypedSaga {
	try {
		yield put(Action.loadingData(true, true));
		const resultSets = yield call(AdInfo.fetchAdvertises, action.start);
		yield put(Action.fetchAdvertisesSuccess(resultSets));
		yield put(Action.searchTerms(Action.CLEAR_SEARCHTERMS));
		yield fork(nonBlockingLoadImages, resultSets.ads);
		yield put(Action.loadingData());
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
	}
}

function* fetchAdvertise(action: AnyAction): TypedSaga {
	try {
		yield put(Action.loadingData(true, true));
		const dataSet = yield call(AdInfo.fetchAdvertise, action.advertiseId);
		if (!!dataSet) {
			yield put(Action.searchTerms(Action.ADD_SEARCHTERMS, dataSet.searchTerms));
			yield put(Action.updateStateModelData(dataSet.searchData));
			yield put(Action.fetchAdvertiseSuccess(dataSet.advertiseDetail));
		} else {
			yield put(Action.messageCenter(Action.ADD_MESSAGE, getLabel('unknown_error'), true));
		}
		yield put(Action.loadingData());
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
	}
}

function* searchAdvertise(action: AnyAction): TypedSaga {
	try {
		yield put(Action.loadingData(true, true));
		const requestData = yield select((state: { MODELS: Record<string, any> }) => state.MODELS);
		requestData.start = action.start;
		const dataSet = yield call(AdInfo.searchAdvertise, requestData);
		if (dataSet.error) {
			yield put(Action.messageCenter(Action.ADD_MESSAGE, dataSet.error, true));
		} else {
			yield put(Action.fetchAdvertisesSuccess(dataSet.resultSets));
			yield put(Action.searchTerms(Action.ADD_SEARCHTERMS, dataSet.searchTerms));
			yield fork(nonBlockingLoadImages, dataSet.resultSets.ads);
		}
		yield put(Action.loadingData());
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
	}
}

function* keyWordSearch(action: AnyAction): TypedSaga {
	if (action.keyWord.length < 3 || action.keyWord.match(/^ *$/)) {
		return;
	}
	action.keyWord = action.keyWord.replace(/ {2,}/g, ' ');
	try {
		yield put(Action.loadingData(true, true));
		const dataSet = yield call(AdInfo.searchAdvertise, {
			searchByKeyword: 1,
			adKeyword: action.keyWord,
		});
		if (dataSet.error) {
			yield put(Action.messageCenter(Action.ADD_MESSAGE, dataSet.error, true));
		} else {
			yield put(Action.fetchAdvertisesSuccess(dataSet.resultSets));
			yield put(Action.messageCenter(Action.CLEAR_MESSAGE));
			yield fork(nonBlockingLoadImages, dataSet.resultSets.ads);
		}
		yield put(Action.loadingData());
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
	}
}

function* selectSearchTerm(action: AnyAction): TypedSaga {
	try {
		yield put(Action.loadingData(true, true));
		const newSearchTermsData = yield call(AdInfo.searchTerm, action.term);
		yield put(Action.searchTerms(Action.ADD_SEARCHTERMS, newSearchTermsData.searchTerms));
		yield put(Action.updateStateModelData(newSearchTermsData.searchData));
		const requestData = yield select((state: { MODELS: Record<string, any> }) => state.MODELS);
		requestData.start = 0;
		const dataSet = yield call(AdInfo.searchAdvertise, requestData);
		if (dataSet.error) {
			yield put(Action.messageCenter(Action.ADD_MESSAGE, dataSet.error, true));
		} else {
			yield put(Action.fetchAdvertisesSuccess(dataSet.resultSets));
			yield fork(nonBlockingLoadImages, dataSet.resultSets.ads);
		}
		yield put(Action.loadingData());
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
	}
}

function* fetchUserAdvertise(action: AnyAction): TypedSaga {
	try {
		yield put(Action.loadingData(true, true));
		const dataSet = yield call(AdInfo.fetchUserAdvertise, action.advertiseId);
		if (dataSet.error) {
			yield put(Action.messageCenter(Action.ADD_MESSAGE, dataSet.error, true));
		} else {
			yield put(Action.updateStateModelData(dataSet.resultSets));
		}
		yield put(Action.loadingData());
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
	}
}

function* fetchVisitorAdvertise(): TypedSaga {
	try {
		yield put(Action.loadingData(true, true));
		const dataSet = yield call(AdInfo.fetchVisitorAdvertise);
		if (dataSet.error) {
			yield put(Action.messageCenter(Action.ADD_MESSAGE, dataSet.error, true));
		} else {
			yield put(Action.updateStateModelData(dataSet.resultSets));
		}
		yield put(Action.loadingData());
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
	}
}

function* fetchUserData(action: AnyAction): TypedSaga {
	try {
		yield put(Action.loadingData(true, true));
		const [...dataSets] = yield all(
			action.args.map((arg: Omit<UserDataFetchArg, 'page'> & { page?: UserDataFetchArg['page'] }) =>
				call(UserFunction.fetchUserDataFromServer, { ...arg, page: arg.page })
			)
		);
		if (dataSets.length) {
			yield put(Action.fetchUserDataSuccess(dataSets));
		} else {
			yield put(Action.messageCenter(Action.ADD_MESSAGE, getLabel('unknown_error'), true));
		}
		yield put(Action.loadingData());
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
	}
}

function* viewLargeImages(action: AnyAction): TypedSaga {
	yield fork(AdInfo.viewImages, action.currentImageId);
}

function* nonBlockingLoadImages(ads: { picture_id: string | number }[]): TypedSaga {
	const images = yield call(asyncLoadImages, ads);
	yield put(Action.asyncImageLoaded(images));
}

function asyncLoadImages(ads: { picture_id: string | number }[]): Promise<string[]> {
	return Promise.all(
		ads.map((ad) => {
			return new Promise<string>((res) => {
				let img = new Image();
				img.src = `${smallImageSrc}${ad.picture_id}.jpg`;
				img.onload = () => {
					res('' + ad.picture_id);
				};
			});
		})
	);
}

function* sendFormData(action: AnyAction): TypedSaga {
	try {
		const { formName, post } = action;
		if (post) {
			yield put(Action.loadingData(true)); // turn on spinner for post form submission
		}

		const { data }: ApiResponse = yield call(submitFormData, formName, post);

		if (data.sessionExpire) {
			route.location('user-account');
		} else if (data.error) {
			yield put(Action.messageCenter(Action.ADD_MESSAGE, data.error, true));
		} else {
			if (post) {
				yield put(Action.loadingData()); // turn off spinner for post form submission

				if (data.load) {
					Cache.clear();
					yield put(Action.messageCenter(Action.CLEAR_MESSAGE));
					route.location(`ad-detail/${data.load}`);
				}
			} else {
				yield put(Action.setActionBox({ box: null }));
				yield put(Action.addErrors());
				if (routes[formName] && routes[formName]['page']) {
					if (data.user) {
						yield put(Action.fetchUserData([{ dataKey: 'profile' }]));
					}
					route.location(routes[formName]['page']);
				}
			}

			if (data.message) {
				yield put(Action.messageCenter(Action.ADD_MESSAGE, data.message));
			}
		}
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
		yield put(Action.loadingData());
	}
}

function* signUserOut(): TypedSaga {
	try {
		const { data }: ApiResponse = yield call(signOut);
		if (data.ok) {
			yield put(Action.fetchUserDataSuccess([{ profile: null }, { ads: null }]));
			yield put(Action.userSignedOut());
		} else {
			yield put(Action.messageCenter(Action.ADD_MESSAGE, data, true));
		}
	} catch (error) {
		yield put(Action.messageCenter(Action.ADD_MESSAGE, error, true));
	}
}

/*
 * @description list of saga events, add whatever is needed
 */
export default function* RootSaga(): TypedSaga {
	yield all([
		takeLatest(Action.FETCH_ADVERTISES, fetchAdvertises),
		takeLatest(Action.FETCH_ADVERTISE, fetchAdvertise),
		takeLatest(Action.SEARCH_ADVERTISE, searchAdvertise),
		takeLatest(Action.SELECT_SEARCH_TERM, selectSearchTerm),
		takeLatest(Action.FETCH_USER_ADVERTISE, fetchUserAdvertise),
		takeLatest(Action.FETCH_VISITOR_ADVERTISE, fetchVisitorAdvertise),
		takeLatest(Action.KEY_WORD_SEARCH, keyWordSearch),
		takeLatest(Action.VIEW_LARGE_IMAGES, viewLargeImages),
		takeEvery(Action.FETCH_USER_DATA, fetchUserData),
		takeEvery(Action.SEND_FORM_DATA, sendFormData),
		takeEvery(Action.SIGN_OUT, signUserOut),
	]);
}
