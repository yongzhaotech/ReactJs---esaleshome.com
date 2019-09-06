import { Http } from './http-client';
import { Helper } from './js-funcs';
import { Engine } from './engine';
import { loadingData } from '../action';

const validEmail = eml => {
	return eml.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);	
};

const validPhone = ph => {
	return ph.match(/^\d{10,20}$/);
};

const validMoneyAmount = amt => {
	return +amt * 0 === 0;
};

const getElementValue = (f, e) => {
    if(e.type.match(/^radio$/i)) {
        for(let i = 0; i < f[e.name].length; i++) {
            if(f[e.name][i].checked) {
                return f[e.name][i].value;
            }
        }
		return '';
    }else if(e.type.match(/^checkbox$/i)) {
        let v = [];
        for(let i = 0; i < f[e.name].length; i++) {
            if(f[e.name][i].checked) {
                v.push(f[e.name][i].value);
            }
        }
        return v.join(",");
    }else {
        return e.value;
    }
};

const validateInputFields = (f, data) => {
	let error = {};
	for(let field in data) {
		if(field.match(/^(?:(contact_name|first_name|last_name))$/)) {
			let n = RegExp.$1;
			if(data[field] === '') {
				error[field] = 'r_' + n;
			}
		}else if(field.match(/^email$/)) {
			if(data[field] === '') {
				error[field] = 'r_email';
			}else if(!validEmail(data[field])) {
				error[field] = 'w_email';
			}
		}else if(field.match(/^friend_email$/)) {
			if(data[field] === '') {
				error[field] = 'r_friend_email';
			}else if(!validEmail(data[field])) {
				error[field] = 'w_friend_email';
			}
		}else if(field.match(/^contact_message$/)) {
			if(data[field] === '') {
				error[field] = 'r_contact_message';
			}
		}else if(field.match(/^ad_name$/)) {
			if(data[field] === '') {
				error[field] = 'r_ad_name';
			}
		}else if(field.match(/^is_free$/)) {
			if(data[field] === '') {
				error[field] = 'r_is_free';
			}
		}else if(field.match(/^currency$/)) {
			if(data[field] === '') {
				error[field] = 'r_currency';
			}
		}else if(field.match(/^contact_method$/)) {
			if(data[field] === '') {
				error[field] = 'r_contact_method';
			}
		}else if(field.match(/^contact_phone$/)) {
			if(!f[field].disabled) {
				if(data[field] === '') {
					error[field] = 'r_contact_phone';
				}else if(!validPhone(data[field])) {
					error[field] = 'w_contact_phone';
				}
			}
		}else if(field.match(/^message$/)) {
			if(data[field] === '') {
				error[field] = 'r_message';
			}
		}else if(field.match(/^price$/)) {
			if(!f[field].disabled) {
				if(data[field] === '') {
					error[field] = 'r_price';
				}else if(!validMoneyAmount(data[field])) {
					error[field] = 'w_price';
				}
			}
		}else if(field.match(/^((confirm_)?new_)?password$/)) {
			if(data[field] === '') {
				if(!f.name.match(/^change_user_profile$/)) {
					error[field] = 'r_' + field;
				}
			}else if(!(data[field].match(/[a-z]+/i) && data[field].match(/\d+/) && data[field].length >= 10 && !data[field].match(/\s/))) {
				error[field] = 'w_' + field;
			}
		}else if(field.match(/^new_category$/)) {
			if(data[field] === '') {
				error[field] = "specify the category text";
			}
		}else if(field.match(/^category$/)) {
			if(data[field] === '') {
				error[field] = 'r_category';
			}
		}else if(field.match(/^item$/)) {
			if(data[field] === '') {
				error[field] = 'r_item';
			}
		}else if(field.match(/^province$/)) {
			if(data[field] === '') {
				error[field] = 'r_province';
			}
		}else if(field.match(/^city$/)) {
			if(data[field] === '') {
				error[field] = 'r_city';
			}
		}else if(field.match(/^email_phone$/)) {
			if(data[field].match(/^\s*$/)) {
				error[field] = 'r_email_phone';
			}
		}else if(field.match(/^post_id$/)) {
			if(data[field].match(/^\s*$/)) {
				error[field] = 'r_post_id';
			}
		}
	}
	return error;
};

const sendData = (form, post) => {
    if(post) {
        Http.Post(form);
    }else {
        Http.Request(form).then(promise => {
            Http.AfterRequest(form, promise);
        }).catch(reason => {
            Helper.addMessage(reason.error, true);
        });
    }
};

const formValidator = (fn, post) => {
	let f = document.forms[fn],
		accessed = {},
		values = {},
        error = {},
		ef = false;

	for(let i = 0; i < f.elements.length; i++) {
		let e = f.elements[i],
			n = e.name,
			t = e.type;
		if(e.disabled) { continue; }
		if((n in accessed) || t.match(/^button$/i)) { continue; }
		accessed[n] = 1;
		values[n] = getElementValue(f, e);
	}

	error = validateInputFields(f, values);
	ef = Object.keys(error).length > 0;

    if(!ef && f.name === 'reset_password') {
        if(f['new_password'].value !== f['confirm_new_password'].value) {
			error['new_password'] = 'w_pwd_no_match';
			ef = true;
		}
    }

	Helper.addErrors(error, post);

	if(!ef) {
		if(post) {
			Engine.dispatch(loadingData(true));
		}
		sendData(f, post);
	}
};

export { formValidator };
