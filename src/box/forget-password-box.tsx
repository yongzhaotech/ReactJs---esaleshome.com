import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useLocalizedLabel } from '../hook/localization-hook';
import RootReducer from '../reducer';
import { InputLabel, SubmitButtons } from './form-fields';
import { Context } from '../context/reference-context';

type RootState = ReturnType<typeof RootReducer>;

const ForgetPasswordBox = () => {
	const box = useSelector((state: RootState) => state.BOXES.box);
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

	if (box !== 'forget_password') {
		return null;
	}

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
