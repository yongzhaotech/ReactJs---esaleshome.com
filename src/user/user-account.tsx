import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserTabs from './user-tabs';
import UserProfile from './user-profile';
import { fetchUserData } from '../action';
import { session } from '../utils';
import RootReducer from '../reducer';

type RootState = ReturnType<typeof RootReducer>;

interface UserProfileState {
	profile?: {
		first_name?: string;
		last_name?: string;
		email?: string;
	};
}

const UserAccount = () => {
	const { profile } = useSelector((state: RootState) => state.USER) as UserProfileState;
	const dispatch = useDispatch();

	useEffect(() => {
		if (session.userSignedIn && !profile) {
			dispatch(fetchUserData([{ dataKey: 'profile' }]));
		}
	}, [dispatch, profile]);

	return (
		<>
			<UserTabs />
			<UserProfile />
		</>
	);
};

export default UserAccount;
