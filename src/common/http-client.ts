import { Helper } from './js-funcs';
import { getLabel } from './label';
import { Cache } from './cache';
import { Engine } from './engine';
import { host } from './config';
import { fetchUserData, loadingData } from '../action';

type RequestData = Record<string, string | number | boolean | undefined | null>;
type ApiData = Record<string, any>;

interface ApiResponse {
	data: ApiData;
}

interface ApiError {
	error: string;
}

interface CacheOptions {
	requireCache?: boolean;
	requestData?: RequestData;
}

interface Route {
	script: string;
	page?: string;
	action?: string;
}

const formControlTypes = new Set(['hidden', 'text', 'textarea', 'file', 'password', 'select-one']);
const routes: Record<string, Route> = {
	ask_poster_form: {
		script: 'request',
	},
	contact_us_form: {
		script: 'request',
	},
	email_friend_form: {
		script: 'request',
	},
	find_visitor_ad_form: {
		script: 'request',
		page: 'visitor-ad/edit',
	},
	forget_password_form: {
		script: 'forget-password',
	},
	login_form: {
		script: 'sign-in',
		page: 'user-account',
	},
	register_form: {
		script: 'register',
	},
	change_user_profile: {
		script: 'change-user-profile',
		action: 'change_user_profile',
	},
	reset_password: {
		script: 'reset-password',
		page: 'user-account',
	},
};

const pathName = (): string => Engine.pathName();

const endPoint = (script: string): string => script.split('/').pop() || '';

const sendRequest = (data: string[], script: string, cache: CacheOptions = {}): Promise<ApiResponse> => {
	let cacheKey: string | undefined,
		cacheData: ApiResponse | null = null;

	if (cache.requireCache) {
		cacheKey = Cache.key(script, cache.requestData);
		cacheData = Cache.get<ApiResponse>(cacheKey);
		if (cacheData) {
			return Promise.resolve(cacheData);
		}
	}

	return new Promise((res, rej) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = () => {
			if (xhr.status === 200) {
				if (cache.requireCache) {
					if (cacheKey) {
						Cache.add(cacheKey, { data: xhr.response as ApiData });
					}
				}
				const response: ApiResponse = { data: xhr.response as ApiData };
				res(response);
				if (response.data.sessionExpire) {
					Helper.location('user-account');
				}
			} else {
				rej({ error: getLabel('backend_error') } as ApiError);
			}
		};
		xhr.onerror = () => {
			rej({ error: getLabel('ui_error') } as ApiError);
		};
		xhr.open('post', `${host}/${script}`, true);
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xhr.responseType = 'json';
		xhr.send(data.join('&'));
	});
};

const ServerRequest = (script: string, requestData: RequestData, cache: CacheOptions = {}): Promise<ApiResponse> => {
	const segments = [];
	for (let key in requestData) {
		segments.push(`${key}=${requestData[key]}`);
	}

	if (requestData.action !== 'hits') {
		trackHit(`${script}?${requestData.action}`);
	}

	return sendRequest(segments, script, cache);
};

const trackHit = (page?: string | null) => {
	ServerRequest('request', { action: 'hits', uri: page ? page : pathName() })
		.then(() => {})
		.catch(() => {});
};

const submit = (data: {
	requestData: string[];
	formData: boolean;
	contentType: string;
	script: string;
	form: HTMLFormElement;
}): Promise<ApiResponse> => {
	trackHit(data.script);

	return new Promise((res, rej) => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			if (xhr.status === 200) {
				res({ data: xhr.response as ApiData });
			} else {
				rej({ error: getLabel('backend_error') } as ApiError);
			}
		};
		xhr.onerror = () => {
			rej({ error: getLabel('ui_error') } as ApiError);
		};

		xhr.open('post', `${host}/${data.script}`, true);
		xhr.withCredentials = true;
		xhr.responseType = 'json';

		if (data.formData) {
			xhr.send(new FormData(data.form));
		} else {
			xhr.setRequestHeader('Content-Type', data.contentType);
			xhr.send(data.requestData.join('&'));
		}
	});
};

const Http = {
	ServerRequest,

	Post: (f: HTMLFormElement): void => {
		let [formData, contentType] =
			f.enctype && f.enctype === 'multipart/form-data'
				? [true, f.enctype]
				: [false, 'application/x-www-form-urlencoded; charset=UTF-8'];
		const data = {
			requestData: [] as string[],
			formData: formData,
			contentType: contentType,
			script: endPoint(f.action),
			form: f,
		};
		for (const elem of Array.from(f.elements).filter(
			(element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
				(element instanceof HTMLInputElement ||
					element instanceof HTMLSelectElement ||
					element instanceof HTMLTextAreaElement) &&
				formControlTypes.has(element.type.toLowerCase())
		)) {
			if (!formData) {
				data.requestData.push(elem.name + '=' + elem.value);
			}
		}

		submit(data)
			.then((promise) => {
				Engine.dispatch(loadingData());
				if (promise.data.sessionExpire) {
					Helper.location('user-account');
				} else if (promise.data.error) {
					Helper.addMessage(promise.data.error, true);
				} else {
					let messages = promise.data.message || [];
					if (promise.data.load) {
						Cache.clear();
						setTimeout(() => {
							Helper.clearMessage(null, true);
							Helper.location(`ad-detail/${promise.data.load}`);
						}, 5000);
					}

					if (messages.length) {
						Helper.addMessage(messages);
					}
				}
			})
			.catch((reason: ApiError) => {
				Engine.dispatch(loadingData());
				return reason.error;
			});
	},

	Request: (f: HTMLFormElement): Promise<ApiResponse> => {
		const segments = [],
			script = (routes[f.name] && routes[f.name]['script']) || 'server_request',
			action = (routes[f.name] && routes[f.name]['action']) || Engine.store().BOXES.box;
		for (const elem of Array.from(f.elements).filter(
			(element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
				(element instanceof HTMLInputElement ||
					element instanceof HTMLSelectElement ||
					element instanceof HTMLTextAreaElement) &&
				formControlTypes.has(element.type.toLowerCase())
		)) {
			segments.push(`${elem.name}=${elem.value}`);
		}
		segments.push(`action=${action}`);
		trackHit(`${script}?${Engine.store().BOXES.box}`);

		return sendRequest(segments, script);
	},

	Fetch: (script: string, requestData: RequestData): Promise<ApiResponse> =>
		ServerRequest(script, requestData, { requireCache: true, requestData: requestData }),

	/**
	 * @description when the promise is fullfilled, do something interactively
	 */
	AfterRequest: (frm: HTMLFormElement, promise: ApiResponse): void => {
		if (promise.data.sessionExpire) {
			Helper.location('user-account');
		} else if (promise.data.error) {
			Helper.addMessage(promise.data.error, true);
		} else {
			Helper.detachActionBox();
			if (routes[frm.name] && routes[frm.name]['page']) {
				if (promise.data.user) {
					Engine.dispatch(fetchUserData([{ dataKey: 'profile' }]));
				}
				Helper.location(routes[frm.name]['page']);
			} else if (promise.data.message) {
				Helper.addMessage(promise.data.message);
				Helper.detachActionBox();
			}
		}
	},
};

export { Http };
