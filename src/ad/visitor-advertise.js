import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { getLabel } from '../common/label';
import { AdFuncs} from '../common/ad-funcs';
import { AdInfo } from '../common/ad-info';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';
import ImageList from './image-list';
import ContactPhone from './contact-phone';
import ProvinceList from './province-list';
import CityList from './city-list';
import CategoryList from './category-list';
import ItemList from './item-list';
import { fetchVisitorAdvertise, clearStateModelData } from '../action';

class VisitorAdvertise extends Component {
	componentWillMount() {
		let behavior = Engine.param('behavior') || null;

        AdFuncs.initOtherItems();

        if(behavior === 'edit') {
			Engine.dispatch(fetchVisitorAdvertise());
		}
	}

	componentWillUnmount() {
		Engine.dispatch(clearStateModelData());
	}
	
	render() {
		const {POSTERRORS, MODELS} = this.props,
            ad = MODELS['userAdvertiseSet'];

		if(!ad || !ad.id) {
			return null;
		}else {
			AdFuncs.initCity(MODELS['cityId']);
			AdFuncs.initItem(MODELS['itemId']);
			AdFuncs.initImages(MODELS['images']);
			AdFuncs.initContactMethods(MODELS['contactMethods'], MODELS['_contactMethods']);
		}
		
        return (
			<form name="work_on_advertise" action="visitor-ad" encType="multipart/form-data"> 
				<div className="ad_inline_block"><div className="ad_box_title">{getLabel('p_edit_title')}<div className="ang_close icon_list" onClick={Helper.goBack}>&times;</div></div></div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							<div>{getLabel('p_phone')} / {getLabel('p_email')}: {ad.contact_phone} / {ad.contact_email}</div>
						</div>
					</div>					
				</div>
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
						<input type="text" name="ad_name" defaultValue={ad.name} maxLength="100" />
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
							<div className={`tab ${AdFuncs.itemIsFree() ? 'active' : ''}`} onClick={AdFuncs.adIsFree}>{getLabel('p_yes_title')}</div>
							<div className={`tab ${AdFuncs.itemIsNotFree() ? 'active' : ''}`} onClick={AdFuncs.adNotFree}>{getLabel('p_no_title')}</div>
						</nav>
						<input type="hidden" name="is_free" defaultValue={MODELS['is_free']} />
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
						</div>
					</div>
				</div>
				{
					AdFuncs.itemIsNotFree() ? (
						<div id="price_row">
							<div className="ad_inline_block">
								<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_currency_title')}</div></div>
								<div className="ad_box_field">
									{Helper.errorLabel(POSTERRORS.is_free)}
									<nav className="btn_list">
										<div className={`tab ${MODELS['currency'] === 'c' ? 'active' : ''}`} onClick={() => {AdFuncs.setCurrency('c')}}>{getLabel('p_can_dollar')}</div>
										<div className={`tab ${MODELS['currency'] === 'u' ? 'active' : ''}`} onClick={() => {AdFuncs.setCurrency('u')}}>{getLabel('p_us_dollar')}</div>
										<div className={`tab ${MODELS['currency'] === 'r' ? 'active' : ''}`} onClick={() => {AdFuncs.setCurrency('r')}}>{getLabel('p_rmb_yuan')}</div>
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
									<input type="text" name="price" defaultValue={MODELS['price']} maxLength="15" />
								</div>
							</div><div className="ad_inline_block_top">
							<div className="ad_box_field">
								<div className="post_hints">
									{getLabel('p_price_hint')}
								</div>
							</div>
						</div>
						</div>
					) : null
				}
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_detail_title')}</div></div>
					<div className="ad_box_field">
						<textarea name="description" rows="4" cols="100" placeholder={getLabel('p_detail_placeholder')} defaultValue={ad.description} />
					</div>
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
						(<div className="tab inactive">{getLabel('r_add_photos')}</div>) :
						(<div className="tab" onClick={AdFuncs.addAdImage}>{getLabel('r_add_photos')}</div>)
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
				<div className="ad_inline_block">
					<div className="ad_box_field"><div className="ad_box_label">{getLabel('p_contact_title')}</div></div>
					<div className="ad_box_field">
						{Helper.errorLabel(POSTERRORS.contact_method)}
						<nav className="btn_list">
							<div className={`tab ${AdFuncs.isContactMethod('contact_phone') ? 'active' : ''}`} onClick={() => {AdFuncs.setContactMethod('contact_phone')}}>{getLabel('p_phone')}</div>
							<div className={`tab ${AdFuncs.isContactMethod('contact_email') ? 'active' : ''}`} onClick={() => {AdFuncs.setContactMethod('contact_email')}}>{getLabel('p_email')}</div>
						</nav>
						<input type="hidden" name="contact_method" defaultValue={AdFuncs.contactMethod()} />
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_contact_you_title')}
						</div>
					</div>
				</div>
				{Engine.component(ContactPhone, {MODELS, POSTERRORS})}
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
					<div className="ad_box_field">
						<input type="text" name="address" defaultValue={ad.address} maxLength="100" placeholder={getLabel('p_add_placeholder')} />
					</div>
				</div><div className="ad_inline_block_top">
					<div className="ad_box_field">
						<div className="post_hints">
							{getLabel('p_add_hint')}
						</div>
					</div>
				</div>
				<div className="ad_box_field"><div className="ad_box_label"></div>
				<ButtonToolbar>
					<Button bsStyle={Object.keys(POSTERRORS).length ? 'danger' : 'success'} onClick={() => Helper.submitForm('work_on_advertise', true)}>{getLabel('p_upt_post')}</Button>
					<Button bsStyle='success' onClick={() => {AdInfo.visitorConfirmDeletion()}}>{getLabel('p_del_post')}</Button>
				</ButtonToolbar>
				</div>
			</form>
		);
	};
};

const mapStateToProps = state => ({
	POSTERRORS: state.POSTERRORS,
	LANGUAGE: state.language,
	MODELS: state.MODELS
});

export default connect(
	mapStateToProps
)(VisitorAdvertise);
