import { Button } from 'react-bootstrap';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Helper } from '../common/js-funcs';
import { useLocalizedLabel } from '../hook/localization-hook';
import RootReducer from '../reducer';
import { InputLabel, SubmitButtons } from './form-fields';
import { Context } from '../context/reference-context';
import { useSessionContext } from '../context/session-context';

type RootState = ReturnType<typeof RootReducer>;

const LoginBox = () => {
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
	const { userSignedIn } = useSessionContext();

	if (boxes.box !== 'login' || userSignedIn) {
		return null;
	}

	return (
		<div id='login_box' className='ad_action_box box-in' ref={createReference}>
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
