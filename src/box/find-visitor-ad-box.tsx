import React from 'react';
import { Helper } from '../common/js-funcs';
import { useLocalizationContext } from '../context/localization-context';
import { InputLabel, SubmitButtons } from './form-fields';
import { useReferenceContext } from '../context/reference-context';
import { session } from '../utils'

const FindVisitorAdBox = () => {
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	const { createActionReference } = useReferenceContext();

	return (
		<div id='find_visitor_ad_box' className='ad_action_box box-in' ref={createActionReference}>
			<form name='find_visitor_ad_form'>
				<div className='account_box_title'>{getLabel('c_visitor_retrieve_title')}</div>
				<div>
					<InputLabel fieldLabel='c_eml_ph_title' fieldName='email_phone' />
					<div className='account_box_field'>
						<input type='text' name='email_phone' maxLength={150} autoFocus />
					</div>
				</div>
				<div>
					<InputLabel fieldLabel='c_post_id_title' fieldName='post_id' />
					<div className='account_box_field'>
						<input type='text' name='post_id' maxLength={40} />
					</div>
				</div>
				<div className='account_box_label'>
					<SubmitButtons label='c_retrieve' name='find_visitor_ad_form' />
				</div>
				<div className='account_box_label'>
					{getLabel('c_retrieve_hint')}
					{session.userSignedIn ? (
						<button
							type='button'
							className='action-button'
							onClick={() => {
								Helper.clearScreen();
								Helper.location('user-account');
							}}
						>
							{getLabel('c_account')}
						</button>
					) : (
						<button type='button' className='action-button' onClick={() => Helper.launchMenu('login')}>
							{getLabel('c_account')}
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default FindVisitorAdBox;
