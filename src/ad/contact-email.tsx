import React from 'react';
import { useSelector } from 'react-redux';
import type { Label } from '../common/label';
import { AdFuncs } from '../common/ad-funcs';
import { Helper } from '../common/js-funcs';
import RootReducer from '../reducer';
import { LangMessages } from '../static/langs';
import type { Language } from '../static/langs';

interface ContactEmailProps {
	USERSIGNEDIN: boolean;
}

type RootState = ReturnType<typeof RootReducer>;
const labels = LangMessages as Record<string, Record<Language, string>>;

const ContactEmail = ({ USERSIGNEDIN }: ContactEmailProps) => {
	const postErrors = useSelector((state: RootState) => state.POSTERRORS);
	const language = useSelector((state: RootState): Language => (state.language === 'cn' ? 'cn' : 'en'));
	const getLocalizedLabel = (label: Label) => labels[label][language];

	return !USERSIGNEDIN && AdFuncs.isContactMethod('email') ? (
		<>
			<div id='email_row'>
				<div className='ad_inline_block'>
					<div className='ad_box_field'>
						<div className='ad_box_label'>{getLocalizedLabel('p_email_title')}</div>
					</div>
					<div className='ad_box_field'>
						{Helper.errorLabel(typeof postErrors.email === 'string' ? postErrors.email : undefined)}
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
