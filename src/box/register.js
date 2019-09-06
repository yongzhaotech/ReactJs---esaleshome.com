import React, { Component } from 'react';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';

class Register extends Component {
    constructor(props) {
        super(props);
        this.actionBoxReference = null;

        this.createReference = element => {
            this.actionBoxReference = element;
            Helper.setActionBoxReference(this.actionBoxReference);
        }
    }

    render() {
		if(this.props.BOXES.box !== 'register') {
			return null;
		}

		return (
			<div id="register_box" className="ad_action_box box-in" ref = {this.createReference}>
				<form name="register_form"> 
					<div className="account_box_title">{getLabel('c_gen_account_tile')}</div>
					<div className="register_name_field">
						<div>
							{Helper.inputLable('c_first_name', 'first_name')}
							<div className="account_box_field"><input type="text" name="first_name" maxLength="30" placeholder="Joe" autoFocus /></div>
						</div>
						<div>
							{Helper.inputLable('c_last_name', 'last_name')}
							<div className="account_box_field"><input type="text" name="last_name" maxLength="30" placeholder="Doe" /></div>
						</div>
					</div>
					<div>
						{Helper.inputLable('c_eml_addr', 'email')}
						<div className="account_box_field"><input type="text" name="email" maxLength="150" placeholder="account.name@example.com" /></div>
					</div>
					<div>
						{Helper.inputLable('c_passwd', 'password')}
						<div className="account_box_field"><input type="password" name="password"  maxLength="40" placeholder="Abc56789" /></div>
					</div>
					<div className="account_box_label">
						{Helper.submitButtons('c_submit', 'register_form')}
					</div>
				</form>
			</div>
		);
	};
}

export default Register;
