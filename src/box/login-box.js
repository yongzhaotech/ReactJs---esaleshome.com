import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';

class LoginBox extends Component {
    constructor(props) {
        super(props);
        this.actionBoxReference = null;

        this.createReference = element => {
            this.actionBoxReference = element;
            Helper.setActionBoxReference(this.actionBoxReference);
        }
    }

	render() {
		if(this.props.BOXES.box !== 'login' || this.props.USERSIGNEDIN) {
			return null;
		}

		return (
			<div id="login_box" className="ad_action_box box-in" ref = {this.createReference}>
				<form name="login_form">
					<div className="account_box_title">{getLabel('c_sign_in')}</div>
					<div>
						{Helper.inputLable('c_eml_addr', 'email')}
						<div className="account_box_field"><input type="text" name="email" placeholder="account.name@example.com" autoFocus /></div>
					</div>
					<div>
						{Helper.inputLable('c_passwd', 'password')}
						<div className="account_box_field"><input type="password" name="password" placeholder="Abc56789" /></div>
					</div>
					<div>
						<div className="account_box_label">
							{Helper.submitButtons('c_sign_in', 'login_form')}
						</div>
					</div>
					<div className='devider'></div>
					<div>
						<div className='devider'></div>
						<Button bsSize="small" className="custom-button" onClick={() => Helper.launchMenu('forget_password')}>{getLabel('c_fgt_passwd')}</Button>
					</div>
					<div>
						<div className='devider'></div>
						<Button bsSize="small" className="custom-button" onClick={() => Helper.launchMenu('register')}>{getLabel('c_gen_account')}</Button>
					</div>
				</form>
			</div>
		);
	};
};

const mapStateToProps = state => ({
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(LoginBox);
