import React, { Component } from 'react';
import { getLabel } from '../common/label';
import { AdFuncs} from '../common/ad-funcs';
import { Helper } from '../common/js-funcs';

class ContactEmail extends Component {
	render() {
		const {POSTERRORS, USERSIGNEDIN} = this.props;
		return  (
			!USERSIGNEDIN && AdFuncs.isContactMethod('email') ? 
			(<React.Fragment>
				<div id="email_row">
					<div className="ad_inline_block">
						<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_email_title')}</div></div>
						<div className="ad_box_field">
							{Helper.errorLabel(POSTERRORS.email)}
							<input type="text" name="email" maxLength="150" placeholder="account.name@example.com" />
						</div>
					</div><div className="ad_inline_block_top">
						<div className="ad_box_field">
							<div className="post_hints">
								{getLabel('p_email_hint')}
							</div>
						</div>
					</div>
				</div>
				<div className="ad_inline_block_top"></div>
			</React.Fragment>) : 
			null
		)
	};
}

export default ContactEmail;
