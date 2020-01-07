import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import Permission from './permission';
import { fetchUserData } from '../../action';

const AdminUsers = class extends Component {
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

const mapStateToProps = state => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	files: state.USER.files
});

export default connect(
	mapStateToProps
)(AdminUsers);