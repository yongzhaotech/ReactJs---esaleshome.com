import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { fetchAdvertise } from '../action';
import SearchTerms from './search-terms';
import ReactLoader from './react-loader';
import { getLabel } from '../common/label';
import { AdInfo } from '../common/ad-info';
import { Engine } from '../common/engine';
import { Helper } from '../common/js-funcs';
import { smallImageSrc } from '../common/config';
import type { Identifier } from '../types/common';

interface AdvertiseDetailData {
	id: Identifier;
	name: string;
	main_picture: Identifier;
	picture_ids: { i: Identifier }[];
	is_free: Identifier;
	price_display: Record<string, string>;
	province: Record<string, string>;
	city: Record<string, string>;
	location: Record<string, string>;
	category: Record<string, string>;
	item: Record<string, string>;
	contact_method?: string;
	contact_phone?: string;
	ad_description: Record<string, string>;
}

interface AdvertiseDetailProps {
	advertiseDetail: AdvertiseDetailData | null;
	LANGUAGE: string;
}

interface AdvertiseDetailState {
	advertiseDetail: AdvertiseDetailData | null;
	language: string;
}

class AdvertiseDetail extends Component<AdvertiseDetailProps> {
    componentDidMount() {
		Engine.dispatch(fetchAdvertise(Engine.param('advertiseId')));
	}
	
	render() {
		const advertise = this.props.advertiseDetail;

		if(!advertise) {
			return (<ReactLoader />);
		}

		const photo = +advertise.main_picture ? 'photo' : '';
		
		const output = (
			<div>
				{Engine.component(SearchTerms)}
				<div className="ad_detail_title">
					{getLabel('c_ad_detail_title')}
				</div>
				<div className="ad_detail_wrapper" id="big_picture">
					<div className={`ad_detail_img ${photo}`}>
						<button type="button" className="action-button" aria-label="View larger image" onClick={() => AdInfo.largeImageOnDetail(advertise, {i:advertise.main_picture})}>
							<img className="ad_image" alt='' id="advertise_main_picture" src={`${smallImageSrc}${advertise.main_picture}.jpg`}/>
						</button>
					</div>
				</div><div className="ad_detail_wrapper">
				<div className="ad_detail_tab">
					<div className="devider"></div>
					{
						AdInfo.byMail(advertise) ? (
							<div>
								<Button bsStyle="primary" bsSize="small" onClick={() => Helper.attachActionBox('ask_poster', {id:advertise.id,name:advertise.name})}>{getLabel('c_contact_poster_link')}</Button>
							</div>
						) : null
					}
					<div className="devider"></div>
					<div>
						<Button bsStyle="primary" bsSize="small" onClick={() => Helper.attachActionBox('email_friend', {id:advertise.id,name:advertise.name})}>{getLabel('c_email_friend_link')}</Button>
					</div>
				</div>
			</div><div className="ad_detail_wrapper">
				<div className="ad_detail_fun">
					<div className="devider"></div>
					<div className="ad_title">
						{advertise.name}
					</div>
					<div className="devider"></div>
					<div className="ad_detail">
						{+advertise.is_free !== 0 ? (<span>{getLabel('c_free_offer')}</span>) : null}
						{+advertise.is_free === 0 ? (<div className="ad_title">{getLabel('c_ad_scr_price')}: {advertise.price_display[this.props.LANGUAGE]}</div>) : null}
					</div>
					<div className="devider"></div>
					<div className="devider"></div>
					<div className="ad_detail">{getLabel('c_ad_scr_location')}:</div>
					<div className="ad_title">
						<div>{advertise.province[this.props.LANGUAGE]}</div>
						<div>{advertise.city[this.props.LANGUAGE]}</div>
						<div>{advertise.location[this.props.LANGUAGE]}</div>
					</div>
					<div className="devider"></div>
					<div className="ad_title">
						<div>{advertise.category[this.props.LANGUAGE]}</div>
						<div>{advertise.item[this.props.LANGUAGE]}</div>
					</div>
					{
						AdInfo.byPhone(advertise) ? (
							<section>
								<div className="devider"></div>
								<div>
									{getLabel('c_call_poster')}: <span style={{fontWeight: 'bold'}}><a href={`tel:${advertise.contact_phone}`}>{advertise.contact_phone}</a></span>
								</div>
							</section>
						) : null
					}
				</div>
			</div>
				<div id="advertise_picture_list">
					{
						advertise.picture_ids.map(picture => {
							return (
								<div key={picture.i} className="ad_detail_picture_wrapper">
									<div className="ad_detail_picture" title="click to view large picture">
										<button type="button" className="action-button" aria-label="View larger image" onClick={() => AdInfo.largeImageOnDetail(advertise, {i:picture.i})}>
											<img className="ad_image" src={`${smallImageSrc}${picture.i}.jpg`} alt='' />
										</button>
									</div>
								</div>
							)
						})
					}
				 </div>
				<div className="ad_detail_desc">
					<div className="ad_name">{getLabel('c_ad_scr_detail')}</div>
					{AdInfo.safeHtml(advertise.ad_description[this.props.LANGUAGE])}
				</div>
			</div>
		);
		
        return (
			<section>
                {output}
			</section>
        );
    }
}

const mapStateToProps = (state: AdvertiseDetailState) => ({
	advertiseDetail: state.advertiseDetail,
	LANGUAGE: state.language
});

export default connect(
	mapStateToProps
)(AdvertiseDetail);
