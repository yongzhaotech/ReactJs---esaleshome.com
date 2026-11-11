import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { session } from '../../utils';
import { fetchUserData } from '../../action';
import UserTabs from '../user-tabs';
import Permission from './permission';

interface PermissionFile {
	page: string;
	access_level: string | number;
	check_ad: string | number;
}

interface AdminPermState {
	USER: {
		profile?: { access_level?: string | number };
		files?: PermissionFile[];
	};
}

const AdminPerm = () => {
	const dispatch = useDispatch();
	const userSignedIn = session.userSignedIn;
	const { profile, files = [] } = useSelector((state: AdminPermState) => state.USER);

	useEffect(() => {
		if (userSignedIn) {
			dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'files' }]));
		}
	}, [dispatch, userSignedIn]);

	return (
		<section>
			<UserTabs />
			<Permission profile={profile} files={files} USERSIGNEDIN={userSignedIn} />
		</section>
	);
};

export default AdminPerm;
