import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLabel } from '../common/label';
import { UserFunction } from "./user-function";
import { AdInfo } from '../common/ad-info';
import { AdFuncs } from "../common/ad-funcs";
import { Engine } from '../common/engine';

class UserAdvertiseSnippets extends Component {
	render() {
		const {profile, ads, USERSIGNEDIN} = this.props;

        if(!USERSIGNEDIN || !profile || !ads) {
            return null;
        }

		let output = ads.map(advertise => (
			<div className="user_advertise_box" id={`ad_${advertise.id}`} key={advertise.id}>
				<div><span className="button" onClick={() => AdFuncs.expandUserAd(advertise)}>{advertise.name} (viewed: {advertise.viewed})</span></div>
				{
					AdFuncs.userAdExpanded(advertise) ? (
						<div className="user_ad_detail">
							<div className="devider"></div>
							<div>{AdInfo.safeHtml(advertise.description)}</div>
							<div className="devider"></div>
							<div>
						<span>
							{+advertise.is_free ? getLabel('c_free_offer') : advertise.price}
						</span>
							</div>
							<div className="devider"></div>
							<div>
								<span className="wide_button" onClick={() => {UserFunction.userPage(`edit-ad/${advertise.id}`)}}>{getLabel('c_edit_ad')}</span>
								<span className="wide_button" onClick={() => {UserFunction.deleteAd(advertise)}}>{getLabel('c_delete')}</span>
							</div>
						</div>
					) : null
				}
			</div>
		));

		return (
			<section>
				{output}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	OBJECTS: state.OBJECTS
});

export default connect(
	mapStateToProps
)(UserAdvertiseSnippets);
