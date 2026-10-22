import React from 'react';
import { useLocalizationContext } from '../context/localization-context';
import { InputLabel, SubmitButtons } from './form-fields';
import { useReferenceContext } from '../context/reference-context';

const ForgetPasswordBox = () => {
	const { getLocalizedLabel } = useLocalizationContext();
	const { createActionReference } = useReferenceContext();

	return (
		<div id='forget_password_box' className='ad_action_box box-in' ref={createActionReference}>
			<form name='forget_password_form'>
				<div>
					<div className='account_box_title'>{getLocalizedLabel('c_reset_passwd_title')}</div>
					<div>
						<InputLabel fieldLabel='c_reset_passwd_email_title' fieldName='email' />
						<div className='account_box_field'>
							<input type='text' name='email' autoFocus />
						</div>
					</div>
					<div className='account_box_label'>
						<SubmitButtons label='c_submit' name='forget_password_form' />
					</div>
				</div>
			</form>
		</div>
	);
};

export default ForgetPasswordBox;
