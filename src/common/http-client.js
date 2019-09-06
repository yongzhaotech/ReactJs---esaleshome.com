import { Helper } from './js-funcs';
import { getLabel } from './label';
import { Cache } from './cache';
import { Engine } from './engine';
import { host } from './config';
import {
	fetchUserData,
	loadingData
} from '../action';

const types = {
	'hidden': 1, 'text': 1, 'textarea': 1, 'file': 1, 'password': 1, 'select-one': 1
},
routes = {
	ask_poster_form: {
		script: 'request'
	},
	contact_us_form: {
		script: 'request'
	},
	email_friend_form: {
		script: 'request'
	},
	find_visitor_ad_form: {
		script: 'request',
		page: 'visitor-ad/edit'
	},
	forget_password_form: {
		script: 'forget-password'
	},
	login_form: {
		script: 'sign-in',
		page: 'user-account'
	},
	register_form: {
		script: 'register'
	},
	change_user_profile: {
		script: 'change-user-profile',
		action: 'change_user_profile'
	},
    reset_password: {
        script: 'reset-password',
		page: 'user-account'
	}
},
endPoint = script => script.split('/').pop(),
submit = data => {
	Helper.hits(data.script);

	return new Promise((res, rej) => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			if(xhr.status === 200) {
				res({data:xhr.response});
			}else {
				rej({error: getLabel('backend_error')});
			}
		};
		xhr.onerror = () => {
			rej({error: getLabel('ui_error')});
		};

		xhr.open("post", `${host}/${data.script}`, true);
		xhr.withCredentials = true;
        xhr.responseType = "json";

		if(data.formData) {
			xhr.send(new FormData(data.form));
		}else {
			xhr.setRequestHeader("Content-Type", data.contentType);
			xhr.send(data.requestData.join("&"));
		}
	});
},
sendRequest = (data, script, cache = {}) => {
	let cacheKey,
        cacheData;

	if(cache.requireCache) {
        cacheKey = Cache.key(script, cache.requestData);
        cacheData = Cache.get(cacheKey);
        if(cacheData) {
        	return Promise.resolve(cacheData);
		}
	}
	
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
			if(xhr.status === 200) {
				if(cache.requireCache) {
					Cache.add(cacheKey, {data:xhr.response});
				}
				res({data:xhr.response});
				if(xhr.response.sessionExpire) {
					Helper.location('user-account');
				}
			}else {
				rej({error: getLabel('backend_error')});
			}
        };
        xhr.onerror = () => {
            rej({error: getLabel('ui_error')});
        };
        xhr.open("post", `${host}/${script}`, true);
		xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.responseType = "json";
        xhr.send(data.join("&"));
    });
},
ServerRequest = (script, requestData, cache = {}) => {
    const segments = [];
    for (let key in requestData) {
        segments.push(`${key}=${requestData[key]}`);
    }

    if (requestData.action !== 'hits') {
        Helper.hits(`${script}?${requestData.action}`);
    }

    return sendRequest(segments, script, cache);
},
Http = {
    ServerRequest: ServerRequest,

	Post: f => {
		let [formData, contentType] = (f.enctype && f.enctype === 'multipart/form-data') ? [true, f.enctype] : [false, 'application/x-www-form-urlencoded; charset=UTF-8'];
		let data = { requestData: [], formData: formData, contentType: contentType, script: endPoint(f.action), form: f };
		for(let elem of Array.from(f.elements).filter(e => e.type.toLowerCase() in types)) {
			if(!formData) {
				data.requestData.push(elem.name + '=' + elem.value);
			}
		}

		submit(data).then(promise => {
			Engine.dispatch(loadingData());
			if(promise.data.sessionExpire) {
				Helper.location('user-account');
			}else if(promise.data.error) {
				Helper.addMessage(promise.data.error, true);
			}else {
				let messages = promise.data.message || [];
				if(promise.data.load) {
					Cache.clear();
					setTimeout(() => {
						Helper.clearMessage(null, true);
						Helper.location(`ad-detail/${promise.data.load}`);
					}, 5000);
				}
				
				if(messages.length) {
					Helper.addMessage(messages);
				}
			}
		}).catch(reason => {
			Engine.dispatch(loadingData());
			return reason.error;
		});
	},
	
	Request: f => {
		const segments = [],
			script = (routes[f.name] && routes[f.name]['script']) || 'server_request',
			action = (routes[f.name] && routes[f.name]['action']) || Engine.store().BOXES.box;
		for(let elem of Array.from(f.elements).filter(e => e.type.toLowerCase() in types)) {
			segments.push(`${elem.name}=${elem.value}`);
		}
		segments.push(`action=${action}`);
        Helper.hits(`${script}?${Engine.store().BOXES.box}`);

		return sendRequest(segments, script);
	},

	Fetch: (script, requestData) => ServerRequest(script, requestData, {requireCache: true, requestData: requestData}),
	
	/**
	 * @description when the promise is fullfilled, do something interactively
	 */
	AfterRequest: (frm, promise) => {
		if(promise.data.sessionExpire) {
			Helper.location('user-account');
		}else if(promise.data.error) {
			Helper.addMessage(promise.data.error, true);
		}else {
			Helper.detachActionBox();
			if(routes[frm.name] && routes[frm.name]['page']) {
				if(promise.data.user) {
					Engine.dispatch(fetchUserData([{dataKey: 'profile'}]));
				}
				Helper.location(routes[frm.name]['page']);
			}else if(promise.data.message) {
				Helper.addMessage(promise.data.message);
				Helper.detachActionBox();
			}
		}
	}
};

export { Http };