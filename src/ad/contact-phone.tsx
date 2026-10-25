import React from 'react';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { useLocalizationContext } from '../context/localization-context';
import { ErrorLabel } from '../box/form-fields';
import { MODELSState } from '../hook/ad-function-hook';

type RootState = ReturnType<typeof RootReducer>;

const ContactPhone = () => {
	const models = useSelector((state: RootState) => state.MODELS) as MODELSState;
	const postErrors = useSelector((state: RootState) => state.POSTERRORS);
	const { contactMethods = {}, _contactMethods: selectedContactMethods = {} } = models;
	const { getLocalizedLabel } = useLocalizationContext();
	const phone = contactMethods.contact_phone;

	return (
		<>
			{selectedContactMethods['contact_phone'] !== undefined && (
				<>
					<div className='ad_inline_block'>
						<div className='ad_box_field'>
							<div className='ad_box_label'>{getLocalizedLabel('p_phone_title')}</div>
						</div>
						<div className='ad_box_field'>
							<ErrorLabel errorLabel={postErrors.contact_phone} />
							<input
								type='text'
								name='contact_phone'
								maxLength={20}
								placeholder='9051234567'
								defaultValue={phone}
							/>
						</div>
					</div>
					<div className='ad_inline_block_top'>
						<div className='ad_box_field'>
							<div className='post_hints'>{getLocalizedLabel('p_phone_hint')}</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default ContactPhone;
