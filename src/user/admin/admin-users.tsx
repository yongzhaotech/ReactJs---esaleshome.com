import React from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import SiteUsers from './site-users';
import { fetchUserData } from '../../action';

interface SiteUser {
	email: string;
	last_name: string;
	first_name: string;
	create_time: string;
	edit_time: string;
	signin_count: number;
}

interface AdminUsersProps {
	USERSIGNEDIN: boolean;
	profile?: {
		access_level?: string | number;
	};
	users?: SiteUser[];
}

interface AdminUsersState {
	USER: {
		profile?: AdminUsersProps['profile'];
		siteUsers?: SiteUser[];
	};
}

const AdminUsers = class extends React.Component<AdminUsersProps> {
	componentDidMount() {
		if (this.props.USERSIGNEDIN) {
			Engine.dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'siteUsers' }]));
		}
	}

	render() {
		let { profile, users } = this.props;
		users = users || [];

		return (
			<section>
				{Engine.component(UserTabs, { profile })}
				{Engine.component(SiteUsers, { profile, users })}
			</section>
		);
	};
};

const mapStateToProps = (state: AdminUsersState) => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	users: state.USER.siteUsers
});

export default connect(
	mapStateToProps
)(AdminUsers);