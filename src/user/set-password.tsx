import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { updateStateModelData } from '../action';
import { SubmitButton } from '../box/form-fields';
import { useServerFunctions } from '../hook/user-function-hook';
import { useLocalizationContext } from '../context/localization-context';
import { route } from '../utils';

type RootState = ReturnType<typeof RootReducer>;

type ERRORSState = Record<string, any>;

type MODELSState = {
	accCode?: string | null;
};

const SetPassword = () => {
	const MODELS = useSelector((state: RootState) => state.MODELS) as MODELSState;
	const ERRORS = useSelector((state: RootState) => state.MODELS) as ERRORSState;
	const dispatch = useDispatch();
	const { validateAccCode } = useServerFunctions();
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	const accCode = route.param('accCode');

	useEffect(() => {
		if (accCode) {
			validateAccCode(accCode);
		} else {
			dispatch(
				updateStateModelData({
					accCode: null,
				})
			);
		}
	}, [accCode, dispatch, validateAccCode]);

	if (!MODELS.accCode) {
		return (
			<div className='page_error'>
				<div>{getLabel('c_reset_err_title')}:</div>
				<div>
					<ul>
						<li>{getLabel('c_reset_link_done')}</li>
						<li>{getLabel('c_reset_link_wrong')}</li>
					</ul>
				</div>
			</div>
		);
	}

	return (
		<div id='reset_password_box'>
			<form name='reset_password'>
				<div className='ad_inline_block'>
					<div className='account_box_title'>{getLabel('c_set_pwd_title')}</div>
				</div>
				<div className='ad_inline_block_top'></div>
				<div className='ad_inline_block'>
					<div className='account_box_label'>{getLabel('c_new_pwd_title')}</div>
				</div>
				<div className='ad_inline_block_top'>
					<div className='account_box_field'>
						{ERRORS['new_password'] ? (
							<div className='error'>{getLabel(ERRORS['new_password'])}</div>
						) : null}
						<input type='password' name='new_password' maxLength={40} />
					</div>
				</div>
				<div className='ad_inline_block'>
					<div className='account_box_label'>{getLabel('c_con_new_pwd_title')}</div>
				</div>
				<div className='ad_inline_block_top'>
					<div className='account_box_field'>
						{ERRORS['confirm_new_password'] ? (
							<div className='error'>{getLabel(ERRORS['confirm_new_password'])}</div>
						) : null}
						<input type='password' name='confirm_new_password' maxLength={40} />
					</div>
				</div>
				<div className='account_box_label'>
					<SubmitButton label='c_submit' name='reset_password' />
					<input type='hidden' name='acc_code' value={accCode} />
				</div>
			</form>
		</div>
	);
};

export default SetPassword;
