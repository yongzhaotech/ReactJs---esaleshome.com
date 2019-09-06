import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';

const UserProfile = class extends Component {
	render() {
		const {profile, USERSIGNEDIN} = this.props;

        if(!USERSIGNEDIN) {
            return null;
        }

		return profile ? (
			<div id="user_account_box">
				<form name="change_user_profile" action="/adb/change_user_profile.pl">
					<div className="ad_inline_block">
						<div className="account_box_title">{getLabel('c_basic_info')}</div>
					</div><div className="ad_inline_block_top"></div>
					<div className="ad_inline_block">
                        {Helper.inputLable('c_first_name', 'first_name')}
					</div><div className="ad_inline_block_top">
					<div className="account_box_field">
						<input type="text" name="first_name" maxLength="30" defaultValue={profile.first_name} />
					</div>
				</div>
					<div className="ad_inline_block">
                        {Helper.inputLable('c_last_name', 'last_name')}
					</div><div className="ad_inline_block_top">
					<div className="account_box_field">
						<input type="text" name="last_name" maxLength="30" defaultValue={profile.last_name} />
					</div>
				</div>
					<div className="ad_inline_block">
						<div className="account_box_label">{getLabel('c_eml_addr')}</div>
					</div><div className="ad_inline_block_top">
					<div className="account_box_field"><span style={{fontWeight: 'bold'}}>{profile.email}</span></div>
				</div>
					<div className="ad_inline_block">
                       {Helper.inputLable('c_passwd', 'password')}
					</div><div className="ad_inline_block_top">
					<div className="account_box_field">
						<input type="password" name="password" maxLength="40" />
					</div>
				</div>
					<div className="account_box_label">
                        {Helper.submitButton('c_upt_profile', 'change_user_profile')}
					</div>
				</form>
			</div>
		) : null;
	};
};

const mapStateToProps = state => ({
	LANGUAGE: state.language,
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(UserProfile);

UserProfile.propTypes = {
	profile: PropTypes.shape({
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		email: PropTypes.string
	})
};