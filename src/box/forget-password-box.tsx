import React, { useCallback, useContext } from 'react';
import { useLocalizedLabel } from '../hook/localization-hook';
import { InputLabel, SubmitButtons } from './form-fields';
import { Context } from '../context/reference-context';

const ForgetPasswordBox = () => {
	const getLocalizedLabel = useLocalizedLabel();
	const { setActionBox } = useContext(Context);
	const createReference = useCallback(
		(element: HTMLDivElement | null) => {
			if (element) {
				setActionBox(element);
			}
		},
		[setActionBox]
	);

	return (
		<div id='forget_password_box' className='ad_action_box box-in' ref={createReference}>
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
