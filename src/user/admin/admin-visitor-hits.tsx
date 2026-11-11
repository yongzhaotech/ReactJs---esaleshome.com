import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { session } from '../../utils';
import { fetchUserData } from '../../action';
import UserTabs from '../user-tabs';
import VisitorHits from './visitor-hits';

interface VisitorHit {
	ip: string;
	create_time: string;
	count: number;
}

interface VisitorHitsPage {
	i: string | number;
	n: string;
}

interface VisitorHitsData {
	hits?: VisitorHit[];
	pages?: {
		p?: VisitorHitsPage[];
		c?: number;
	};
}

interface AdminVisitorHitsState {
	USER: {
		profile?: { access_level?: string | number };
		visitorHits?: VisitorHitsData;
	};
}

const AdminVisitorHits = () => {
	const dispatch = useDispatch();
	const userSignedIn = session.userSignedIn;
	const { profile, visitorHits } = useSelector((state: AdminVisitorHitsState) => state.USER);

	useEffect(() => {
		if (userSignedIn) {
			dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'visitorHits' }]));
		}
	}, [dispatch, userSignedIn]);

	const hits = visitorHits?.hits || [];
	const pages = visitorHits?.pages?.p || [];
	const currentPage = visitorHits?.pages?.c || 0;

	return (
		<section>
			<UserTabs />
			<VisitorHits profile={profile} hits={hits} pages={pages} currentPage={currentPage} USERSIGNEDIN={userSignedIn} />
		</section>
	);
};

export default AdminVisitorHits;
