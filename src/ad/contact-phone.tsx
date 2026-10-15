import React from 'react';
import { useSelector } from 'react-redux';
import type { Label } from '../common/label';
import { AdFuncs } from '../common/ad-funcs';
import { Helper } from '../common/js-funcs';
import RootReducer from '../reducer';
import { LangMessages } from '../static/langs';
import type { Language } from '../static/langs';

type RootState = ReturnType<typeof RootReducer>;
const labels = LangMessages as Record<string, Record<Language, string>>;

const ContactPhone = () => {
	const models = useSelector((state: RootState) => state.MODELS);
	const postErrors = useSelector((state: RootState) => state.POSTERRORS);
	const language = useSelector((state: RootState): Language => (state.language === 'cn' ? 'cn' : 'en'));
	const getLocalizedLabel = (label: Label) => labels[label][language];
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
					{Helper.errorLabel(
						typeof postErrors.contact_phone === 'string' ? postErrors.contact_phone : undefined
					)}
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
