import React from 'react';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { session } from '../utils';
import { useLocalizationContext } from '../context/localization-context';
import { InputLabel, SubmitButton } from '../box/form-fields';

type RootState = ReturnType<typeof RootReducer>;

interface UserProfileState {
	profile?: {
		first_name?: string;
		last_name?: string;
		email?: string;
	};
}

const UserProfile = () => {
	const { profile } = useSelector((state: RootState) => state.USER) as UserProfileState;
	const { getLocalizedLabel: getLabel } = useLocalizationContext();

	if (!session.userSignedIn) {
		return null;
	}

	return profile ? (
		<div id='user_account_box'>
			<form name='change_user_profile'>
				<div className='ad_inline_block'>
					<div className='account_box_title'>{getLabel('c_basic_info')}</div>
				</div>
				<div className='ad_inline_block_top'></div>
				<div className='ad_inline_block'>
					<InputLabel fieldLabel='c_first_name' fieldName='first_name' />
				</div>
				<div className='ad_inline_block_top'>
					<div className='account_box_field'>
						<input type='text' name='first_name' maxLength={30} defaultValue={profile.first_name} />
					</div>
				</div>
				<div className='ad_inline_block'>
					<InputLabel fieldLabel='c_last_name' fieldName='last_name' />
				</div>
				<div className='ad_inline_block_top'>
					<div className='account_box_field'>
						<input type='text' name='last_name' maxLength={30} defaultValue={profile.last_name} />
					</div>
				</div>
				<div className='ad_inline_block'>
					<div className='account_box_label'>{getLabel('c_eml_addr')}</div>
				</div>
				<div className='ad_inline_block_top'>
					<div className='account_box_field'>
						<span style={{ fontWeight: 'bold' }}>{profile.email}</span>
					</div>
				</div>
				<div className='ad_inline_block'>
					<InputLabel fieldLabel='c_passwd' fieldName='password' />
				</div>
				<div className='ad_inline_block_top'>
					<div className='account_box_field'>
						<input type='password' name='password' maxLength={40} />
					</div>
				</div>
				<div className='account_box_label'>
					<SubmitButton label='c_upt_profile' name='change_user_profile' />
				</div>
			</form>
		</div>
	) : null;
};

export default UserProfile;
