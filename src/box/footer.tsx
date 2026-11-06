import React from 'react';
import { useSelector } from 'react-redux';
import browser from '../image/gui/search-icon.svg';
import { Helper } from '../common/js-funcs';
import { useLocalizationContext } from '../context/localization-context';
import Menus from './menus';
import MessageBox from './message-box';
import LargeImages from './large-images';
import RootReducer from '../reducer';
import { useUserFunctions } from '../hook/user-function-hook';
import { session } from '../utils';

type RootState = ReturnType<typeof RootReducer>;

type MessageCenter = {
	MESSAGEFLAG: string;
	MESSAGE: string[];
	functionFlag?: boolean;
}

const Footer = () => {
	const boxes = useSelector((state: RootState) => state.BOXES);
	const { MESSAGEFLAG = '', MESSAGE = [], functionFlag = false } = useSelector((state: RootState) => state.messageCenter) as MessageCenter;

	const { getLocalizedLabel } = useLocalizationContext();
	const { signOut } = useUserFunctions();
	const off = boxes.box === 'search' ? 'off' : '';
	const siteMsg = MESSAGEFLAG ? 'site_msg_active' : 'site_msg';

	return (
		<footer>
			<div className='footer'>
				{session.userSignedIn ? (
					<button type='button' className='custom-button-white btn btn-default btn-sm' onClick={signOut}>
						{getLocalizedLabel('c_sign_out')}
					</button>
				) : (
					<button type='button' className='custom-button-white btn btn-default btn-sm' onClick={() => Helper.launchMenu('login')}>
						{getLocalizedLabel('c_sign_in')}
					</button>
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
				<MessageBox messageCenter={{ MESSAGEFLAG, MESSAGE, functionFlag }} />
			</section>
			<Menus />
			<LargeImages />
		</footer>
	);
};

export default Footer;
