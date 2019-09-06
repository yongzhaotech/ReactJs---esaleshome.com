import React, { Component } from 'react';
import { getLabel } from '../common/label';
import { AdFuncs} from '../common/ad-funcs';
import { Helper } from '../common/js-funcs';

class ContactPhone extends Component {
	render() {
		const {MODELS, POSTERRORS} = this.props,
			phone = {...MODELS['contactMethods'] || {}}['contact_phone'];
		return  (
			AdFuncs.isContactMethod('contact_phone') ? 
			(<React.Fragment>
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_phone_title')}</div></div>
					<div className="ad_box_field">
						{Helper.errorLabel(POSTERRORS.contact_phone)}
						<input type="text" name="contact_phone" maxLength="20" placeholder="9051234567" defaultValue={phone} />
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_phone_hint')}
						</div>
					</div>
				</div>
			</React.Fragment>) : 
			null
		)
	};
}

export default ContactPhone;
