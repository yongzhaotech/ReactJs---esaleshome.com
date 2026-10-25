import React from 'react';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { useLocalizationContext } from '../context/localization-context';
import { ErrorLabel } from '../box/form-fields';
import { session } from '../utils';
import { MODELSState } from '../hook/ad-function-hook';

type RootState = ReturnType<typeof RootReducer>;

const ContactEmail = () => {
	const postErrors = useSelector((state: RootState) => state.POSTERRORS);
	const models = useSelector((state: RootState) => state.MODELS) as MODELSState;
	const { _contactMethods: selectedContactMethods = {} } = models;

	const { getLocalizedLabel } = useLocalizationContext();

	return (
		<>
			{!session.userSignedIn && selectedContactMethods['email'] !== undefined && (
				<>
					<div id='email_row'>
						<div className='ad_inline_block'>
							<div className='ad_box_field'>
								<div className='ad_box_label'>{getLocalizedLabel('p_email_title')}</div>
							</div>
							<div className='ad_box_field'>
								<ErrorLabel errorLabel={postErrors.email} />
								<input
									type='text'
									name='email'
									maxLength={150}
									placeholder='account.name@example.com'
								/>
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
			)}
		</>
	);
};

export default ContactEmail;
