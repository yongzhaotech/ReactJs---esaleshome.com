import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button	} from 'react-bootstrap';
import { getLabel } from '../common/label';
import { AdFuncs} from '../common/ad-funcs';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';
import ImageList from './image-list';
import ContactPhone from './contact-phone';
import ContactEmail from './contact-email';
import ProvinceList from './province-list';
import CityList from './city-list';
import CategoryList from './category-list';
import ItemList from './item-list';
import { clearStateModelData, clearPostErrors } from '../action';

let PostAdvertise = class extends Component {
	componentWillUnmount() {
		this.props.dispatch(clearStateModelData());
		this.props.dispatch(clearPostErrors());
	}
	
	render() {
		const {POSTERRORS, USERSIGNEDIN, MODELS} = this.props;
		
		Helper.title(getLabel('p_post_title'));

        return (
			<form name="work_on_advertise" action="post-ad" encType="multipart/form-data">
				<div className="ad_inline_block"><div className="ad_box_title">{getLabel('p_post_title')}<div className="ang_close icon_list" onClick={Helper.goBack}>&times;</div></div></div><div className="ad_inline_block_top"></div>
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_cat_title')}</div></div>
					<div className="ad_box_field">
						{Helper.errorLabel(POSTERRORS.category)}
						{Engine.component(CategoryList)}
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_cat_hint')}
						</div>
					</div>
				</div>
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_sub_cat_title')}</div></div>
					<div className="ad_box_field">
						{Helper.errorLabel(POSTERRORS.item)}
						{Engine.component(ItemList)}
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_sub_cat_hint')}
						</div>
					</div>
				</div>
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_name_title')}</div></div>
					<div className="ad_box_field">
						{Helper.errorLabel(POSTERRORS.ad_name)}
						<input type="text" name="ad_name" maxLength="100" placeholder={getLabel('p_ad_name_placeholder')} />
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_ad_name_hint')}	
						</div>
					</div>
				</div>
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_free_title')}</div></div>
					<div className="ad_box_field">
						{Helper.errorLabel(POSTERRORS.is_free)}
						<nav className="btn_list">
							<button className={`tab ${AdFuncs.itemIsFree() ? 'active' : ''}`} onClick={e => {e.preventDefault(); AdFuncs.adIsFree()}}>{getLabel('p_yes_title')}</button>
							<button className={`tab ${AdFuncs.itemIsNotFree() ? 'active' : ''}`} onClick={e => {e.preventDefault(); AdFuncs.adNotFree()}}>{getLabel('p_no_title')}</button>
						</nav>
						<input type="hidden" name="is_free" defaultValue={MODELS['is_free']} />
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
						</div>
					</div>
				</div>
				{AdFuncs.itemIsNotFree() ?
					(<div id="price_row">
						<div className="ad_inline_block">
							<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_currency_title')}</div></div>
							<div className="ad_box_field">
								{Helper.errorLabel(POSTERRORS.currency)}
								<nav className="btn_list">
									<button className={`tab ${MODELS['currency'] === 'c' ? 'active' : ''}`} onClick={(e) => {e.preventDefault(); AdFuncs.setCurrency('c')}}>{getLabel('p_can_dollar')}</button>
									<button className={`tab ${MODELS['currency'] === 'u' ? 'active' : ''}`} onClick={(e) => {e.preventDefault(); AdFuncs.setCurrency('u')}}>{getLabel('p_us_dollar')}</button>
									<button className={`tab ${MODELS['currency'] === 'r' ? 'active' : ''}`} onClick={(e) => {e.preventDefault(); AdFuncs.setCurrency('r')}}>{getLabel('p_rmb_yuan')}</button>
								</nav>
								<input type="hidden" name="currency" defaultValue={MODELS['currency']} />
							</div>
						</div><div className="ad_inline_block_top">
							<div className="ad_box_field">
								<div className="currency_hints">
								</div>
							</div>
						</div>
						<div className="ad_inline_block">
							<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_price_title')}</div></div>
							<div className="ad_box_field">
								{Helper.errorLabel(POSTERRORS.price)}
								<input type="text" name="price" maxLength="15" />
							</div>
						</div><div className="ad_inline_block_top">
							<div className="ad_box_field">
								<div className="post_hints">
									{getLabel('p_price_hint')}
								</div>
							</div>
						</div>
					</div>) : null}
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_detail_title')}</div></div>
					<div className="ad_box_field"><textarea name="description" rows="4" cols="100" placeholder={getLabel('p_detail_placeholder')}></textarea></div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_detail_hint')}
						</div>
					</div>
				</div>
				<div className="ad_inline_block">
					<div className="ad_box_field">
					{
						AdFuncs.adImageFull() ? 
						(<button className="tab inactive" onClick={e => {e.preventDefault()}}>{getLabel('r_add_photos')}</button>) :
						(<button className="tab" onClick={e => {e.preventDefault(); AdFuncs.addAdImage()}}>{getLabel('r_add_photos')}</button>)
					}
					</div>
					{Engine.component(ImageList)}
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_add_photo_hint')}
						</div>
					</div>
				</div>
			<div><div className="ad_box_sub_title">{getLabel('p_contact_title')}</div></div>
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_contact_you_title')}</div></div>
					<div className="ad_box_field_">
						{Helper.errorLabel(POSTERRORS.contact_method)}
						<nav className="btn_list">
							<button className={`tab ${AdFuncs.isContactMethod('contact_phone') ? 'active' : ''}`} onClick={(e) => {e.preventDefault(); AdFuncs.setContactMethod('contact_phone')}}>{getLabel('p_phone')}</button>
							{
								USERSIGNEDIN ? 
								(<button className={`tab ${AdFuncs.isContactMethod('contact_email') ? 'active' : ''}`} aria-label="contact-email-tab" onClick={(e) => {e.preventDefault(); AdFuncs.setContactMethod('contact_email')}}>{getLabel('p_email')}</button>) :
								(<button className={`tab ${AdFuncs.isContactMethod('email') ? 'active' : ''}`} aria-label="email-tab" onClick={(e) => {e.preventDefault(); AdFuncs.setContactMethod('email')}}>{getLabel('p_email')}</button>)
							}
						</nav>
						<input type="hidden" name="contact_method" value={AdFuncs.contactMethod()} />
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_select_phone_hint')}.
							{
								USERSIGNEDIN ? 
								(<section>{getLabel('p_contact_you_hint_1')}</section>) : 
								(<section>{getLabel('p_contact_you_hint_2')}</section>)
							}
						</div>
					</div>
				</div>
			{Engine.component(ContactPhone, {MODELS, POSTERRORS})}
			<div className="ad_inline_block_top"></div>
			{Engine.component(ContactEmail, {POSTERRORS, USERSIGNEDIN})}
			<div><div className="ad_box_sub_title">{getLabel('p_loc_title')}</div></div>
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_province_title')}</div></div>
					<div className="ad_box_field">
						{Helper.errorLabel(POSTERRORS.province)}
						{Engine.component(ProvinceList)}
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_province_hint')}
						</div>
					</div>
				</div>
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_city_title')}</div></div>
					<div className="ad_box_field">
						{Helper.errorLabel(POSTERRORS.city)}
						{Engine.component(CityList)}
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_city_hint')}
						</div>
					</div>
				</div>
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_add_title')}</div></div>
					<div className="ad_box_field"><input type="text" name="address" maxLength="100" placeholder={getLabel('p_add_placeholder')} /></div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_add_hint')}
						</div>
					</div>
				</div>
				<div className="ad_box_field"><div className="ad_box_label"></div>
					<Button bsStyle={Object.keys(POSTERRORS).length ? 'danger' : 'success'} bsSize='small' onClick={() => Helper.submitForm('work_on_advertise', true)}>{getLabel('p_post_it')}</Button>
				</div>
			</form>
		);
	};
};

const mapStateToProps = state => ({
	POSTERRORS: state.POSTERRORS,
	MODELS: state.MODELS,
	LANGUAGE: state.language,
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(PostAdvertise);
