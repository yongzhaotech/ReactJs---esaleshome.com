import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../../common/engine';
import UserTabs from '../user-tabs';
import VisitorHits from './visitor-hits';
import { fetchUserData } from '../../action';

const AdminVisitorHits = class extends Component {
    componentWillMount() {
        if(this.props.USERSIGNEDIN) {
 			Engine.dispatch(fetchUserData([{dataKey: 'profile'}, {dataKey: 'visitorHits'}]));
       }
    }

	render() {
        let {profile, visitorHits} = this.props;
		visitorHits = visitorHits || {};
		let	hits = visitorHits.hits || [],
			pages = (visitorHits.pages && visitorHits.pages.p) || [],
			currentPage = (visitorHits.pages && visitorHits.pages.c) || 0;

		return (
			<section>
				{Engine.component(UserTabs, {profile})}
				{Engine.component(VisitorHits, {profile, hits, pages, currentPage})}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	profile: state.USER.profile,
	visitorHits: state.USER.visitorHits
});

export default connect(
	mapStateToProps
)(AdminVisitorHits);