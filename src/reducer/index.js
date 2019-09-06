import { combineReducers } from 'redux';
import * as Action from '../action';
import { Engine } from '../common/engine';
import { startColumnNumber } from '../common/config';

const advertiseList = (state = {}, action) => {
	switch (action.type) {
		case Action.FETCH_ADVERTISES:
			return { ...state };
		case Action.FETCH_ADVERTISES_SUCCESS:
			return { ...state, resultSets: action.resultSets };
		default:
			return state;
	}
};

const advertiseDetail = (state = null, action) => {
	switch (action.type) {
		case Action.FETCH_ADVERTISE_SUCCESS:
			return action.advertiseDetail;
		default:
			return state;
	}
};

const messageCenter = (state = {}, action) => {
	switch (action.type) {
		case Action.ADD_MESSAGE:
			const messageData = { ...state, MESSAGEFLAG: action.error ? 'error' : 'success', MESSAGE: Array.isArray(action.message) ? action.message : [action.message] };
			return !!action.callbacks ? { ...messageData, ...action.callbacks } : messageData;
		case Action.CLEAR_MESSAGE:
			return { ...state, MESSAGEFLAG: '', MESSAGE: [], functionFlag: false };
		default:
			return state;
	}
};

const searchTerms = (state = [], action) => {
	switch (action.type) {
		case Action.ADD_SEARCHTERMS:
			return action.terms;
		case Action.CLEAR_SEARCHTERMS:
			return [];
		default:
			return state;
	}
};

const loadingData = (state = {}, action) => {
	switch (action.type) {
		case Action.LOADING_DATA:
			return { ...state, ISLOADINGDATA: action.flag || null, HIDELOADINGTITLE: action.hideTitle || null };
		default:
			return state;
	}
};

const changeModelProperty = (state = {}, action) => {
	const prefix = action.search ? '_SEARCH' : '';
	switch (action.type) {
		case `SELECT_CITY${prefix}`:
			return { ...state, [`cityId${action.search}`]: action[`cityId${action.search}`], [`cityObj${action.search}`]: action[`cityObj${action.search}`] };
		case `SELECT_PROVINCE${prefix}`:
			return { ...state, [`provId${action.search}`]: action[`provId${action.search}`], [`provObj${action.search}`]: action[`provObj${action.search}`], [`cityId${action.search}`]: '' };
		case `SELECT_ITEM${prefix}`:
			return { ...state, [`itemId${action.search}`]: action[`itemId${action.search}`], [`itemObj${action.search}`]: action[`itemObj${action.search}`] };
		case `SELECT_CATEGORY${prefix}`:
			return { ...state, [`catId${action.search}`]: action[`catId${action.search}`], [`catObj${action.search}`]: action[`catObj${action.search}`], [`itemId${action.search}`]: '' };
		case `EXPAND_CITY${prefix}`:
			return { ...state, [`expandCity${action.search}`]: action[`expandCity${action.search}`] };
		case `EXPAND_PROVINCE${prefix}`:
			return { ...state, [`expandProv${action.search}`]: action[`expandProv${action.search}`] };
		case `EXPAND_ITEM${prefix}`:
			return { ...state, [`expandItem${action.search}`]: action[`expandItem${action.search}`] };
		case `EXPAND_CATEGORY${prefix}`:
			return { ...state, [`expandCat${action.search}`]: action[`expandCat${action.search}`] };
		case Action.CHANGE_AD_KEY_WORD:
			return { ...state, adKeyword: action.adKeyword };
		case Action.UPDATE_STATE_MODEL_DATA:
			return { ...state, ...action.modelData };
		case Action.CLEAR_STATE_MODEL_DATA:
			return {};
		default:
			return state;
	}
};

const language = (state = 'en', action) => {
	switch (action.type) {
		case Action.SWITCH_LANGUAGE:
			let lang = Engine.getCookie('lang') || 'en';
			lang = lang === 'en' ? 'cn' : 'en';
			Engine.setCookie('lang', lang);
			state = lang;
			return state;
		default:
			state = Engine.getCookie('lang') || 'en';
			return state;
	}
};

const performSearch = (state = false, action) => {
	switch (action.type) {
		case Action.PERFORM_SEARCH:
			return true;
		default:
			return state;
	}
};

const dropDownMenus = (state = false, action) => {
	switch (action.type) {
		case Action.SET_DROP_DWON_MENUS:
			return !state;
		default:
			return state;
	}
};

const menuBoxReference = (state = null, action) => {
	switch (action.type) {
		case Action.SET_MENU_BOX_REFERENCE:
			return action.menuBoxReference;
		default:
			return state;
	}
};

const actionBoxReference = (state = null, action) => {
	switch (action.type) {
		case Action.SET_ACTION_BOX_REFERENCE:
			return action.actionBoxReference;
		default:
			return state;
	}
};

const messageBoxReference = (state = null, action) => {
	switch (action.type) {
		case Action.SET_MESSAGE_BOX_REFERENCE:
			return action.messageBoxReference;
		default:
			return state;
	}
};

const setActionBox = (state = {}, action) => {
	switch (action.type) {
		case Action.SET_ACTION_BOX:
			return action.box;
		default:
			return state;
	}
};

const setPostErrors = (state = {}, action) => {
	switch (action.type) {
		case Action.ADD_POSTERRORS:
			return action.errors;
		case Action.CLEAR_POSTERRORS:
			return {};
		default:
			return state;
	}
};

const setErrors = (state = {}, action) => {
	switch (action.type) {
		case Action.ADD_ERRORS:
			return action.errors;
		default:
			return state;
	}
};

const userDataSet = (state = {}, action) => {
	switch (action.type) {
		case Action.FETCH_USER_DATA_SUCCESS:
			return action.dataSets.reduce(
				(acc, cur) => ({ ...acc, ...cur }), { ...state }
			);
		default:
			return state;
	}
};

const setColumnNumber = (state = startColumnNumber, action) => {
	switch (action.type) {
		case Action.CHANGE_COLUMN_NUMBER:
			return state + action.numberValue;
		default:
			return state;
	}
};

const stateObjects = (state = {}, action) => {
	switch (action.type) {
		case Action.SAVE_STATE_OBJECTS:
			return { ...state, ...action.objects };
		default:
			return state;
	}
};

const asyncLoadedImages = (state = {}, action) => {
	switch (action.type) {
		case Action.ASYNC_IMAGE_LOADED:
			return action.images.reduce(
				(acc, cur) => ({ ...acc, [cur]: true }), { ...state }
			);
		default:
			return state;
	}
};

const loadingImagesMessage = (state = '', action) => {
	switch (action.type) {
		case Action.LOADING_LARGE_IMAGE_COUNT:
			return action.message;
		default:
			return state;
	}
};

const RootReducer = combineReducers({
	advertiseList,
	advertiseDetail,
	messageCenter,
	searchTerms,
	loadingData,
	MODELS: changeModelProperty,
	language,
	performSearch,
	MENUS: dropDownMenus,
	menuBoxReference,
	actionBoxReference,
	messageBoxReference,
	BOXES: setActionBox,
	POSTERRORS: setPostErrors,
	ERRORS: setErrors,
	USER: userDataSet,
	NAVIGATIONCOLUMN: setColumnNumber,
	OBJECTS: stateObjects,
	IMAGES: asyncLoadedImages,
	loadingImagesMessage
});

export default RootReducer;