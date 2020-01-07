import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import Categories from './categories';
import { fetchUserData } from '../../action';

class SaveCategory extends Component {
	componentDidMount() {
		if (this.props.USERSIGNEDIN) {
			Engine.dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'categories' }]));
		}
	}

	render() {
		let { profile, categories } = this.props;
		categories = categories || [];

		return (
			<section>
				{Engine.component(UserTabs, { profile })}
				{Engine.component(Categories, { profile, categories })}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	profile: state.USER.profile,
	categories: state.USER.categories,
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(SaveCategory);