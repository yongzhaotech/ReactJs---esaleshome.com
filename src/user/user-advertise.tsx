import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UserTabs from './user-tabs';
import UserAdvertiseSnippets from './user-advertise-snippets';
import { fetchUserData } from '../action';
import { session } from '../utils';

const UserAdvertise = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (session.userSignedIn) {
			dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'ads' }]));
		}
	}, [dispatch]);

	return (
		<>
			<UserTabs />
			<UserAdvertiseSnippets />
		</>
	);
};

export default UserAdvertise;
