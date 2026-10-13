import React from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import Permission from './permission';
import { fetchUserData } from '../../action';

interface PermissionFile {
	page: string;
	access_level: string | number;
	check_ad: string | number;
}

interface AdminPermProps {
	USERSIGNEDIN: boolean;
	profile?: {
		access_level?: string | number;
	};
	files?: PermissionFile[];
}

interface AdminPermState {
	USER: {
		profile?: AdminPermProps['profile'];
		files?: PermissionFile[];
	};
}

const AdminPerm = class extends React.Component<AdminPermProps> {
	componentDidMount() {
		if (this.props.USERSIGNEDIN) {
			Engine.dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'files' }]));
		}
	}

	render() {
		let { profile, files, USERSIGNEDIN } = this.props;
		files = files || [];

		return (
			<section>
				{Engine.component(UserTabs, { profile })}
				{Engine.component(Permission, { profile, files, USERSIGNEDIN })}
			</section>
		);
	};
};

const mapStateToProps = (state: AdminPermState) => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	files: state.USER.files
});

export default connect(
	mapStateToProps
)(AdminPerm);