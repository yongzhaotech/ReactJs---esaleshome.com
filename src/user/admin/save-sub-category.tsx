import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { session } from '../../utils';
import { fetchUserData } from '../../action';
import UserTabs from '../user-tabs';
import SubCategories, { SubCategoriesData } from './sub-categories';

interface SaveSubCategoryState {
	USER: {
		profile?: { access_level?: string | number };
		subCategories?: SubCategoriesData;
	};
}

const SaveSubCategory = () => {
	const dispatch = useDispatch();
	const userSignedIn = session.userSignedIn;
	const { profile, subCategories } = useSelector((state: SaveSubCategoryState) => state.USER);

	useEffect(() => {
		if (userSignedIn) {
			dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'subCategories' }]));
		}
	}, [dispatch, userSignedIn]);

	return (
		<section>
			<UserTabs />
			<SubCategories profile={profile} subCategories={subCategories} />
		</section>
	);
};

export default SaveSubCategory;
