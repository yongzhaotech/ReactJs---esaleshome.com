export const FETCH_ADVERTISES = 'FETCH_ADVERTISES';
export const FETCH_ADVERTISE = 'FETCH_ADVERTISE';
export const FETCH_ADVERTISES_SUCCESS = 'FETCH_ADVERTISES_SUCCESS';
export const SEARCH_ADVERTISE = 'SEARCH_ADVERTISE';
export const PERFORM_SEARCH = 'PERFORM_SEARCH';
export const FETCH_ADVERTISE_SUCCESS = 'FETCH_ADVERTISE_SUCCESS';
export const SELECT_SEARCH_TERM = 'SELECT_SEARCH_TERM';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
export const ADD_SEARCHTERMS = 'ADD_SEARCHTERMS';
export const CLEAR_SEARCHTERMS = 'CLEAR_SEARCHTERMS';
export const LOADING_DATA = 'LOADING_DATA';
export const SWITCH_LANGUAGE = 'SWITCH_LANGUAGE';
export const CHANGE_AD_KEY_WORD = 'CHANGE_AD_KEY_WORD';
export const UPDATE_STATE_MODEL_DATA = 'UPDATE_STATE_MODEL_DATA';
export const CLEAR_STATE_MODEL_DATA = 'CLEAR_STATE_MODEL_DATA';
export const SET_DROP_DWON_MENUS = 'SET_DROP_DWON_MENUS';
export const SET_MENU_BOX_REFERENCE = 'SET_MENU_BOX_REFERENCE';
export const SET_ACTION_BOX_REFERENCE = 'SET_ACTION_BOX_REFERENCE';
export const SET_MESSAGE_BOX_REFERENCE = 'SET_MESSAGE_BOX_REFERENCE';
export const SET_ACTION_BOX = 'SET_ACTION_BOX';
export const ADD_ERRORS = 'ADD_ERRORS';
export const ADD_POSTERRORS = 'ADD_POSTERRORS';
export const CLEAR_POSTERRORS = 'CLEAR_POSTERRORS';
export const USER_SIGNED_IN = 'USER_SIGNED_IN';
export const USER_SIGNED_OUT = 'USER_SIGNED_OUT';
export const FETCH_USER_DATA = 'FETCH_USER_DATA';
export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS';
export const CHANGE_COLUMN_NUMBER = 'CHANGE_COLUMN_NUMBER';
export const FETCH_USER_ADVERTISE = 'FETCH_USER_ADVERTISE';
export const FETCH_VISITOR_ADVERTISE = 'FETCH_VISITOR_ADVERTISE';
export const SAVE_STATE_OBJECTS = 'SAVE_STATE_OBJECTS';
export const ASYNC_IMAGE_LOADED = 'ASYNC_IMAGE_LOADED';
export const LOADING_LARGE_IMAGE_COUNT = 'LOADING_LARGE_IMAGE_COUNT';
export const VIEW_LARGE_IMAGES = 'VIEW_LARGE_IMAGES';
export const KEY_WORD_SEARCH = 'KEY_WORD_SEARCH';
export const SELECT_PAYMENT_OPTION = 'SELECT_PAYMENT_OPTION';
export const DECREASE_SUBSCRIBER = 'DECREASE_SUBSCRIBER';
export const INCREASE_SUBSCRIBER = 'INCREASE_SUBSCRIBER';
export const SET_CURRENT_SUBSCRIBER = 'SET_CURRENT_SUBSCRIBER';
export const UNSET_CURRENT_SUBSCRIBER = 'UNSET_CURRENT_SUBSCRIBER';
export const CHANGE_SUBSCRIBER_NAME = 'CHANGE_SUBSCRIBER_NAME';
export const CHANGE_SUBSCRIBER_PHONE = 'CHANGE_SUBSCRIBER_PHONE';
export const KEEP_CURRENT_PHONE = 'KEEP_CURRENT_PHONE';
export const SELECT_CITY = 'SELECT_CITY';

/*
 * @description action creators
 */
export const loadingLargeImageCount = (message = '') => ({
	type: LOADING_LARGE_IMAGE_COUNT,
	message
});	
 
export const asyncImageLoaded = images => ({
	type: ASYNC_IMAGE_LOADED,
	images
});	
 
export const viewLargeImages = currentImageId => ({
	type: VIEW_LARGE_IMAGES,
	currentImageId
});
 
export const fetchAdvertises = (start = 0) => ({
	type: FETCH_ADVERTISES,
	start
});

export const fetchAdvertisesSuccess = resultSets => ({
	type: FETCH_ADVERTISES_SUCCESS,
	resultSets
});

export const fetchAdvertiseSuccess = advertiseDetail => ({
	type: FETCH_ADVERTISE_SUCCESS,
	advertiseDetail
});

export const searchAdvertise = (start = 0) => ({
	type: SEARCH_ADVERTISE,
	start
});

export const fetchAdvertise = advertiseId => ({
	type: FETCH_ADVERTISE,
	advertiseId
});

export const selectSearchTerm = term => ({
	type: SELECT_SEARCH_TERM,
	term
});

export const performSearch = () => ({
	type: PERFORM_SEARCH
});

export const messageCenter = (type, message = '', error = false, callbacks = null) => ({
	type,
	message,
	error,
	callbacks
});

export const searchTerms = (type, terms = []) => ({
	type,
	terms
}); 

export const loadingData = (flag = false, hideTitle = false, loadingLargeImages = false) => ({
	type: LOADING_DATA,
	flag,
	hideTitle,
	loadingLargeImages
});

export const selectCity = (cityId, cityObj, search = '') => ({
	type: search ? 'SELECT_CITY_SEARCH' : 'SELECT_CITY',
	[`cityId${search}`]: cityId,
	[`cityObj${search}`]: cityObj,
	search
});

export const selectProv = (provId, provObj, search = '') => ({
	type: search ? 'SELECT_PROVINCE_SEARCH' : 'SELECT_PROVINCE',
	[`provId${search}`]: provId,
	[`provObj${search}`]: provObj,
	search
});

export const selectItem = (itemId, itemObj, search = '') => ({
	type: search ? 'SELECT_ITEM_SEARCH' : 'SELECT_ITEM',
	[`itemId${search}`]: itemId,
	[`itemObj${search}`]: itemObj,
	search
});

export const selectCat = (catId, catObj, search = '') => ({
	type: search ? 'SELECT_CATEGORY_SEARCH' : 'SELECT_CATEGORY',
	[`catId${search}`]: catId,
	[`catObj${search}`]: catObj,
	search
});

export const expandCity = (expandCity, search = '') => ({
	type: search ? 'EXPAND_CITY_SEARCH' : 'EXPAND_CITY',
	[`expandCity${search}`]: expandCity,
	search
});

export const expandProv = (expandProv, search = '') => ({
	type: search ? 'EXPAND_PROVINCE_SEARCH' : 'EXPAND_PROVINCE',
	[`expandProv${search}`]: expandProv,
	search
});

export const expandItem = (expandItem, search = '') => ({
	type: search ? 'EXPAND_ITEM_SEARCH' : 'EXPAND_ITEM',
	[`expandItem${search}`]: expandItem,
	search
});

export const expandCat = (expandCat, search = '') => ({
	type: search ? 'EXPAND_CATEGORY_SEARCH' : 'EXPAND_CATEGORY',
	[`expandCat${search}`]: expandCat,
	search
});

export const changeAdKeyword = adKeyword => ({
	type: 'CHANGE_AD_KEY_WORD',
	adKeyword
});

export const updateStateModelData = modelData => ({
	type: UPDATE_STATE_MODEL_DATA,
	modelData
});

export const clearStateModelData = () => ({
	type: CLEAR_STATE_MODEL_DATA
});

export const switchLanguage = () => ({
	type: SWITCH_LANGUAGE
});

export const setDropDownMenus = () => ({
	type: SET_DROP_DWON_MENUS
});

export const setMenuBoxReference = menuBoxReference => ({
	type: SET_MENU_BOX_REFERENCE,
	menuBoxReference
});

export const setActionBoxReference = actionBoxReference => ({
	type: SET_ACTION_BOX_REFERENCE,
	actionBoxReference
});

export const setMessageBoxReference = messageBoxReference => ({
	type: SET_MESSAGE_BOX_REFERENCE,
	messageBoxReference
});

export const setActionBox = box => ({
	type: SET_ACTION_BOX,
	box
});

export const addErrors = (errors = {}) => ({
	type: ADD_ERRORS,
	errors
});

export const addPostErrors = (errors = {}) => ({
	type: ADD_POSTERRORS,
	errors
});

export const clearPostErrors = () => ({
	type: CLEAR_POSTERRORS
});

export const userSignedIn = () => ({
	type: USER_SIGNED_IN
});

export const userSignedOut = () => ({
	type: USER_SIGNED_OUT
});

export const fetchUserAdvertise = advertiseId => ({
	type: FETCH_USER_ADVERTISE,
	advertiseId
});

export const fetchVisitorAdvertise = () => ({
	type: FETCH_VISITOR_ADVERTISE
});

export const fetchUserData = args => ({
	type: FETCH_USER_DATA,
	args
});

export const fetchUserDataSuccess = dataSets => ({
	type: FETCH_USER_DATA_SUCCESS,
	dataSets
});

export const changeColumnNumber = numberValue => ({
	type: CHANGE_COLUMN_NUMBER,
	numberValue
});

export const saveStateObjects = objects => ({
	type: SAVE_STATE_OBJECTS,
	objects
});

export const keyWordSearch = keyWord => ({
	type: KEY_WORD_SEARCH,
	keyWord
});

export const selectPaymentOption = (option, selected = false) => ({
	type: SELECT_PAYMENT_OPTION,
	option,
	selected
});

export const decreaseSubscriber = () => ({
	type: DECREASE_SUBSCRIBER
});

export const increaseSubscriber = () => ({
	type: INCREASE_SUBSCRIBER
});

export const setCurrentSubscriber = (currentSubscriberNumber = 1) => ({
	type: SET_CURRENT_SUBSCRIBER,
	currentSubscriberNumber
});

export const unSetCurrentSubscriber = () => ({
	type: UNSET_CURRENT_SUBSCRIBER
});

export const changeSubscriberName = (number, name) => ({
	type: CHANGE_SUBSCRIBER_NAME,
	number,
	name
});

export const changeSubscriberPhone = (number, phone) => ({
	type: CHANGE_SUBSCRIBER_PHONE,
	number,
	phone
});

export const keepCurrentPhone = (number, keep) => ({
	type: KEEP_CURRENT_PHONE,
	number,
	keep
});

export const selectSubscriberCity = (number, cityId) => ({
	type: SELECT_CITY,
	number,
	cityId
});
