// TODO: refactor to remove all redux store, dispatch logics, etc. and put them in custom hooks
import React from 'react';
import { Helper } from './js-funcs';
import { expandCity, expandProv, expandItem, expandCat } from '../action';

interface StoreLike {
	getState(): Record<string, any>;
	dispatch(action: any): any;
}

interface CookieLike {
	get(name: string, options: { path: string }): string | undefined;
	set(name: string, value: string, options: { path: string }): void;
}

interface HistoryLike {
	location: { pathname: string };
	push(location: { pathname: string }): void;
	goBack(): void;
}

type SearchListLabel = 'category-for-search' | 'category-not-search' | 'province-for-search' | 'province-not-search';

type ItemListLabel = 'item-for-search' | 'item-not-search' | 'city-for-search' | 'city-not-search';

type MenuIndexKey = 'currentButtonIndex' | 'currentMenuItemIndex';

let reduxStore: StoreLike | null = null,
	reactCookie: CookieLike | null = null,
	routeParams: Record<string, string> = {},
	routeHistory: HistoryLike | null = null,
	timeOutId: ReturnType<typeof setTimeout> | null = null,
	screenClickHandler: ((event: MouseEvent) => void) | null = null;

const keys = {
		tab: 9,
		enter: 13,
		esc: 27,
		space: 32,
		left: 37,
		up: 38,
		right: 39,
		down: 40,
	},
	getCookie = (name: string): string | undefined => (reactCookie ? reactCookie.get(name, { path: '/' }) : undefined),
	findAncestor = (node: Node | null, token: string): boolean => {
		const [type, match] = [token.charAt(0), token.substring(1)];
		while (node !== null) {
			if (node instanceof Element && match === node.getAttribute(type === '#' ? 'id' : 'class')) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	},
	Engine = {
		register: (store?: StoreLike) => {
			if (store) {
				reduxStore = store;
			} else {
				return reduxStore;
			}
		},

		cookie: (cookie?: CookieLike) => {
			if (cookie) {
				reactCookie = cookie;
			} else {
				return reactCookie;
			}
		},

		route: (params: Record<string, string>, history: HistoryLike) => {
			routeParams = params;
			routeHistory = history;
		},

		store: () => {
			if (!reduxStore) {
				throw new Error('Redux store has not been registered');
			}
			return reduxStore.getState();
		},

		dispatch: (arg: any) => {
			if (!reduxStore) {
				throw new Error('Redux store has not been registered');
			}
			return reduxStore.dispatch(arg);
		},

		setCookie: (name: string, value: string) => {
			reactCookie && reactCookie.set(name, value, { path: '/' });
		},

		userSignedIn: () => !!getCookie('user_is_signed_in'),

		param: (name: string) => routeParams[name],

		path: () => {
			if (!routeHistory) {
				throw new Error('Router history has not been registered');
			}
			return routeHistory.location.pathname;
		},

		pathName: () => (routeHistory ? routeHistory.location.pathname || 'unknown' : 'unknown'),

		location: (path?: string) => {
			if (!routeHistory) {
				throw new Error('Router history has not been registered');
			}
			routeHistory.push({
				pathname: path ? `/ads/${path}` : `/ads`,
			});
		},

		goBack: () => {
			if (!routeHistory) {
				throw new Error('Router history has not been registered');
			}
			routeHistory.goBack();
		},

		component: <P extends object>(Comp: React.ComponentType<P>, props?: P) => <Comp {...(props as P)} />,

		getCookie: getCookie,

		registerEvents: () => {
			const store = reduxStore;
			if (!store) {
				throw new Error('Redux store has not been registered');
			}
			const expands: Record<
					string,
					{
						fn: (expanded: boolean, search?: 'Search') => unknown;
						args: [expanded: boolean, search?: 'Search'];
					}
				> = {
					expandProv: { fn: expandProv, args: [false] },
					expandCity: { fn: expandCity, args: [false] },
					expandCat: { fn: expandCat, args: [false] },
					expandItem: { fn: expandItem, args: [false] },
					expandProvSearch: { fn: expandProv, args: [false, 'Search'] },
					expandCitySearch: { fn: expandCity, args: [false, 'Search'] },
					expandCatSearch: { fn: expandCat, args: [false, 'Search'] },
					expandItemSearch: { fn: expandItem, args: [false, 'Search'] },
				},
				screenClicked = (e: MouseEvent) => {
					const state = store.getState();
					const target = e.target as Node;
					const insideDropdown = findAncestor(target, '.dp_wrapper');

					if (
						state.messageCenter.MESSAGEFLAG &&
						!document.querySelector('.message_wrapper')?.contains(target)
					) {
						Helper.clearMessage();
					}
					if (
						state.MENUS &&
						!document.querySelector('#menu_launcher')?.contains(target)
					) {
						Helper.clearDropDownMenus();
					}
					Object.keys(expands).forEach((item) => {
						if (state.MODELS[item] && !insideDropdown) {
							const expand = expands[item];
							expand.fn(expand.args[0], expand.args[1]);
						}
					});
				};

			if (screenClickHandler) {
				window.removeEventListener('click', screenClickHandler);
			}
			screenClickHandler = screenClicked;
			window.addEventListener('click', screenClicked);

			return () => {
				if (screenClickHandler === screenClicked) {
					window.removeEventListener('click', screenClicked);
					screenClickHandler = null;
				}
			};
		},

		keyboardCategoryList: (ariaLabel: SearchListLabel) => {
			let categoryOptions = document.querySelectorAll<HTMLElement>(`div[aria-label=${ariaLabel}] .dp_option`),
				categoryOptionsCount = categoryOptions.length,
				replacer: Record<SearchListLabel, ItemListLabel> = {
					'category-for-search': 'item-for-search',
					'category-not-search': 'item-not-search',
					'province-for-search': 'city-for-search',
					'province-not-search': 'city-not-search',
				};

			if (ariaLabel === 'category-for-search' || ariaLabel === 'category-not-search') {
				document.querySelector<HTMLElement>(`div[aria-label=${ariaLabel}] button[aria-label='show']`)?.focus();
			}

			categoryOptions.forEach((option, index) => {
				option.onkeydown = (evt) => {
					let preventDefault = false;
					switch (evt.keyCode) {
						case keys.down:
							if (index <= categoryOptionsCount - 2) {
								if (
									document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`)
										.length === 1
								) {
									categoryOptions[index + 1].click();
									categoryOptions[index + 1].click();
								}
								categoryOptions[index + 1].focus();
							}
							preventDefault = true;
							break;
						case keys.up:
							if (index > 0) {
								if (
									document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`)
										.length === 1
								) {
									categoryOptions[index - 1].click();
									categoryOptions[index - 1].click();
								}
								categoryOptions[index - 1].focus();
							}
							preventDefault = true;
							break;
						case keys.esc:
							if (
								document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`)
									.length > 1
							) {
								option.click();
							}
							break;
						case keys.enter:
							option.click();
							preventDefault = true;
							break;
						case keys.tab:
							if (evt.shiftKey) {
								if (ariaLabel === 'category-not-search' || ariaLabel === 'category-for-search') {
									document.querySelector<HTMLElement>('.key-word-search')?.focus();
								} else if (ariaLabel === 'province-not-search') {
									const email = document.querySelector<HTMLElement>(`input[name='email']`);
									if (email) {
										email.focus();
									} else {
										const phone =
											document.querySelector<HTMLElement>(`input[name='contact_phone']`);
										if (phone) {
											phone.focus();
										} else {
											const contactEmailTab = document.querySelector<HTMLElement>(
												`button[aria-label='contact-email-tab']`
											);
											if (contactEmailTab) {
												contactEmailTab.focus();
											} else {
												const emailTab =
													document.querySelector<HTMLElement>(
														`button[aria-label='email-tab']`
													);
												emailTab && emailTab.focus();
											}
										}
									}
								} else if (ariaLabel === 'province-for-search') {
									const itemButton = document.querySelector<HTMLElement>(
										`div[aria-label='item-for-search'] button[aria-label='show']`
									);
									if (itemButton) {
										itemButton.focus();
									} else {
										document
											.querySelector<HTMLElement>(
												`div[aria-label='category-for-search'] button[aria-label='show']`
											)
											?.focus();
									}
								}
							} else {
								if (
									document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`)
										.length > 1
								) {
									option.click();
								}
								const itemButton = document.querySelector<HTMLElement>(
									`div[aria-label=${replacer[ariaLabel]}] button[aria-label='show']`
								);
								if (itemButton) {
									itemButton.focus();
								} else if (ariaLabel === 'category-for-search') {
									document
										.querySelector<HTMLElement>(
											`div[aria-label='province-for-search'] button[aria-label='show']`
										)
										?.focus();
								} else if (ariaLabel === 'province-for-search') {
									document.querySelector<HTMLElement>(`input[name='ad_keyword']`)?.focus();
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
				};
			});
		},

		keyboardItemList: (ariaLabel: ItemListLabel) => {
			let itemOptions = document.querySelectorAll<HTMLElement>(`div[aria-label=${ariaLabel}] .dp_option`),
				itemOptionsCount = itemOptions.length,
				replacer: Record<ItemListLabel, SearchListLabel> = {
					'item-for-search': 'category-for-search',
					'item-not-search': 'category-not-search',
					'city-for-search': 'province-for-search',
					'city-not-search': 'province-not-search',
				};
			itemOptions.forEach((option, index) => {
				option.onkeydown = (evt) => {
					let preventDefault = false;
					switch (evt.keyCode) {
						case keys.down:
							if (index <= itemOptionsCount - 2) {
								if (
									document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`)
										.length === 1
								) {
									itemOptions[index + 1].click();
									itemOptions[index + 1].click();
								}
								itemOptions[index + 1].focus();
							}
							preventDefault = true;
							break;
						case keys.up:
							if (index > 0) {
								if (
									document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`)
										.length === 1
								) {
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
							if (evt.shiftKey) {
								document
									.querySelector<HTMLElement>(
										`div[aria-label=${replacer[ariaLabel]}] button[aria-label='show']`
									)
									?.focus();
							} else {
								if (ariaLabel in replacer) {
									if (
										document.querySelectorAll(
											`div[aria-label=${ariaLabel}] button[aria-label='show']`
										).length > 1
									) {
										option.click();
									}
									if (ariaLabel === 'item-not-search') {
										document.querySelector<HTMLElement>(`input[name='ad_name']`)?.focus();
									} else if (ariaLabel === 'city-not-search') {
										document.querySelector<HTMLElement>(`input[name='address']`)?.focus();
									} else if (ariaLabel === 'item-for-search') {
										document
											.querySelector<HTMLElement>(
												`div[aria-label='province-for-search'] button[aria-label='show']`
											)
											?.focus();
									} else if (ariaLabel === 'city-for-search') {
										document.querySelector<HTMLElement>(`input[name='ad_keyword']`)?.focus();
									}
								}
							}
							preventDefault = true;
							break;
						case keys.esc:
							if (
								document.querySelectorAll(`div[aria-label=${ariaLabel}] button[aria-label='show']`)
									.length > 1
							) {
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
				};
			});
		},

		registerMenuItems: () => {
			let currentIndex: Record<MenuIndexKey, number> = {
					currentButtonIndex: 0,
					currentMenuItemIndex: 0,
				},
				navButtons = document.querySelectorAll<HTMLElement>('#ad_title_bar > .btn_list > .nav_btn'),
				dropMenuItemsContainer = document.querySelector<HTMLElement>('.dp_menu'),
				dropMenuItems = document.querySelectorAll<HTMLElement>('.dp_menu > .menu'),
				keyWordSearch = document.querySelector<HTMLElement>('.key-word-search'),
				navButtonsCount = navButtons.length,
				dropMenuItemsCount = dropMenuItems.length;

			const nextIndex = (index: number, itemsCount: number, indexType: MenuIndexKey): number => {
				if (index < 0) {
					currentIndex[indexType] = itemsCount - 1;
				} else if (index >= itemsCount) {
					currentIndex[indexType] = 0;
				} else {
					currentIndex[indexType] = index;
				}
				return currentIndex[indexType];
			};

			navButtons.forEach((button, index) => {
				if (index === 0) {
					button.setAttribute('tabindex', '0');
					button.focus();
				} else {
					button.setAttribute('tabindex', '-1');
				}
				button.onkeydown = (evt) => {
					let preventDefault = false;
					switch (evt.keyCode) {
						case keys.down:
						case keys.enter:
							button.click();
							preventDefault = true;
							if (button.getAttribute('aria-haspopup') === 'true') {
								dropMenuItems[nextIndex(0, dropMenuItemsCount, 'currentButtonIndex')]?.focus();
							}
							break;
						case keys.right:
							navButtons[nextIndex(index + 1, navButtonsCount, 'currentButtonIndex')]?.focus();
							break;
						case keys.tab:
							if (!evt.shiftKey) {
								keyWordSearch?.focus();
							}
							preventDefault = true;
							break;
						case keys.left:
							navButtons[nextIndex(index - 1, navButtonsCount, 'currentButtonIndex')]?.focus();
							break;
						default:
							break;
					}
					preventDefault && evt.preventDefault();
				};
			});

			dropMenuItems.forEach((item, index) => {
				item.setAttribute('tabindex', '-1');
				item.onkeydown = (evt) => {
					let preventDefault = false;
					switch (evt.keyCode) {
						case keys.enter:
							item.click();
							preventDefault = true;
							break;
						case keys.tab:
							if (evt.shiftKey) {
								preventDefault = true;
							}
							break;
						case keys.right:
							navButtons[
								nextIndex(currentIndex.currentButtonIndex + 1, navButtonsCount, 'currentButtonIndex')
							]?.focus();
							break;
						case keys.left:
							navButtons[
								nextIndex(currentIndex.currentButtonIndex - 1, navButtonsCount, 'currentButtonIndex')
							]?.focus();
							break;
						case keys.up:
							dropMenuItems[
								nextIndex(
									currentIndex.currentMenuItemIndex - 1,
									dropMenuItemsCount,
									'currentMenuItemIndex'
								)
							]?.focus();
							preventDefault = true;
							break;
						case keys.down:
							dropMenuItems[
								nextIndex(
									currentIndex.currentMenuItemIndex + 1,
									dropMenuItemsCount,
									'currentMenuItemIndex'
								)
							]?.focus();
							preventDefault = true;
							break;
						case keys.esc:
							if (dropMenuItemsContainer?.getAttribute('aria-expanded') === 'true') {
								navButtons[0]?.click();
								navButtons[0]?.focus();
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

		dropMenuBlur: (_evt: React.FocusEvent<HTMLElement>) => {
			timeOutId = setTimeout(() => {
				Helper.clearDropDownMenus();
			});
		},

		dropMenuFocus: (_evt: React.FocusEvent<HTMLElement>) => {
			if (timeOutId) {
				clearTimeout(timeOutId);
				timeOutId = null;
			}
		},
	};

export { Engine };
