import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import browser from '../image/gui/search-icon.svg';
import { Engine } from '../common/engine';
import { Helper } from '../common/js-funcs';
import { getLabel } from '../common/label';
import { UserFunction } from '../user/user-function';
import Menus from './menus';
import MessageBox from './message-box';
import LargeImages from './large-images';

interface MessageCenter {
	MESSAGEFLAG: string;
	MESSAGE: string[];
	functionFlag?: boolean;
}

interface FooterProps {
	USERSIGNEDIN: boolean;
	BOXES: {
		box?: string;
	};
	messageCenter: MessageCenter;
}

interface FooterState {
	BOXES: {
		box?: string;
	};
	messageCenter: MessageCenter;
}

class Footer extends Component<FooterProps> {
	render() {
		const { BOXES, USERSIGNEDIN, messageCenter } = this.props;
		const off = BOXES.box === 'search' ? 'off' : '';
		const siteMsg = messageCenter.MESSAGEFLAG ? 'site_msg_active' : 'site_msg';

		return (
			<footer>
				<div className="footer">
					{USERSIGNEDIN ? (
						<Button bsSize="small" className="custom-button-white" onClick={() => UserFunction.signOut()}>
							{getLabel('c_sign_out')}
						</Button>
					) : (
						<Button bsSize="small" className="custom-button-white" onClick={() => Helper.launchMenu('login')}>
							{getLabel('c_sign_in')}
						</Button>
					)}
					<button type="button" className="action-button" aria-label={getLabel('c_search')} onClick={() => Helper.launchMenu('search')}>
						<img alt="" title={getLabel('c_search')} className={`svg-icon ${off}`} src={browser} />
					</button>
					<div className="fb-like" data-href="http://esaleshome.com" data-layout="button" data-action="like" data-show-faces="true" data-share="true"></div>
				</div>
				<section className={siteMsg}>
					{Engine.component(MessageBox, { messageCenter })}
				</section>
				{Engine.component(Menus)}
				{Engine.component(LargeImages)}
			</footer>
		);
	}
}

const mapStateToProps = (state: FooterState): FooterProps => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	BOXES: state.BOXES,
	messageCenter: state.messageCenter
});

export default connect(mapStateToProps)(Footer);
