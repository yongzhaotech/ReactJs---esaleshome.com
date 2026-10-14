import React from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
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

interface AdminAdsProps {
	USERSIGNEDIN: boolean;
	profile?: {
		access_level?: string | number;
	};
	siteAds?: SiteAdsData;
}

interface AdminAdsState {
	language: string;
	USER: {
		profile?: AdminAdsProps['profile'];
		siteAds?: SiteAdsData;
	};
}

const AdminAds = class extends React.Component<AdminAdsProps> {
	componentDidMount() {
		if (this.props.USERSIGNEDIN) {
			Engine.dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'siteAds' }]));
		}
	}

	render() {
		const { profile, siteAds, USERSIGNEDIN } = this.props,
			ads = (siteAds && siteAds.ads) || [],
			pages = (siteAds && siteAds.pages && siteAds.pages.p) || [],
			currentPage = (siteAds && siteAds.pages && siteAds.pages.c) || 0;

		return (
			<section>
				{Engine.component(UserTabs, { profile })}
				{Engine.component(SiteAds, { profile, ads, pages, currentPage, USERSIGNEDIN })}
			</section>
		);
	};
};

const mapStateToProps = (state: AdminAdsState) => ({
	LANGUAGE: state.language,
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	siteAds: state.USER.siteAds
});

export default connect(
	mapStateToProps
)(AdminAds);