import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { session } from '../../utils';
import { fetchUserData } from '../../action';
import UserTabs from '../user-tabs';
import SiteUsers from './site-users';

interface SiteUser {
	email: string;
	last_name: string;
	first_name: string;
	create_time: string;
	edit_time: string;
	signin_count: number;
}

interface AdminUsersState {
	USER: {
		profile?: { access_level?: string | number };
		siteUsers?: SiteUser[];
	};
}

const AdminUsers = () => {
	const dispatch = useDispatch();
	const userSignedIn = session.userSignedIn;
	const { profile, siteUsers = [] } = useSelector((state: AdminUsersState) => state.USER);

	useEffect(() => {
		if (userSignedIn) {
			dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'siteUsers' }]));
		}
	}, [dispatch, userSignedIn]);

	return (
		<section>
			<UserTabs />
			<SiteUsers profile={profile} users={siteUsers} />
		</section>
	);
};

export default AdminUsers;
