import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../common/engine';
import UserTabs from './user-tabs';
import UserAdvertiseSnippets from './user-advertise-snippets';
import { fetchUserData } from '../action';

const UserAdvertise = class extends Component {
	componentDidMount() {
		if (this.props.USERSIGNEDIN) {
			Engine.dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'ads' }]));
		}
	}

	render() {
		const { profile, ads } = this.props;
		return (
			<section>
				{Engine.component(UserTabs, { profile })}
				{Engine.component(UserAdvertiseSnippets, { profile, ads })}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	ads: state.USER.ads
});

export default connect(
	mapStateToProps
)(UserAdvertise);