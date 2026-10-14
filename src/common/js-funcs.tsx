import React from 'react';
import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
	Button,
	ButtonToolbar,
	Glyphicon
} from 'react-bootstrap';
import { getLabel, Label } from './label';
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

type Callback = (() => void) | null | undefined;

type ButtonStyle = 'success' | 'danger';

const buttonClass = (): ButtonStyle => {
	let btnClass: ButtonStyle = 'success';
	if (Object.keys(Engine.store().ERRORS).length) {
		btnClass = 'danger';
	}
	return btnClass;
},
	clearCallBack = (): void => {
    let cancelFuncRef = Engine.store().messageCenter.cancelFuncRef || null;

	if(cancelFuncRef) {
        cancelFuncRef();
  	}
},
	addCallBack = (callBackFuncRef: Callback, cancelFuncRef: Callback): Record<string, unknown> | null => {
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
	setDropDownMenus = (): void => {
	Engine.dispatch(setDropDownMenusAction());
},
clearMessage = (messageBox: HTMLElement | null = null, immediate: boolean = false): void => {
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
removeErrors = (): void => {
	Engine.dispatch(addErrorsAction());
},
path = (): string => Engine.path(),
attachActionBox = (boxName: string, adInfo: Record<string, unknown> = {}): void => {
	if(Engine.store().BOXES.box && Engine.store().BOXES.box === boxName) {
		return;
	}
	Engine.dispatch(setActionBox({...{box: boxName}, ...adInfo}));
	removeErrors();
},
detachActionBox = (): void => {
	Engine.dispatch(setActionBox({box: null}));
	removeErrors();
},
closeActionBox = (): void => {
	let actionBox = Engine.store().actionBoxReference || null;

	if(actionBox) {
        actionBox.className = actionBox.className.replace(/box-in/, "box-out");
	}

	setTimeout(() => {
		detachActionBox();
	}, 1001);
},
launchMenu = (a: string): void => {
	if(a === 'find_visitor_ad' && path() === '/ads/visitor-ad/edit') {
		return;
	}
	setDropDownMenus();
	attachActionBox(a);
},
pathName = (): string => Engine.pathName(),
submitForm = (formName: string, post: boolean = false): void => {
    formValidator(formName, post);
},
addMessage = (message: unknown, error: boolean = false): void => {
	Engine.dispatch(messageCenter(ADD_MESSAGE, message, error));
},
submitButton = (label: string, name: string, post: boolean = false) => (<Button bsStyle={buttonClass()} bsSize='small' onClick={() => submitForm(name, post)}>{getLabel(label as Label)}</Button>),
cancelButton = () => (<Button bsStyle='success' bsSize='small' onClick={closeActionBox}>{getLabel('c_cancel')}</Button>),
Helper = {
    /**
     * @param {string} lable default key of the display label
     * @param {string} name name of the html input element
     * @return {jsx}
     */
	inputLable: (lable: string, name: string) => {
		return Engine.store().ERRORS[name] ?
			(<div className="account_box_label" aria-label="error">
				<Glyphicon glyph="exclamation-sign" />
				{getLabel(Engine.store().ERRORS[name] as Label)}
			</div>) :
			(<div className="account_box_label" aria-label={getLabel(lable as Label)}>{getLabel(lable as Label)}</div>);
	},

	errorLabel: (errorItem?: string | null) => errorItem ? (
		<div aria-label="error">
			<Glyphicon glyph="exclamation-sign" />
			{getLabel(errorItem as Label)}
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
	submitButtons: (label: string, name: string, post: boolean = false) => {
		return (
			<ButtonToolbar>
				{submitButton(label, name, post)}
				{cancelButton()}
			</ButtonToolbar>
		);
	},

	location: (path?: string) => {
		Engine.location(path);
	},
	
	goBack: () => {
		Engine.goBack();
	},

	routeComponent: (
		props: RouteComponentProps<any>,
		Comp: ComponentType,
		list: boolean = false
	) => {
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
	
	confirm: (message: string, callBackFuncRef?: Callback, cancelFuncRef?: Callback) => {
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

	/** @param {string | null} [page] */
	hits: (page?: string | null) => {
        Http.ServerRequest('request', {action: 'hits', uri: page ? page : pathName()}).then(() => {}).catch(() => {});
	},
	
	setMenuBoxReference: (reference: HTMLElement | null) => {
		Engine.dispatch(setMenuBoxReferenceAction(reference));
	},
	
	setActionBoxReference: (reference: HTMLElement | null) => {
		Engine.dispatch(setActionBoxReferenceAction(reference));
	},
	
	setMessageBoxReference: (reference: HTMLElement | null) => {
		Engine.dispatch(setMessageBoxReferenceAction(reference));
	},
	
	addErrors: (errors: Record<string, string>, post: boolean) => {
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
	
	title: (name: string | null = null) => {
		document.title = name ? `${name} - ${title}` : title;
	}	
};

export { Helper };
