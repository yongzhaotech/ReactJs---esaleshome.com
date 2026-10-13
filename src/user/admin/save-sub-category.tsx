import React from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import SubCategories from './sub-categories';
import { fetchUserData } from '../../action';

interface SaveSubCategoryProps {
	USERSIGNEDIN: boolean;
	profile?: {
		access_level?: string | number;
	};
	subCategories?: Record<string, unknown>;
}

interface SaveSubCategoryState {
	USER: {
		profile?: SaveSubCategoryProps['profile'];
		subCategories?: Record<string, unknown>;
	};
}

class SaveSubCategory extends React.Component<SaveSubCategoryProps> {
	componentDidMount() {
		if (this.props.USERSIGNEDIN) {
			Engine.dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'subCategories' }]));
		}
	}

	render() {
		const { profile, subCategories } = this.props;
		const subCategoryData = subCategories || [];

		return (
			<section>
				{Engine.component(UserTabs, { profile })}
				{Engine.component(SubCategories, { profile, subCategories: subCategoryData })}
			</section>
		);
	};
};

const mapStateToProps = (state: SaveSubCategoryState) => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	subCategories: state.USER.subCategories
});

export default connect(
	mapStateToProps
)(SaveSubCategory);