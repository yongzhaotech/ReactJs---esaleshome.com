import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { session } from '../../utils';
import UserTabs from '../user-tabs';
import SiteAds, { SiteAd, SiteAdsPage } from './site-ads';
import { fetchUserData } from '../../action';

interface SiteAdsData {
	ads?: SiteAd[];
	pages?: {
		p?: SiteAdsPage[];
		c?: string | number;
	};
}

interface AdminAdsState {
	USER: {
		profile?: {
			access_level?: string | number;
		};
		siteAds?: SiteAdsData;
	};
}

const AdminAds = () => {
	const dispatch = useDispatch();
	const userSignedIn = session.userSignedIn;
	const { profile, siteAds } = useSelector((state: AdminAdsState) => state.USER);

	useEffect(() => {
		if (userSignedIn) {
			dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'siteAds' }]));
		}
	}, [dispatch, userSignedIn]);

	const ads = siteAds?.ads || [];
	const pages = siteAds?.pages?.p || [];
	const currentPage = siteAds?.pages?.c || 0;

	return (
		<section>
			<UserTabs />
			<SiteAds profile={profile} ads={ads} pages={pages} currentPage={currentPage} USERSIGNEDIN={userSignedIn} />
		</section>
	);
};

export default AdminAds;
