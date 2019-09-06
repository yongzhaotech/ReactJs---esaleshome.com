import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';
import { UserFunction } from './user-function';
import { Engine } from '../common/engine';
import { updateStateModelData } from '../action';

class SetPassword extends Component {
    componentWillMount() {
        let accCode = Engine.param('accCode') || null;

        if(accCode) {
        	UserFunction.validateAccCode(accCode);
		}else {
            Engine.dispatch(updateStateModelData({
				accCode: null
			}));
		}
    }

	render() {
        const {ERRORS, MODELS} = this.props,
			accCode = MODELS['accCode'];

        if(!accCode) {
        	return (
				<div className="page_error">
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
			<div id="reset_password_box">
				<form name="reset_password">
					<div className="ad_inline_block">
						<div className="account_box_title">{getLabel('c_set_pwd_title')}</div>
					</div><div className="ad_inline_block_top"></div>
					<div className="ad_inline_block">
						<div className="account_box_label">{getLabel('c_new_pwd_title')}</div>
					</div><div className="ad_inline_block_top">
					<div className="account_box_field">
						{ERRORS['new_password'] ? (<div className="error">{getLabel(ERRORS['new_password'])}</div>) : null}
						<input type="password" name="new_password" maxLength="40" />
					</div>
				</div>
					<div className="ad_inline_block">
						<div className="account_box_label">{getLabel('c_con_new_pwd_title')}</div>
					</div><div className="ad_inline_block_top">
					<div className="account_box_field">
                        {ERRORS['confirm_new_password'] ? (<div className="error">{getLabel(ERRORS['confirm_new_password'])}</div>) : null}
						<input type="password" name="confirm_new_password" maxLength="40" />
					</div>
				</div>
					<div className="account_box_label">
                        {Helper.submitButton('c_submit', 'reset_password')}
						<input type="hidden" name="acc_code" value={accCode} />
					</div>
				</form>
			</div>
		);
	};
};

const mapStateToProps = state => ({
	ERRORS: state.ERRORS,
	MODELS: state.MODELS,
	LANGUAGE: state.language
});

export default connect(
	mapStateToProps
)(SetPassword);