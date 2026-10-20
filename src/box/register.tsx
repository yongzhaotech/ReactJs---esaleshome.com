import React, { useCallback, useContext } from 'react';
import { useLocalizedLabel } from '../hook/localization-hook';
import { InputLabel, SubmitButtons } from './form-fields';
import { Context } from '../context/reference-context';


const Register = () => {
	const { setActionBox } = useContext(Context);
	const getLocalizedLabel = useLocalizedLabel();
	const createReference = useCallback(
		(element: HTMLDivElement | null) => {
			if (element) {
				setActionBox(element);
			}
		},
		[setActionBox]
	);

	return (
		<div id='register_box' className='ad_action_box box-in' ref={createReference}>
			<form name='register_form'>
				<div className='account_box_title'>{getLocalizedLabel('c_gen_account_tile')}</div>
				<div className='register_name_field'>
					<div>
						<InputLabel fieldLabel='c_first_name' fieldName='first_name' />
						<div className='account_box_field'>
							<input type='text' name='first_name' maxLength={30} placeholder='Joe' autoFocus />
						</div>
					</div>
					<div>
						<InputLabel fieldLabel='c_last_name' fieldName='last_name' />
						<div className='account_box_field'>
							<input type='text' name='last_name' maxLength={30} placeholder='Doe' />
						</div>
					</div>
				</div>
				<div>
					<InputLabel fieldLabel='c_eml_addr' fieldName='email' />
					<div className='account_box_field'>
						<input type='text' name='email' maxLength={150} placeholder='account.name@example.com' />
					</div>
				</div>
				<div>
					<InputLabel fieldLabel='c_passwd' fieldName='password' />
					<div className='account_box_field'>
						<input type='password' name='password' maxLength={40} placeholder='Abc56789' />
					</div>
				</div>
				<div className='account_box_label'>
					<SubmitButtons label='c_submit' name='register_form' />
				</div>
			</form>
		</div>
	);
};

export default Register;
