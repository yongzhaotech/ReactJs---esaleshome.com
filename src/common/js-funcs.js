import React from 'react';
import {
	Button,
	ButtonToolbar,
	Glyphicon
} from 'react-bootstrap';
import { getLabel } from './label';
import { Http } from './http-client';
import { AdFuncs} from './ad-funcs';
import { Engine } from './engine';
import { formValidator } from './form-process';
import { title } from './config';
import ActionBox from '../box/action-box';
import Footer from '../box/footer';
import Loading from '../box/loading';
import {
	messageCenter,
	setDropDownMenus as setDropDownMenusAction,
	setActionBox,
	setMenuBoxReference as setMenuBoxReferenceAction,
	setActionBoxReference as setActionBoxReferenceAction,
	setMessageBoxReference as setMessageBoxReferenceAction,
	addErrors as addErrorsAction,
	addPostErrors as addPostErrorsAction,
	clearStateModelData,
	ADD_MESSAGE,
	CLEAR_MESSAGE
} from '../action';

const buttonClass = () => {
	let btnClass = 'success';
	if (Object.keys(Engine.store().ERRORS).length) {
		btnClass = 'danger';
	}
	return btnClass;
},
clearCallBack = () => {
    let cancelFuncRef = Engine.store().messageCenter.cancelFuncRef || null;

	if(cancelFuncRef) {
        cancelFuncRef();
  	}
},
addCallBack = (callBackFuncRef, cancelFuncRef) => {
	let callInfo = null;

    clearCallBack();

    if(callBackFuncRef) {
        callInfo = {callBackFuncRef, functionFlag: true};
 	}
	if(cancelFuncRef) {
    	callInfo = {...callInfo || {}, ...{cancelFuncRef}};
	}

	return callInfo;
},
setDropDownMenus = () => {
	Engine.dispatch(setDropDownMenusAction());
},
clearMessage = (messageBox = null, immediate = false) => {
	if(immediate) {
        clearCallBack();
		Engine.dispatch(messageCenter(CLEAR_MESSAGE));
		return;
	}
	
	messageBox = messageBox || Engine.store().messageBoxReference || null;

	if(messageBox) {
        messageBox.className = messageBox.className.replace(/box-in/, "box-out");
    }

	setTimeout(() => {
        clearCallBack();
		Engine.dispatch(messageCenter(CLEAR_MESSAGE));
	}, 1001);
},
removeErrors = () => {
	Engine.dispatch(addErrorsAction());
},
path = () => Engine.path(),
attachActionBox = (boxName, adInfo = {}) => {
	if(Engine.store().BOXES.box && Engine.store().BOXES.box === boxName) {
		return;
	}
	Engine.dispatch(setActionBox({...{box: boxName}, ...adInfo}));
	removeErrors();
},
detachActionBox = () => {
	Engine.dispatch(setActionBox({box: null}));
	removeErrors();
},
closeActionBox = () => {
	let actionBox = Engine.store().actionBoxReference || null;

	if(actionBox) {
        actionBox.className = actionBox.className.replace(/box-in/, "box-out");
	}

	setTimeout(() => {
		detachActionBox();
	}, 1001);
},
launchMenu = a => {
	if(a === 'find_visitor_ad' && path() === '/ads/visitor-ad/edit') {
		return;
	}
	setDropDownMenus();
	attachActionBox(a);
},
pathName = () => Engine.pathName,
submitForm = (formName, post = false) => {
    formValidator(formName, post);
},
addMessage = (message, error = false) => {
	Engine.dispatch(messageCenter(ADD_MESSAGE, message, error));
},
submitButton = (label, name, post = false) => (<Button bsStyle={buttonClass()} bsSize='small' onClick={() => submitForm(name, post)}>{getLabel(label)}</Button>),
cancelButton = () => (<Button bsStyle='success' bsSize='small' onClick={closeActionBox}>{getLabel('c_cancel')}</Button>),
Helper = {
    /**
     * @param {string} lable default key of the display label
     * @param {string} name name of the html input element
     * @return {jsx}
     */
	inputLable: (lable, name) => {
		return Engine.store().ERRORS[name] ?
			(<div className="account_box_label" aria-label="error">
				<Glyphicon glyph="exclamation-sign" />
				{getLabel(Engine.store().ERRORS[name])}
			</div>) :
			(<div className="account_box_label" aria-label={getLabel(lable)}>{getLabel(lable)}</div>);
	},

	errorLabel: errorItem => errorItem ? (
		<div aria-label="error">
			<Glyphicon glyph="exclamation-sign" />
			{getLabel(errorItem)}
		</div>
	) : null,
	
	buttonClass: buttonClass,
	
	setDropDownMenus: setDropDownMenus,
	
    clearMessage: clearMessage,

    submitForm: submitForm,
	
	launchMenu: launchMenu,
	
	attachActionBox: attachActionBox,
	
	detachActionBox: detachActionBox,
	
	addMessage: addMessage,
	
	submitButton: submitButton,
	
	cancelButton: cancelButton,

    /**
     * @param {string} lable key of the display label
     * @param {string} name name of the html form element
     * @return {jsx}
     */	 
	submitButtons: (label, name, post = false) => {
		return (
			<ButtonToolbar>
				{submitButton(label, name, post)}
				{cancelButton()}
			</ButtonToolbar>
		);
	},

	location: path => {
		Engine.location(path);
	},
	
	goBack: () => {
		Engine.goBack();
	},

	routeComponent: (props, Comp, list = false) => {
		let {match: {params}, history} = props;
		Engine.route(params, history);

		return (
			<React.Fragment>
				{Engine.component(ActionBox)}
				<main id="ad_content_area">
					{Engine.component(Comp)}
				</main>
				{Engine.component(Footer, {ISLISTSCREEN: list})}
				{Engine.component(Loading)}
			</React.Fragment>
		);
	},
	
	clearDropDownMenus: () => {
		if(Engine.store().MENUS) {
			setDropDownMenus();
		}
	},
	
	confirm: (message, callBackFuncRef, cancelFuncRef) => {
        setTimeout(() => {
			Engine.dispatch(messageCenter(ADD_MESSAGE, message, false, addCallBack(callBackFuncRef, cancelFuncRef)));
		}, 0);
	},

    executeFunc: () => {
		let callBackFuncRef = Engine.store().messageCenter.callBackFuncRef || null;
		setTimeout(() => {
			if(callBackFuncRef) {
                callBackFuncRef();
			}
            clearMessage(null, true);
		}, 0);
	},

	hits: (page = null) => {
        Http.ServerRequest('request', {action: 'hits', uri: page ? page : pathName()}).then(promise => {}).catch(e => {});
	},
	
	setMenuBoxReference: (reference) => {
		Engine.dispatch(setMenuBoxReferenceAction(reference));
	},
	
	setActionBoxReference: (reference) => {
		Engine.dispatch(setActionBoxReferenceAction(reference));
	},
	
	setMessageBoxReference: (reference) => {
		Engine.dispatch(setMessageBoxReferenceAction(reference));
	},
	
	addErrors: (errors, post) => {
		if(post) {
			Engine.dispatch(addPostErrorsAction(errors));
		}else {
			Engine.dispatch(addErrorsAction(errors));
		}
	},
	
	clearScreen: () => {
		detachActionBox();
		Engine.dispatch(addPostErrorsAction());
		Engine.dispatch(clearStateModelData());
		AdFuncs.clearScreen();
	},
	
	title: (name = null) => {
		document.title = name ? `${name} - ${title}` : title;
	}	
};

export { Helper };
