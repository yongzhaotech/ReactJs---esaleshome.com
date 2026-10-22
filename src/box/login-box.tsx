import { Button } from 'react-bootstrap';
import React from 'react';
import { Helper } from '../common/js-funcs';
import { useLocalizationContext } from '../context/localization-context';
import { InputLabel, SubmitButtons } from './form-fields';
import { useReferenceContext } from '../context/reference-context';
import { session } from '../utils';

const LoginBox = () => {
	const { getLocalizedLabel } = useLocalizationContext();
	const { createActionReference } = useReferenceContext();

	if (session.userSignedIn) {
		return null;
	}

	return (
		<div id='login_box' className='ad_action_box box-in' ref={createActionReference}>
			<form name='login_form'>
				<div className='account_box_title'>{getLocalizedLabel('c_sign_in')}</div>
				<div>
					<InputLabel fieldLabel='c_eml_addr' fieldName='email' />
					<div className='account_box_field'>
						<input type='text' name='email' placeholder='account.name@example.com' autoFocus />
					</div>
				</div>
				<div>
					<InputLabel fieldLabel='c_passwd' fieldName='password' />
					<div className='account_box_field'>
						<input type='password' name='password' placeholder='Abc56789' />
					</div>
				</div>
				<div>
					<div className='account_box_label'>
						<SubmitButtons label='c_sign_in' name='login_form' />
					</div>
				</div>
				<div className='devider'></div>
				<div>
					<div className='devider'></div>
					<Button
						bsSize='small'
						className='custom-button'
						onClick={() => Helper.launchMenu('forget_password')}
					>
						{getLocalizedLabel('c_fgt_passwd')}
					</Button>
				</div>
				<div>
					<div className='devider'></div>
					<Button bsSize='small' className='custom-button' onClick={() => Helper.launchMenu('register')}>
						{getLocalizedLabel('c_gen_account')}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default LoginBox;
