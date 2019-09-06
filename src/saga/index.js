import { fork, put, takeLatest, takeEvery, call, all, select } from 'redux-saga/effects';
import { AdInfo } from '../common/ad-info';
import { getLabel } from '../common/label';
import * as Action from '../action';
import { UserFunction } from '../user/user-function';
import { smallImageSrc } from '../common/config';

function* fetchAdvertises (action) {
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

function* fetchAdvertise (action) {
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

function* searchAdvertise (action) {
	try {
		yield put(Action.loadingData(true, true));
		const requestData = yield select(state => state.MODELS);
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

function* keyWordSearch (action) {
	if(action.keyWord.length < 3 || action.keyWord.match(/^ *$/)) {
		return;
	}
	action.keyWord = action.keyWord.replace(/ {2,}/g, ' ');
	try {
		yield put(Action.loadingData(true, true));
		const dataSet = yield call(AdInfo.searchAdvertise, {
			searchByKeyword: 1,
			adKeyword: action.keyWord
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

function* selectSearchTerm (action) {
	try {
		yield put(Action.loadingData(true, true));
		const newSearchTermsData = yield call(AdInfo.searchTerm, action.term);
		yield put(Action.searchTerms(Action.ADD_SEARCHTERMS, newSearchTermsData.searchTerms));
		yield put(Action.updateStateModelData(newSearchTermsData.searchData));
		const requestData = yield select(state => state.MODELS);
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

function* fetchUserAdvertise (action) {
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

function* fetchVisitorAdvertise () {
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

function* fetchUserData (action) {
	try {
		yield put(Action.loadingData(true, true));
		const [...dataSets] = yield all(
			action.args.map(
				arg => call(UserFunction.fetchUserDataFromServer, arg)
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

function* viewLargeImages (action) {
	yield fork(AdInfo.viewImages, action.currentImageId);
}

function *nonBlockingLoadImages (ads) {
	const images = yield call(asyncLoadImages, ads);
	yield put(Action.asyncImageLoaded(images));
}

function asyncLoadImages (ads) {
	return Promise.all(ads.map(ad => {
    	return new Promise(res => {
            let img = new Image();
			img.src = `${smallImageSrc}${ad.picture_id}.jpg`;
            img.onload = () => {
				res(''+ad.picture_id);
            };
        });
	})).then(images => images).catch();
}

/*
 * @description list of saga events, add whatever is needed
 */
export default function* RootSaga () {
	yield all([
		fork(takeLatest, Action.FETCH_ADVERTISES, fetchAdvertises),
		fork(takeLatest, Action.FETCH_ADVERTISE, fetchAdvertise),
		fork(takeLatest, Action.SEARCH_ADVERTISE, searchAdvertise),
		fork(takeLatest, Action.SELECT_SEARCH_TERM, selectSearchTerm),
		fork(takeLatest, Action.FETCH_USER_ADVERTISE, fetchUserAdvertise),
		fork(takeLatest, Action.FETCH_VISITOR_ADVERTISE, fetchVisitorAdvertise),
		fork(takeLatest, Action.KEY_WORD_SEARCH, keyWordSearch),
		fork(takeLatest, Action.VIEW_LARGE_IMAGES, viewLargeImages),
		takeEvery(Action.FETCH_USER_DATA, fetchUserData),
	])
};