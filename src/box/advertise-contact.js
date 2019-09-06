import React, { Component } from 'react';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';

class AdvertiseContact extends Component {
    constructor(props) {
        super(props);
        this.actionBoxReference = null;

        this.createReference = element => {
            this.actionBoxReference = element;
            Helper.setActionBoxReference(this.actionBoxReference);
        }
    }

    render() {
		if(this.props.BOXES.box !== 'ask_poster') {
			return null;
		}

		return (
			<div id="ask_poster_box" className="ad_action_box box-in" ref = {this.createReference}>
				<div id="ask_poster">
					<form name="ask_poster_form">
						<div style={{height:'19px',fontStyle:'oblique',fontWeight:'bold',color:'#1b0af9'}} id="advertise_name">{this.props.BOXES.name}</div>
						<div className="account_box_title">{getLabel('c_contact_poster_title')}</div>
						<div>
							{Helper.inputLable('c_return_eml', 'email')}
							<div className="account_box_field"><input type="text" name="email" maxLength="100" placeholder="account.name@example.com" autoFocus /></div>
						</div>
						<div>
							{Helper.inputLable('c_msg_post_title', 'message')}
							<div className="account_box_field">
								<textarea name="message" rows="4" cols="100" placeholder={getLabel('c_msg_post_hint')} onPaste={() => {return false}}></textarea>
							</div>
						</div>
						<div className="account_box_label">
							{Helper.submitButtons('c_submit', 'ask_poster_form')}
							<input type="hidden" name="advertise_id" value={this.props.BOXES.id} />
						</div>
					</form>
				</div>
			</div>
		);
	};
}

export default AdvertiseContact;
