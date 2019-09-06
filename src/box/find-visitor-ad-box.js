import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';

class FindVisitorAdBox extends Component {
    constructor(props) {
        super(props);
        this.actionBoxReference = null;

        this.createReference = element => {
            this.actionBoxReference = element;
			Helper.setActionBoxReference(this.actionBoxReference);
        }
    }

    render() {
		if(this.props.BOXES.box !== 'find_visitor_ad') {
			return null;
		}

		return (
			<div id="find_visitor_ad_box" className="ad_action_box box-in" ref = {this.createReference}>
				<form name="find_visitor_ad_form">
					<div className="account_box_title">{getLabel('c_visitor_retrieve_title')}</div>
					<div>
						{Helper.inputLable('c_eml_ph_title', 'email_phone')}
						<div className="account_box_field"><input type="text" name="email_phone" maxLength="150" autoFocus /></div>
					</div>
					<div>
						{Helper.inputLable('c_post_id_title', 'post_id')}
						<div className="account_box_field"><input type="text" name="post_id" maxLength="40" /></div>
					</div>
					<div className="account_box_label">
						{Helper.submitButtons('c_retrieve', 'find_visitor_ad_form')}
					</div>
					<div className="account_box_label">
						{getLabel('c_retrieve_hint')}
						{
							this.props.USERSIGNEDIN ? (
								<a href="" onClick={(e) => {e.preventDefault(); Helper.clearScreen(); Helper.location('user-account')}}>{getLabel('c_account')}</a>
							) : (
								<a href="" onClick={e => {e.preventDefault(); Helper.launchMenu('login')}}>{getLabel('c_account')}</a>
							)
						}
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
)(FindVisitorAdBox);