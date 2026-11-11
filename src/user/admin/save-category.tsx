import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { session } from '../../utils';
import { fetchUserData } from '../../action';
import UserTabs from '../user-tabs';
import Categories from './categories';

interface Category {
	id: string | number;
	name: string;
	name_cn: string;
}

interface SaveCategoryState {
	USER: {
		profile?: { access_level?: string | number };
		categories?: Category[];
	};
}

const SaveCategory = () => {
	const dispatch = useDispatch();
	const userSignedIn = session.userSignedIn;
	const { profile, categories = [] } = useSelector((state: SaveCategoryState) => state.USER);

	useEffect(() => {
		if (userSignedIn) {
			dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'categories' }]));
		}
	}, [dispatch, userSignedIn]);

	return (
		<section>
			<UserTabs />
			<Categories profile={profile} categories={categories} />
		</section>
	);
};

export default SaveCategory;
