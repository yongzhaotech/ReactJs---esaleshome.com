import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Helper } from '../common/js-funcs';
import { useLocalizedLabel } from '../common/use-localized-label';
import RootReducer from '../reducer';

type RootState = ReturnType<typeof RootReducer>;

const EmailFriendBox = () => {
	const boxes = useSelector((state: RootState) => state.BOXES);
	const getLocalizedLabel = useLocalizedLabel();
	const createReference = useCallback((element: HTMLDivElement | null) => {
		Helper.setActionBoxReference(element);
	}, []);

	if (boxes.box !== 'email_friend') {
		return null;
	}

	const advertiseId = typeof boxes.id === 'string' || typeof boxes.id === 'number' ? boxes.id : undefined;

	return (
		<div id='email_friend_box' className='ad_action_box box-in' ref={createReference}>
			<form name='email_friend_form'>
				<div>
					<div className='account_box_title'>{getLocalizedLabel('c_email_friend_link')}</div>
					{Helper.inputLable('c_return_eml', 'email')}
					<div className='account_box_field'>
						<input type='text' name='email' autoFocus />
					</div>
				</div>
				<div>
					{Helper.inputLable('c_friend_eml', 'friend_email')}
					<div className='account_box_field'>
						<input type='text' name='friend_email' />
					</div>
				</div>
				<div className='account_box_label'>
					{Helper.submitButtons('c_submit', 'email_friend_form')}
					<input type='hidden' name='advertise_id' value={advertiseId} />
				</div>
			</form>
		</div>
	);
};

export default EmailFriendBox;
