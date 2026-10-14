import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AnyAction, Dispatch } from 'redux';
import AdvertiseContact from './advertise-contact';
import ContactUs from './contact-us';
import EmailFriendBox from './email-friend-box';
import FindVisitorAdBox from './find-visitor-ad-box';
import ForgetPasswordBox from './forget-password-box';
import LoginBox from './login-box';
import Register from './register';
import SearchBox from './search-box';
import { Helper } from '../common/js-funcs';
import { getLabel } from '../common/label';
import { Engine } from '../common/engine';
import { AdInfo } from '../common/ad-info';
import { switchLanguage } from '../action';
import * as Action from '../action';

interface ActionBoxProps {
	BOXES: {
		box: string;
		name?: string;
		id?: string | number;
	};
	MENUS: boolean;
	dispatch: Dispatch<AnyAction>;
}

interface ActionBoxState {
	BOXES: {
		box: string;
		name?: string;
		id?: string | number;
	};
	MENUS: boolean;
}

class ActionBox extends Component<ActionBoxProps> {
	goHome = () => {
		AdInfo.listAdvertise();
		Helper.location('');
	};

	componentDidMount() {
		Engine.registerMenuItems();
	}

	render() {
		const { BOXES } = this.props;

		return (
			<nav id="ad_title_bar">
				<nav className="btn_list">
					<div id="menu_launcher" className={`nav_btn ${this.props.MENUS ? 'menu_title_active' : ''}`} aria-haspopup="true" onClick={Helper.setDropDownMenus}>
						{getLabel('c_menu')}
					</div>
					<div className="nav_btn" onClick={this.goHome}>
						{getLabel('c_home')}
					</div>
					<div className="nav_btn" onClick={() => { this.props.dispatch(switchLanguage()) }}>
						{getLabel('c_language')}
					</div>
					<label htmlFor="keyWordSearch" className="visually-hidden">{getLabel('c_key_search')}</label>
					<input name="keyWordSearch" id="keyWordSearch" className="key-word-search" placeholder={getLabel('c_key_search')} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.dispatch(Action.keyWordSearch(e.target.value))} />
					<div className="ad_action_box_wrapper">
						{Engine.component(AdvertiseContact, { BOXES })}
						{Engine.component(ContactUs, { BOXES })}
						{Engine.component(EmailFriendBox, { BOXES })}
						{Engine.component(FindVisitorAdBox, { BOXES })}
						{Engine.component(ForgetPasswordBox, { BOXES })}
						{Engine.component(LoginBox, { BOXES })}
						{Engine.component(Register, { BOXES })}
						{Engine.component(SearchBox, { BOXES })}
					</div>
				</nav>
			</nav>
		);
	};
};

const mapStateToProps = (state: ActionBoxState) => ({
	BOXES: state.BOXES,
	MENUS: state.MENUS,
});

export default connect(
	mapStateToProps
)(ActionBox);