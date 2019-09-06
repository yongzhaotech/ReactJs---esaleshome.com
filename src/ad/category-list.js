import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdFuncs} from '../common/ad-funcs';
import { optionHeight } from '../common/config';
import { Engine } from '../common/engine';

let CategoryList = class extends Component {
	componentDidMount() {
		Engine.keyboardCategoryList(this.props.SEARCH ? 'category-for-search' : 'category-not-search');
	}

	render() {
		let MODELS = this.props.MODELS,
			search = this.props.SEARCH || '',
			list = AdFuncs.category().map(cat => (
					<button
						key={cat.i}
						className={`dp_option ${AdFuncs.catSelected(cat, search) ? 'selected' : ''} ${!MODELS[`expandCat${search}`] ? 'option_hint' : ''}`}
						aria-label={`${AdFuncs.showCat(cat, search) ? 'show' : 'hide'}`}
						onClick={(e) => {e.preventDefault(); AdFuncs.selectCat(cat, search)}}
					>
						{cat.n[this.props.LANGUAGE]}
					</button>
				));

		return (
			<fieldset style={{position: 'relative', height: optionHeight}}>
				<div className="dp_wrapper" style={{zIndex: '100'}}>
					<div className="dp_list" aria-label={`${search ? 'category-for-search' : 'category-not-search'}`}>
						{(MODELS[`expandCat${search}`] && MODELS[`catId${search}`]) ? (
							<button
								onClick={(e) => {e.preventDefault(); AdFuncs.selectCat(MODELS[`catObj${search}`], search)}}
								className="option_title"
								aria-label={'show'}
							>
								{MODELS[`catObj${search}`].n[this.props.LANGUAGE]}
							</button>
						) : null}
						{list}
					</div>
				</div>
				<input type="hidden" name="category" defaultValue={MODELS[`catId${search}`]} />
			</fieldset>
		);
	};
};

const mapStateToProps = state => ({
	MODELS: state.MODELS,
	LANGUAGE: state.language
});

CategoryList = connect(
	mapStateToProps
)(CategoryList);

export default CategoryList;
