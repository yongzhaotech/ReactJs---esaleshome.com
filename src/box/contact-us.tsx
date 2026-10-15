import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Helper } from '../common/js-funcs';
import RootReducer from '../reducer';
import { useLocalizedLabel } from '../common/use-localized-label';

type RootState = ReturnType<typeof RootReducer>;

const ContactUs = () => {
	const box = useSelector((state: RootState) => state.BOXES.box);
	const getLocalizedLabel = useLocalizedLabel();
	const createReference = useCallback((element: HTMLDivElement | null) => {
		Helper.setActionBoxReference(element);
	}, []);

	if (box !== 'contact_us') {
		return null;
	}

	return (
		<div id='contact_us_box' className='ad_action_box box-in' ref={createReference}>
			<form name='contact_us_form'>
				<div className='account_box_title'>{getLocalizedLabel('c_contact_us')}</div>
				<div className='register_name_field'>
					<div>
						{Helper.inputLable('c_return_eml', 'email')}
						<div className='account_box_field'>
							<input type='text' name='email' maxLength={150} autoFocus />
						</div>
					</div>
					<div>
						{Helper.inputLable('c_subject', 'subject')}
						<div className='account_box_field'>
							<input type='text' name='subject' maxLength={30} />
						</div>
					</div>
				</div>
				<div>
					{Helper.inputLable('c_message', 'message')}
					<div className='account_box_field'>
						<textarea name='message' rows={4} cols={100}></textarea>
					</div>
				</div>
				<div className='account_box_label'>{Helper.submitButtons('c_submit', 'contact_us_form')}</div>
			</form>
		</div>
	);
};

export default ContactUs;
