import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { useLocalizedLabel } from '../hook/localization-hook';
import { InputLabel, SubmitButtons } from './form-fields';
import { Context } from '../context/reference-context';

type RootState = ReturnType<typeof RootReducer>;

const ContactUs = () => {
	const { setActionBox } = useContext(Context);
	const box = useSelector((state: RootState) => state.BOXES.box);
	const getLocalizedLabel = useLocalizedLabel();
	const createReference = useCallback(
		(element: HTMLDivElement | null) => {
			if (element) {
				setActionBox(element);
			}
		},
		[setActionBox]
	);

	if (box !== 'contact_us') {
		return null;
	}

	return (
		<div id='contact_us_box' className='ad_action_box box-in' ref={createReference}>
			<form name='contact_us_form'>
				<div className='account_box_title'>{getLocalizedLabel('c_contact_us')}</div>
				<div className='register_name_field'>
					<div>
						<InputLabel fieldLabel='c_return_eml' fieldName='email' />
						<div className='account_box_field'>
							<input type='text' name='email' maxLength={150} autoFocus />
						</div>
					</div>
					<div>
						<InputLabel fieldLabel='c_subject' fieldName='subject' />
						<div className='account_box_field'>
							<input type='text' name='subject' maxLength={30} />
						</div>
					</div>
				</div>
				<div>
					<InputLabel fieldLabel='c_message' fieldName='message' />
					<div className='account_box_field'>
						<textarea name='message' rows={4} cols={100}></textarea>
					</div>
				</div>
				<div className='account_box_label'>
					<SubmitButtons label='c_submit' name='contact_us_form' />
				</div>
			</form>
		</div>
	);
};

export default ContactUs;
