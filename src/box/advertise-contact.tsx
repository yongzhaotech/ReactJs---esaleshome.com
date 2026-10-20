import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useLocalizedLabel } from '../hook/localization-hook';
import RootReducer from '../reducer';
import { Context } from '../context/reference-context';
import { InputLabel, SubmitButtons } from './form-fields';

type RootState = ReturnType<typeof RootReducer>;

const AdvertiseContact = () => {
	const { id, name } = useSelector((state: RootState) => state.BOXES);
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
	const advertiseId = typeof id === 'string' || typeof id === 'number' ? id : undefined;

	return (
		<div id='ask_poster_box' className='ad_action_box box-in' ref={createReference}>
			<div id='ask_poster'>
				<form name='ask_poster_form'>
					<div
						style={{ height: '19px', fontStyle: 'oblique', fontWeight: 'bold', color: '#1b0af9' }}
						id='advertise_name'
					>
						{name}
					</div>
					<div className='account_box_title'>{getLocalizedLabel('c_contact_poster_title')}</div>
					<div>
						<InputLabel fieldLabel='c_return_eml' fieldName='email' />
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
						<InputLabel fieldLabel='c_msg_post_title' fieldName='message' />
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
						<SubmitButtons label='c_submit' name='ask_poster_form' />
						<input type='hidden' name='advertise_id' value={advertiseId} />
					</div>
				</form>
			</div>
		</div>
	);
};

export default AdvertiseContact;
