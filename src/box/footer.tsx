import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import browser from '../image/gui/search-icon.svg';
import { Engine } from '../common/engine';
import { Helper } from '../common/js-funcs';
import { useLocalizedLabel } from '../common/use-localized-label';
import { UserFunction } from '../user/user-function';
import Menus from './menus';
import MessageBox from './message-box';
import LargeImages from './large-images';
import RootReducer from '../reducer';

type RootState = ReturnType<typeof RootReducer>;

interface MessageCenter {
	MESSAGEFLAG: string;
	MESSAGE: string[];
	functionFlag?: boolean;
}

const Footer = () => {
	const boxes = useSelector((state: RootState) => state.BOXES);
	const messageCenter = useSelector((state: RootState): MessageCenter => ({
		MESSAGEFLAG: typeof state.messageCenter.MESSAGEFLAG === 'string' ? state.messageCenter.MESSAGEFLAG : '',
		MESSAGE: Array.isArray(state.messageCenter.MESSAGE)
			? state.messageCenter.MESSAGE.filter((message): message is string => typeof message === 'string')
			: [],
		functionFlag: state.messageCenter.functionFlag === true,
	}));
	const getLocalizedLabel = useLocalizedLabel();
	const off = boxes.box === 'search' ? 'off' : '';
	const siteMsg = messageCenter.MESSAGEFLAG ? 'site_msg_active' : 'site_msg';

	return (
		<footer>
			<div className='footer'>
				{Engine.userSignedIn() ? (
					<Button bsSize='small' className='custom-button-white' onClick={() => UserFunction.signOut()}>
						{getLocalizedLabel('c_sign_out')}
					</Button>
				) : (
					<Button bsSize='small' className='custom-button-white' onClick={() => Helper.launchMenu('login')}>
						{getLocalizedLabel('c_sign_in')}
					</Button>
				)}
				<button
					type='button'
					className='action-button'
					aria-label={getLocalizedLabel('c_search')}
					onClick={() => Helper.launchMenu('search')}
				>
					<img alt='' title={getLocalizedLabel('c_search')} className={`svg-icon ${off}`} src={browser} />
				</button>
				<div
					className='fb-like'
					data-href='http://esaleshome.com'
					data-layout='button'
					data-action='like'
					data-show-faces='true'
					data-share='true'
				></div>
			</div>
			<section className={siteMsg}>
				<MessageBox messageCenter={messageCenter} />
			</section>
			<Menus />
			<LargeImages />
		</footer>
	);
};

export default Footer;
