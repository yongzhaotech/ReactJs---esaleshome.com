import React from 'react';
import { useSelector } from 'react-redux';
import { AdFuncs } from '../common/ad-funcs';
import RootReducer from '../reducer';
import { useLocalizedLabel } from '../hook/localization-hook';
import { ErrorLabel } from '../box/form-fields';

type RootState = ReturnType<typeof RootReducer>;

const ContactPhone = () => {
	const models = useSelector((state: RootState) => state.MODELS);
	const postErrors = useSelector((state: RootState) => state.POSTERRORS);
	const getLocalizedLabel = useLocalizedLabel();
	const contactMethods = models.contactMethods;
	const phone =
		contactMethods && typeof contactMethods === 'object' && 'contact_phone' in contactMethods
			? String(contactMethods.contact_phone || '')
			: '';

	return AdFuncs.isContactMethod('contact_phone') ? (
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
	) : null;
};

export default ContactPhone;
