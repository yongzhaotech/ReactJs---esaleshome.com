import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import SiteAds from './site-ads';
import { fetchUserData } from '../../action';

const AdminAds = class extends Component {
    componentWillMount() {
        if(this.props.USERSIGNEDIN) {
			Engine.dispatch(fetchUserData([{dataKey: 'profile'}, {dataKey: 'siteAds'}]));
        }
    }

	render() {
        const {profile, siteAds, USERSIGNEDIN} = this.props,
			ads = (siteAds && siteAds.ads) || [],
			pages = (siteAds && siteAds.pages && siteAds.pages.p) || [],
			currentPage = (siteAds && siteAds.pages && siteAds.pages.c) || 0;

		return (
			<section>
				{Engine.component(UserTabs, {profile})}
				{Engine.component(SiteAds, {profile, ads, pages, currentPage, USERSIGNEDIN})}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	LANGUAGE: state.language,
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	siteAds: state.USER.siteAds
});

export default connect(
	mapStateToProps
)(AdminAds);