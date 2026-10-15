import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Helper } from '../common/js-funcs';
import { useLocalizedLabel } from '../common/use-localized-label';
import RootReducer from '../reducer';

type RootState = ReturnType<typeof RootReducer>;

const ForgetPasswordBox = () => {
	const box = useSelector((state: RootState) => state.BOXES.box);
	const getLocalizedLabel = useLocalizedLabel();
	const createReference = useCallback((element: HTMLDivElement | null) => {
		Helper.setActionBoxReference(element);
	}, []);

	if (box !== 'forget_password') {
		return null;
	}

	return (
		<div id='forget_password_box' className='ad_action_box box-in' ref={createReference}>
			<form name='forget_password_form'>
				<div>
					<div className='account_box_title'>{getLocalizedLabel('c_reset_passwd_title')}</div>
					<div>
						{Helper.inputLable('c_reset_passwd_email_title', 'email')}
						<div className='account_box_field'>
							<input type='text' name='email' autoFocus />
						</div>
					</div>
					<div className='account_box_label'>{Helper.submitButtons('c_submit', 'forget_password_form')}</div>
				</div>
			</form>
		</div>
	);
};

export default ForgetPasswordBox;
