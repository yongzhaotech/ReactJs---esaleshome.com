import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../common/engine';
import UserTabs from './user-tabs';
import UserProfile from './user-profile';
import { fetchUserData } from '../action';

const UserAccount = class extends Component {
	/*
	 * @description user is already signed in and is now on the account page, he/she presses the F5 key
	 */
    componentWillMount() {
        if(this.props.USERSIGNEDIN && !this.props.profile) {
			Engine.dispatch(fetchUserData([{dataKey: 'profile'}]));
    	}
    }

	render() {
        const {profile} = this.props;
			
		return (
			<section>
				{Engine.component(UserTabs, {profile, USERSIGNEDIN: this.props.USERSIGNEDIN})}
				{Engine.component(UserProfile, {profile, USERSIGNEDIN: this.props.USERSIGNEDIN})}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	LANGUAGE: state.language,
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile
});

export default connect(
	mapStateToProps
)(UserAccount);