import React, { Component } from 'react';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';

interface ContactUsProps {
	BOXES: {
		box: string;
	};
}

class ContactUs extends Component<ContactUsProps> {
	private actionBoxReference: HTMLDivElement | null = null;

	private createReference = (element: HTMLDivElement | null): void => {
		this.actionBoxReference = element;
		Helper.setActionBoxReference(this.actionBoxReference);
	};

    render() {
		if(this.props.BOXES.box !== 'contact_us') {
			return null;
		}

		return (
			<div id="contact_us_box" className="ad_action_box box-in" ref = {this.createReference}>
				<form name="contact_us_form"> 
					<div className="account_box_title">{getLabel('c_contact_us')}</div>
					<div className="register_name_field">
						<div>
							{Helper.inputLable('c_return_eml', 'email')}
							<div className="account_box_field"><input type="text" name="email" maxLength={150} autoFocus /></div>
						</div>
						<div>
							{Helper.inputLable('c_subject', 'subject')}
							<div className="account_box_field"><input type="text" name="subject" maxLength={30} /></div>
						</div>
					</div>
					<div>
						{Helper.inputLable('c_message', 'message')}
						<div className="account_box_field">
							<textarea name="message" rows={4} cols={100}></textarea>
						</div>
					</div>
					<div className="account_box_label">
						{Helper.submitButtons('c_submit', 'contact_us_form')}
					</div>
				</form>
			</div>
		);
	};
}

export default ContactUs;
