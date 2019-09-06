import React from 'react';
import { Helper } from './js-funcs';
import {
	expandCity,
	expandProv,
	expandItem,
	expandCat
} from '../action';

let reduxStore = null,
	reactCookie = null,
	routeParams = null,
	routeHistory = null,
	timeOutId = null;

const keys = {
	tab:    9,
	enter:  13,
	esc:    27,
	space:  32,
	left:   37,
	up:     38,
	right:  39,
	down:   40
},
getCookie = name => reactCookie && reactCookie.get(name, { path: '/' }),
findAncestor = (node, token) => {
	const types = {'#': 'id', '.': 'className'},
		[type, match] = [token.charAt(0), token.substring(1)];
	while(node !== null) {
		if(match === node[types[type]]) { return true; }
		node = node.parentNode;
	}
	return false;
},
Engine = {
	register: (store = null) => {
		if(store !== null) {
			reduxStore = store;
		}else {
			return reduxStore;
		}
	},
	
	cookie: (cookie = null) => {
		if(cookie !== null) {
			reactCookie = cookie;
		}else {
			return reactCookie;
		}
	},
	
	route: (...args) => {
		[routeParams, routeHistory] = args;
	},
	
	store: () => reduxStore.getState(),
	
	dispatch: arg => reduxStore.dispatch(arg),
	
	setCookie: (name, value) => {
		reactCookie && reactCookie.set(name, value, { path: '/' });
	},

	userSignedIn: () => !!getCookie('user_is_signed_in'),
	
	param: name => routeParams[name],
	
	path: () => routeHistory.location.pathname,
	
	pathName: () => routeHistory.location.pathname || 'unknown',
	
	location: path => {
		routeHistory.push({
			pathname: path ? `/ads/${path}` : `/ads`
		});		
	},

	goBack: () => {
		routeHistory.goBack();
	},
	
    component: (Comp, props = {}) => (<Comp {...props} />),
	
	getCookie: getCookie,

	registerEvents: () => {
		const expands = {
			expandProv: { fn: expandProv, args: [false] },
			expandCity: { fn: expandCity, args: [false] },
			expandCat: { fn: expandCat, args: [false] },
			expandItem: { fn: expandItem, args: [false] },
			expandProvSearch: { fn: expandProv, args: [false, 'Search'] },
			expandCitySearch: { fn: expandCity, args: [false, 'Search'] },
			expandCatSearch: { fn: expandCat, args: [false, 'Search'] },
			expandItemSearch: { fn: expandItem, args: [false, 'Search'] },
		},
		screenClicked = (e) => {
            if(reduxStore.getState().messageCenter.MESSAGEFLAG && !document.querySelector('.message_wrapper').contains(e.target)) { Helper.clearMessage(); }
            if(reduxStore.getState().MENUS && !document.querySelector('#menu_launcher').contains(e.target)) { Helper.clearDropDownMenus(); }
			Object.keys(expands).forEach(item => {
				if(reduxStore.getState().MODELS[item] && !findAncestor(e.target, '.dp_wrapper')) {
					reduxStore.dispatch(expands[item].fn.apply(null, expands[item].args));
				}
			});
        };

        window.addEventListener('click', screenClicked);
	},
	
	keyboardCategoryList: ariaLabel => {
		let categoryOptions = document.querySelectorAll(`div[aria-label=${ariaLabel}] .dp_option`),
			categoryOptionsCount = categoryOptions.length,
			replacer = {
				'category-for-search': 'item-for-search',
				'category-not-search': 'item-not-search',
				'province-for-search': 'city-for-search',
				'province-not-search': 'city-not-search'
			};
			
		if(ariaLabel === 'category-for-search' || ariaLabel === 'category-not-search') {
			document.querySelector(`div[aria-label=${ariaLabel}] button[aria-label='show']`).focus();
		}		
			
		categoryOptions.forEach((option, index) => {
			option.onkeydown = evt => {
				let preventDefault = false;
				switch (evt.keyCode) {
					case keys.down:
						if(index <= categoryOptionsCount - 2) {
							if(document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`).length === 1) {
								categoryOptions[index + 1].click();
								categoryOptions[index + 1].click();
							}
							categoryOptions[index + 1].focus();
						}
						preventDefault = true;
						break;
					case keys.up:
						if(index > 0) {
							if(document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`).length === 1) {
								categoryOptions[index - 1].click();
								categoryOptions[index - 1].click();
							}
							categoryOptions[index - 1].focus();
						}
						preventDefault = true;
						break;
					case keys.esc:
						if(document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`).length > 1) {
							option.click();
						}
						break;
					case keys.enter:
						option.click();
						preventDefault = true;
						break;
					case keys.tab:
						if(evt.shiftKey) {
							if(ariaLabel === 'category-not-search' || ariaLabel === 'category-for-search') {
								document.querySelector('.key-word-search').focus();
							}else if(ariaLabel === 'province-not-search') {
								const email = document.querySelector(`input[name='email']`);
								if(email) {
									email.focus();
								}else {
									const phone = document.querySelector(`input[name='contact_phone']`);
									if(phone) {
										phone.focus();
									}else {
										const contactEmailTab = document.querySelector(`button[aria-label='contact-email-tab']`);
										if(contactEmailTab) {
											contactEmailTab.focus();
										}else {
											const emailTab = document.querySelector(`button[aria-label='email-tab']`);
											emailTab && emailTab.focus();
										}
									}
								}
							}else if(ariaLabel === 'province-for-search') {
								const itemButton = document.querySelector(`div[aria-label='item-for-search'] button[aria-label='show']`);
								if(itemButton) {
									itemButton.focus();
								}else {
									document.querySelector(`div[aria-label='category-for-search'] button[aria-label='show']`).focus();
								}
							}
						}else {
							if(document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`).length > 1) {
								option.click();
							}
							const itemButton = document.querySelector(`div[aria-label=${replacer[ariaLabel]}] button[aria-label='show']`);
							if(itemButton) {
								itemButton.focus();
							}else if(ariaLabel === 'category-for-search') {
								document.querySelector(`div[aria-label='province-for-search'] button[aria-label='show']`).focus();
							}else if(ariaLabel === 'province-for-search') {
								document.querySelector(`input[name='ad_keyword']`).focus();
							}
						}
						preventDefault = true;
						break;
					case keys.space:
						preventDefault = true;
						break;
					default:
						break;
				}
				preventDefault && evt.preventDefault();
			}
		});
	},	
	
	keyboardItemList: ariaLabel => {
		let itemOptions = document.querySelectorAll(`div[aria-label=${ariaLabel}] .dp_option`),
			itemOptionsCount = itemOptions.length,
			replacer = {
				'item-for-search': 'category-for-search',
				'item-not-search': 'category-not-search',
				'city-for-search': 'province-for-search',
				'city-not-search': 'province-not-search'
			};
		itemOptions.forEach((option, index) => {
			option.onkeydown = evt => {
				let preventDefault = false;
				switch (evt.keyCode) {
					case keys.down:
						if(index <= itemOptionsCount - 2) {
							if(document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`).length === 1) {
								itemOptions[index + 1].click();
								itemOptions[index + 1].click();
							}
							itemOptions[index + 1].focus();
						}
						preventDefault = true;
						break;
					case keys.up:
						if(index > 0) {
							if(document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`).length === 1) {
								itemOptions[index - 1].click();
								itemOptions[index - 1].click();
							}
							itemOptions[index - 1].focus();
						}
						preventDefault = true;
						break;
					case keys.enter:
						option.click();
						preventDefault = true;
						break;
					case keys.tab:
						if(evt.shiftKey) {
							document.querySelector(`div[aria-label=${replacer[ariaLabel]}] button[aria-label='show']`).focus();
						}else {
							if(ariaLabel in replacer) {
								if(document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`).length > 1) {
									option.click();
								}
								if(ariaLabel === 'item-not-search') {
									document.querySelector(`input[name='ad_name']`).focus();
								}else if(ariaLabel === 'city-not-search') {
									document.querySelector(`input[name='address']`).focus();
								}else if(ariaLabel === 'item-for-search') {
									document.querySelector(`div[aria-label='province-for-search'] button[aria-label='show']`).focus();
								}else if(ariaLabel === 'city-for-search') {
									document.querySelector(`input[name='ad_keyword']`).focus();
								}
							}
						}
						preventDefault = true;
						break;
					case keys.esc:
						if(document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`).length > 1) {
							option.click();
						}
						break;
					case keys.space:
						preventDefault = true;
						break;
					default:
						break;
				}
				preventDefault && evt.preventDefault();
			}
		});

	},
	
	registerMenuItems: () => {
		let currentIndex = {
				currentButtonIndex: 0,
				currentMenuItemIndex: 0
			},
			navButtons = document.querySelectorAll('#ad_title_bar > .btn_list > .nav_btn'),
			dropMenuItemsContainer = document.querySelector('.dp_menu'),
			dropMenuItems = document.querySelectorAll('.dp_menu > .menu'),
			keyWordSearch = document.querySelector('.key-word-search'),
			navButtonsCount = navButtons.length,
			dropMenuItemsCount = dropMenuItems.length;
			
		const nextIndex = (index, itemsCount, indexType) => {
			if(index < 0) {
				currentIndex[indexType] = itemsCount - 1;
			}else if(index >= itemsCount) {
				currentIndex[indexType] = 0;
			}else {
				currentIndex[indexType] = index;
			}
			return currentIndex[indexType];
		};
			
		navButtons.forEach((button, index) => {
			if(index === 0) {
				button.setAttribute('tabindex', 0);
				button.focus();
			}else {
				button.setAttribute('tabindex', -1);
			}
			button.onkeydown = evt => {
				let preventDefault = false;
				switch (evt.keyCode) {
					case keys.down:
					case keys.enter:
						button.click();
						preventDefault = true;
						if(button.getAttribute('aria-haspopup') === 'true') {
							dropMenuItems[nextIndex(0, dropMenuItemsCount, 'currentButtonIndex')].focus();
						}
						break;
					case keys.right:
						navButtons[nextIndex(index + 1, navButtonsCount, 'currentButtonIndex')].focus();
						break;
					case keys.tab:
						if(!evt.shiftKey) {
							keyWordSearch.focus();
						}
						preventDefault = true;
						break;
					case keys.left:
						navButtons[nextIndex(index - 1, navButtonsCount, 'currentButtonIndex')].focus();
						break;
					default:
						break;
				}
				preventDefault && evt.preventDefault();
			};
		});
		
		dropMenuItems.forEach((item, index) => {
			item.setAttribute('tabindex', -1);
			item.onkeydown = evt => {
				let preventDefault = false;
				switch (evt.keyCode) {
					case keys.enter:
						item.click();
						preventDefault = true;
						break;
					case keys.tab:
						if(evt.shiftKey) {
							preventDefault = true;
						}
						break;
					case keys.right:
						navButtons[nextIndex(currentIndex.currentButtonIndex + 1, navButtonsCount, 'currentButtonIndex')].focus();
						break;
					case keys.left:
						navButtons[nextIndex(currentIndex.currentButtonIndex - 1, navButtonsCount, 'currentButtonIndex')].focus();
						break;
					case keys.up:
						dropMenuItems[nextIndex(currentIndex.currentMenuItemIndex - 1, dropMenuItemsCount, 'currentMenuItemIndex')].focus();
						preventDefault = true;
						break;
					case keys.down:
						dropMenuItems[nextIndex(currentIndex.currentMenuItemIndex + 1, dropMenuItemsCount, 'currentMenuItemIndex')].focus();
						preventDefault = true;
						break;
					case keys.esc:
						if(dropMenuItemsContainer.getAttribute('aria-expanded') === 'true') {
							navButtons[0].click();
							navButtons[0].focus();
						}
						preventDefault = true;
						break;
					default:
						break;
				}
				preventDefault && evt.preventDefault();
			};
		});		
	},
	
	dropMenuBlur: evt => {
		timeOutId = setTimeout(() => {
			Helper.clearDropDownMenus();
		});
	},
	
	dropMenuFocus: evt => {
		if(timeOutId) {
			clearTimeout(timeOutId);
			timeOutId = null;
		}
	}
};

export { Engine };