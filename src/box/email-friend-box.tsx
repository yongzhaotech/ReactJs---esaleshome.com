import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useLocalizedLabel } from '../hook/localization-hook';
import RootReducer from '../reducer';
import { InputLabel, SubmitButtons } from './form-fields';
import { Context } from '../context/reference-context';

type RootState = ReturnType<typeof RootReducer>;

const EmailFriendBox = () => {
	const boxes = useSelector((state: RootState) => state.BOXES);
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

	const advertiseId = typeof boxes.id === 'string' || typeof boxes.id === 'number' ? boxes.id : undefined;

	return (
		<div id='email_friend_box' className='ad_action_box box-in' ref={createReference}>
			<form name='email_friend_form'>
				<div>
					<div className='account_box_title'>{getLocalizedLabel('c_email_friend_link')}</div>
					<InputLabel fieldLabel='c_return_eml' fieldName='email' />
					<div className='account_box_field'>
						<input type='text' name='email' autoFocus />
					</div>
				</div>
				<div>
					<InputLabel fieldLabel='c_friend_eml' fieldName='friend_email' />
					<div className='account_box_field'>
						<input type='text' name='friend_email' />
					</div>
				</div>
				<div className='account_box_label'>
					<SubmitButtons label='c_submit' name='email_friend_form' />
					<input type='hidden' name='advertise_id' value={advertiseId} />
				</div>
			</form>
		</div>
	);
};

export default EmailFriendBox;
