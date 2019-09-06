import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { getLabel } from '../common/label';
import { Engine } from '../common/engine';
import { Helper } from '../common/js-funcs';
import AdminTabs from './admin/admin-tabs';
import { UserFunction } from './user-function';

let UserTabs = class extends Component {
	render() {
        const {profile, USERSIGNEDIN} = this.props;

		return (
			<nav className="account_tabs">
			{
                USERSIGNEDIN ?
				(<section>
					<span className="wide_button" onClick={() => {UserFunction.signOut()}}>{getLabel('c_sign_out')}</span>
					<span className="wide_button" onClick={() => {UserFunction.userPage('user-account')}}>{getLabel('c_profile')}</span>
					<span className="wide_button" onClick={() => {UserFunction.userPage('user-advertise')}}>{getLabel('c_my_post')}</span>
					{Engine.component(AdminTabs, {profile})}
				</section>) : 
				(<section className="not-signed-in">
					<Alert bsStyle="warning">
						<strong>{getLabel('not_sign_in')}</strong>.
						{' '}
						<a href="" onClick={e => {e.preventDefault(); Helper.launchMenu('login')}}>{getLabel('c_sign_in')}</a>
					</Alert>
				</section>)
			}
			</nav>
		);
	};
};

const mapStateToProps = state => ({
	LANGUAGE: state.language,
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(UserTabs);