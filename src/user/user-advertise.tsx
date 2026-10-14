import React from 'react';
import { connect } from 'react-redux';
import { Engine } from '../common/engine';
import UserTabs from './user-tabs';
import UserAdvertiseSnippets from './user-advertise-snippets';
import { fetchUserData } from '../action';

export interface UserAdvertiseItem {
	id: string | number;
	name: string;
	viewed: number;
	description: string;
	is_free: string | number;
	price: string | number;
}

interface UserAdvertiseProps {
	USERSIGNEDIN: boolean;
	profile?: Record<string, unknown>;
	ads?: UserAdvertiseItem[];
}

interface UserAdvertiseState {
	USER: {
		profile?: Record<string, unknown>;
		ads?: UserAdvertiseItem[];
	};
}

const UserAdvertise = class extends React.Component<UserAdvertiseProps> {
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

const mapStateToProps = (state: UserAdvertiseState) => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	ads: state.USER.ads
});

export default connect(
	mapStateToProps
)(UserAdvertise);