import React, { Component } from 'react';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';

interface EmailFriendBoxProps {
	BOXES: {
		box: string;
		id?: string | number;
	};
}

class EmailFriendBox extends Component<EmailFriendBoxProps> {
	private actionBoxReference: HTMLDivElement | null = null;

	private createReference = (element: HTMLDivElement | null): void => {
		this.actionBoxReference = element;
		Helper.setActionBoxReference(this.actionBoxReference);
	};

    render() {
		if(this.props.BOXES.box !== 'email_friend') {
			return null;
		}

		return (
			<div id="email_friend_box" className="ad_action_box box-in" ref = {this.createReference}>
				<form name="email_friend_form">
					<div>
						<div className="account_box_title">{getLabel('c_email_friend_link')}</div>
						{Helper.inputLable('c_return_eml', 'email')}
						<div className="account_box_field"><input type="text" name="email" autoFocus /></div>
					</div>
					<div>
						{Helper.inputLable('c_friend_eml', 'friend_email')}
						<div className="account_box_field"><input type="text" name="friend_email" /></div>
					</div>
					<div className="account_box_label">
						{Helper.submitButtons('c_submit', 'email_friend_form')}
						<input type="hidden" name="advertise_id" value={this.props.BOXES.id} />
					</div>
				</form>
			</div>
		);
	};
}

export default EmailFriendBox;
