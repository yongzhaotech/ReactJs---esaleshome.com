import React from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import Categories from './categories';
import { fetchUserData } from '../../action';

interface Category {
	id: string | number;
	name: string;
	name_cn: string;
}

interface SaveCategoryProps {
	USERSIGNEDIN: boolean;
	profile?: {
		access_level?: string | number;
	};
	categories?: Category[];
}

interface SaveCategoryState {
	USER: {
		profile?: SaveCategoryProps['profile'];
		categories?: Category[];
	};
}

class SaveCategory extends React.Component<SaveCategoryProps> {
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

const mapStateToProps = (state: SaveCategoryState) => ({
	profile: state.USER.profile,
	categories: state.USER.categories,
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(SaveCategory);