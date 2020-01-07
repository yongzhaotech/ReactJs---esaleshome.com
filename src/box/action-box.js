import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

class ActionBox extends Component {
	goHome = () => {
		AdInfo.listAdvertise();
		Helper.location('');
	};

	componentDidMount() {
		Engine.registerMenuItems();
	}

	render() {
		const { BOXES, ERRORS, LANGUAGE } = this.props;

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
					<input name="keyWordSearch" id="keyWordSearch" className="key-word-search" placeholder={getLabel('c_key_search')} onChange={e => this.props.dispatch(Action.keyWordSearch(e.target.value))} />
					<div className="ad_action_box_wrapper">
						{Engine.component(AdvertiseContact, { BOXES, ERRORS, LANGUAGE })}
						{Engine.component(ContactUs, { BOXES, ERRORS, LANGUAGE })}
						{Engine.component(EmailFriendBox, { BOXES, ERRORS, LANGUAGE })}
						{Engine.component(FindVisitorAdBox, { BOXES, ERRORS, LANGUAGE })}
						{Engine.component(ForgetPasswordBox, { BOXES, ERRORS, LANGUAGE })}
						{Engine.component(LoginBox, { BOXES, ERRORS, LANGUAGE })}
						{Engine.component(Register, { BOXES, ERRORS, LANGUAGE })}
						{Engine.component(SearchBox, { BOXES, ERRORS, LANGUAGE })}
					</div>
				</nav>
			</nav>
		);
	};
};

const mapStateToProps = state => ({
	BOXES: state.BOXES,
	MENUS: state.MENUS,
	ERRORS: state.ERRORS,
	LANGUAGE: state.language
});

export default connect(
	mapStateToProps
)(ActionBox);

ActionBox.propTypes = {
	BOXES: PropTypes.object.isRequired,
	ERRORS: PropTypes.object.isRequired,
	MENUS: PropTypes.bool.isRequired,
	LANGUAGE: PropTypes.string
};