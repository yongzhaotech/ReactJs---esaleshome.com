import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Button,
	ButtonToolbar
} from 'react-bootstrap';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';
import CategoryList from '../ad/category-list';
import ItemList from '../ad/item-list';
import ProvinceList from '../ad/province-list';
import CityList from '../ad/city-list';
import { changeAdKeyword, searchAdvertise } from '../action';

interface SearchBoxProps {
	BOXES: {
		box: string;
	};
	MODELS: Record<string, any>;
}

interface SearchBoxState {
	MODELS: Record<string, any>;
}

const SearchBox = class extends Component<SearchBoxProps> {
	private actionBoxReference: HTMLDivElement | null = null;

	private createReference = (element: HTMLDivElement | null): void => {
		this.actionBoxReference = element;
		Helper.setActionBoxReference(this.actionBoxReference);
	};

    render() {
		if(this.props.BOXES.box !== 'search') {
			return null;
		}
		let SEARCH = 'Search',
			MODELS = this.props.MODELS;

		return (
			<div id="search_box" className="ad_action_box box-in" ref = {this.createReference}>
				<form name="search_advertise"> 
					<div className="account_box_title">{getLabel('c_search_title')}</div>
					<div className="account_box_field">
						{Engine.component(CategoryList, {SEARCH})}
					</div>
					<div className="account_box_field">
						{Engine.component(ItemList, {SEARCH})}
					</div>
					<div className="account_box_field">
						{Engine.component(ProvinceList, {SEARCH})}
					</div>
					<div className="account_box_field">
						{Engine.component(CityList, {SEARCH})}
					</div>
					<div className="account_box_field">
						<input type="text" name="ad_keyword" defaultValue={MODELS['adKeyword']}
							   onChange={(e) => Engine.dispatch(changeAdKeyword(e.target.value))}
							   placeholder={getLabel('c_keyword_placeholder')} />
					</div>
					<div className="account_box_label">
						<ButtonToolbar>
							<Button bsStyle='success' bsSize='small' onClick={() => Engine.dispatch(searchAdvertise()) }>{getLabel('c_search_btn')}</Button>
							{Helper.cancelButton()}
						</ButtonToolbar>
					</div>
				</form>
			</div>
		);
	};
};

export default connect((state: SearchBoxState) => ({
	MODELS: state.MODELS
}))(SearchBox);
