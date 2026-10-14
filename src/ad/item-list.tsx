import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdFuncs} from '../common/ad-funcs';
import type { SearchMode } from '../types/ad';
import { optionHeight } from '../common/config';
import { Engine } from '../common/engine';

interface ItemOption {
	i: string | number;
	n: Record<'en' | 'cn', string>;
}

interface ItemListProps {
	SEARCH?: SearchMode;
	MODELS: Record<string, any>;
	LANGUAGE: 'en' | 'cn';
}

interface ItemListState {
	MODELS: Record<string, any>;
	language: 'en' | 'cn';
}

const ItemList = class extends Component<ItemListProps> {
	componentDidUpdate() {
		Engine.keyboardItemList(this.props.SEARCH ? 'item-for-search' : 'item-not-search');
	}

	render() {
		let MODELS = this.props.MODELS,
			search: SearchMode = this.props.SEARCH || '',
			item: ItemOption[] = AdFuncs.item(search),
			list;

		if(!item.length) {
			return search ? null : (
				<fieldset style={{position: 'relative', height: optionHeight}}>
					<div className="dp_wrapper" style={{zIndex: '99'}}>
						<div className="dp_list" aria-label={`${search ? 'item-for-search' : 'item-not-search'}`}>
							<button className="dp_option" aria-label={'show'} onClick={(e) => {e.preventDefault()}}>...</button>
						</div>
					</div>
				</fieldset>
			);
		}

		list = item.map(item => (
				<button 
					key={item.i}
					className={`dp_option ${AdFuncs.itemSelected(item, search) ? 'selected' : ''} ${!MODELS[`expandItem${search}`] ? 'option_hint' : ''}`}
					aria-label={`${AdFuncs.showItem(item, search) ? 'show' : 'hide'}`}
					onClick={(e) => {e.preventDefault(); AdFuncs.selectItem(item, search)}}
				>
					{item.n[this.props.LANGUAGE]}
				</button>
			));

		return (
			<fieldset style={{position: 'relative', height: optionHeight}}>
				<div className="dp_wrapper" style={{zIndex: '99'}}>
					<div className="dp_list" aria-label={`${search ? 'item-for-search' : 'item-not-search'}`}>
						{(MODELS[`expandItem${search}`] && MODELS[`itemId${search}`]) ? (
							<button
								onClick={(e) => {e.preventDefault(); AdFuncs.selectItem(MODELS[`itemObj${search}`], search)}}
								className="option_title"
							>
								{MODELS[`itemObj${search}`].n[this.props.LANGUAGE]}
							</button>
						) : null}
						{list}
					</div>
				</div>
				<input type="hidden" name="item" defaultValue={MODELS[`itemId${search}`]} />
			</fieldset>
		);
	};
};

const mapStateToProps = (state: ItemListState) => ({
	MODELS: state.MODELS,
	LANGUAGE: state.language
});

export default connect(mapStateToProps)(ItemList);
