import React, { Component } from 'react';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';

class ForgetPasswordBox extends Component {
    constructor(props) {
        super(props);
        this.actionBoxReference = null;

        this.createReference = element => {
            this.actionBoxReference = element;
            Helper.setActionBoxReference(this.actionBoxReference);
        }
    }

    render() {
		if(this.props.BOXES.box !== 'forget_password') {
			return null;
		}

		return (
			<div id="forget_password_box" className="ad_action_box box-in" ref = {this.createReference}>
				<form name="forget_password_form">
					<div>
						<div className="account_box_title">{getLabel('c_reset_passwd_title')}</div>
						<div>
							{Helper.inputLable('c_reset_passwd_email_title', 'email')}
							<div className="account_box_field"><input type="text" name="email" autoFocus /></div>
						</div>
						<div className="account_box_label">
							{Helper.submitButtons('c_submit', 'forget_password_form')}
						</div>
					</div>
				</form>
			</div>
		);
	};
}

export default ForgetPasswordBox;
