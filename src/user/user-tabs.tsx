import React from 'react';
import { Helper } from '../common/js-funcs';
import AdminTabs from './admin/admin-tabs';
import { session } from '../utils';
import { useLocalizationContext } from '../context/localization-context';
import { useUserFunctions } from '../hook/user-function-hook';

const UserTabs = () => {
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	const { signOut, userPage } = useUserFunctions();

	if (session.userSignedIn) {
		return (
			<section>
				<span
					className='wide_button'
					onClick={signOut}
				>
					{getLabel('c_sign_out')}
				</span>
				<span
					className='wide_button'
					onClick={() => {
						userPage('user-account');
					}}
				>
					{getLabel('c_profile')}
				</span>
				<span
					className='wide_button'
					onClick={() => {
						userPage('user-advertise');
					}}
				>
					{getLabel('c_my_post')}
				</span>
				<AdminTabs />
			</section>
		);
	}

	return (
		<section className='not-signed-in'>
			<div className='alert alert-warning'>
				<strong>{getLabel('not_sign_in')}</strong>.{' '}
				<button type='button' className='action-button' onClick={() => Helper.launchMenu('login')}>
					{getLabel('c_sign_in')}
				</button>
			</div>
		</section>
	);
};

export default UserTabs;
