import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdFuncs} from '../common/ad-funcs';
import { optionHeight } from '../common/config';
import { Engine } from '../common/engine';

let ItemList = class extends Component {
	componentDidUpdate() {
		Engine.keyboardItemList(this.props.SEARCH ? 'item-for-search' : 'item-not-search');
	}

	render() {
		let MODELS = this.props.MODELS,
			search = this.props.SEARCH || '',
			item = AdFuncs.item(search),
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
			<fieldset style={{position: 'relative', height: '33.5px'}}>
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

const mapStateToProps = state => ({
	MODELS: state.MODELS,
	LANGUAGE: state.language
});

ItemList = connect(
	mapStateToProps
)(ItemList);

export default ItemList;
