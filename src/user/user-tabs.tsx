import React from 'react';
import { Helper } from '../common/js-funcs';
import AdminTabs from './admin/admin-tabs';
import { session } from '../utils';
import { useSelector } from 'react-redux';
import { useLocalizationContext } from '../context/localization-context';
import RootReducer from '../reducer';
import { useUserFunctions } from '../hook/user-function-hook';

type RootState = ReturnType<typeof RootReducer>;

type Profile = {
	profile?: {access_level?: string | number;}
}

const UserTabs = () => {
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	const { profile }: Profile = useSelector((state: RootState) =>state.USER);
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
				<AdminTabs profile={profile} />
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
