import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Helper } from '../common/js-funcs';
import { useLocalizedLabel } from '../common/use-localized-label';
import RootReducer from '../reducer';

type RootState = ReturnType<typeof RootReducer>;

const AdvertiseContact = () => {
	const box = useSelector((state: RootState) => state.BOXES);
	const getLocalizedLabel = useLocalizedLabel();
	const createReference = useCallback((element: HTMLDivElement | null) => {
		Helper.setActionBoxReference(element);
	}, []);

	if (box.box !== 'ask_poster') {
		return null;
	}

	const advertiseId = typeof box.id === 'string' || typeof box.id === 'number' ? box.id : undefined;

	return (
		<div id='ask_poster_box' className='ad_action_box box-in' ref={createReference}>
			<div id='ask_poster'>
				<form name='ask_poster_form'>
					<div
						style={{ height: '19px', fontStyle: 'oblique', fontWeight: 'bold', color: '#1b0af9' }}
						id='advertise_name'
					>
						{box.name}
					</div>
					<div className='account_box_title'>{getLocalizedLabel('c_contact_poster_title')}</div>
					<div>
						{Helper.inputLable('c_return_eml', 'email')}
						<div className='account_box_field'>
							<input
								type='text'
								name='email'
								maxLength={100}
								placeholder='account.name@example.com'
								autoFocus
							/>
						</div>
					</div>
					<div>
						{Helper.inputLable('c_msg_post_title', 'message')}
						<div className='account_box_field'>
							<textarea
								name='message'
								rows={4}
								cols={100}
								placeholder={getLocalizedLabel('c_msg_post_hint')}
								onPaste={() => false}
							></textarea>
						</div>
					</div>
					<div className='account_box_label'>
						{Helper.submitButtons('c_submit', 'ask_poster_form')}
						<input type='hidden' name='advertise_id' value={advertiseId} />
					</div>
				</form>
			</div>
		</div>
	);
};

export default AdvertiseContact;
