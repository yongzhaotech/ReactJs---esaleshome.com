import React from 'react';
import { useSelector } from 'react-redux';
import { AdFuncs } from '../common/ad-funcs';
import RootReducer from '../reducer';
import { useLocalizedLabel } from '../hook/localization-hook';
import { ErrorLabel } from '../box/form-fields';

interface ContactEmailProps {
	USERSIGNEDIN: boolean;
}

type RootState = ReturnType<typeof RootReducer>;

const ContactEmail = ({ USERSIGNEDIN }: ContactEmailProps) => {
	const postErrors = useSelector((state: RootState) => state.POSTERRORS);
	const getLocalizedLabel = useLocalizedLabel();

	return !USERSIGNEDIN && AdFuncs.isContactMethod('email') ? (
		<>
			<div id='email_row'>
				<div className='ad_inline_block'>
					<div className='ad_box_field'>
						<div className='ad_box_label'>{getLocalizedLabel('p_email_title')}</div>
					</div>
					<div className='ad_box_field'>
						<ErrorLabel errorLabel={postErrors.email} />
						<input type='text' name='email' maxLength={150} placeholder='account.name@example.com' />
					</div>
				</div>
				<div className='ad_inline_block_top'>
					<div className='ad_box_field'>
						<div className='post_hints'>{getLocalizedLabel('p_email_hint')}</div>
					</div>
				</div>
			</div>
			<div className='ad_inline_block_top'></div>
		</>
	) : null;
};

export default ContactEmail;
