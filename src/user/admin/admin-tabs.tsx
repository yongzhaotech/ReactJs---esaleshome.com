import React from 'react';
import { useSelector } from 'react-redux';
import { useLocalizationContext } from '../../context/localization-context';
import RootReducer from '../../reducer';
import { UserFunction } from '../user-function';
import { useUserFunctions } from '../../hook/user-function-hook';


type RootState = ReturnType<typeof RootReducer>;

interface UserProfileState {
	profile?: {
		access_level?: string | number;
	};
}

const AdminTabs = () => {
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	const { profile } = useSelector((state: RootState) => state.USER) as UserProfileState;
	const { userPage } = useUserFunctions();

	return profile && Number(profile?.access_level) > 1 ? (
		<section>
			<div className="block_spacer"></div>
			<span className='wide_button' onClick={() => { userPage('save-category') }}>{getLabel('c_category')}</span>
			<span className='wide_button' onClick={() => { userPage('save-subcategory') }}>{getLabel('c_sub_category')}</span>
			<span className='wide_button' onClick={() => { userPage('admin-perm') }}>{getLabel('c_permission')}</span>
			<span className='wide_button' onClick={() => { userPage('admin-ads') }}>{getLabel('c_advertise')}</span>
			<span className='wide_button' onClick={() => { userPage('visitor-hits') }}>{getLabel('c_hit')}</span>
			<span className='wide_button' onClick={() => { userPage('admin-users') }}>{getLabel('c_user')}</span>
			<span className='wide_button' onClick={() => { UserFunction.genStaticContent() }}>{getLabel('c_static_content')}</span>
			<span className='wide_button' onClick={() => { UserFunction.genStaticHtmls() }}>{getLabel('c_static_html')}</span>
		</section>
	) : null;
}

export default AdminTabs;
