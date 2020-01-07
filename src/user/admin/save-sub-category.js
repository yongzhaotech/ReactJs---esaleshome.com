import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import SubCategories from './sub-categories';
import { fetchUserData } from '../../action';

class SaveSubCategory extends Component {
	componentDidMount() {
		if (this.props.USERSIGNEDIN) {
			Engine.dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'subCategories' }]));
		}
	}

	render() {
		let { profile, subCategories } = this.props;
		subCategories = subCategories || [];

		return (
			<section>
				{Engine.component(UserTabs, { profile })}
				{Engine.component(SubCategories, { profile, subCategories })}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	subCategories: state.USER.subCategories
});

export default connect(
	mapStateToProps
)(SaveSubCategory);