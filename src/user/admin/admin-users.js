import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import SiteUsers from './site-users';
import { fetchUserData } from '../../action';

const AdminUsers = class extends Component {
    componentWillMount() {
        if(this.props.USERSIGNEDIN) {
			Engine.dispatch(fetchUserData([{dataKey: 'profile'}, {dataKey: 'siteUsers'}]));
        }
    }

	render() {
        let {profile, users} = this.props;
		users = users || [];

		return (
			<section>
				{Engine.component(UserTabs, {profile})}
				{Engine.component(SiteUsers, {profile, users})}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	users: state.USER.siteUsers
});

export default connect(
	mapStateToProps
)(AdminUsers);