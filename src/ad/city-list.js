import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdFuncs } from '../common/ad-funcs';
import { optionHeight } from '../common/config';
import { Engine } from '../common/engine';

let CityList = class extends Component {
	componentDidUpdate() {
		Engine.keyboardItemList(this.props.SEARCH ? 'city-for-search' : 'city-not-search');
	}

	render() {
		let MODELS = this.props.MODELS,
			search = this.props.SEARCH || '',
			city = AdFuncs.city(search),
			list;

		if (!city.length) {
			return search ? null : (
				<fieldset style={{ position: 'relative', height: optionHeight }}>
					<div className="dp_wrapper" style={{ zIndex: '97' }}>
						<div className="dp_list" aria-label={`${search ? 'city-for-search' : 'city-not-search'}`}>
							<button className="dp_option" aria-label={'show'} onClick={(e) => { e.preventDefault() }}>...</button>
						</div>
					</div>
				</fieldset>
			);
		}

		list = city.map(city => (
			<button
				key={city.i}
				className={`dp_option ${AdFuncs.citySelected(city, search) ? 'selected' : ''} ${!MODELS[`expandCity${search}`] ? 'option_hint' : ''}`}
				aria-label={`${AdFuncs.showCity(city, search) ? 'show' : 'hide'}`}
				onClick={(e) => { e.preventDefault(); AdFuncs.selectCity(city, search) }}
			>
				{city.n[this.props.LANGUAGE]}
			</button>
		));

		return (
			<fieldset style={{ position: 'relative', height: '33.5px' }}>
				<div className="dp_wrapper" style={{ zIndex: '97' }}>
					<div className="dp_list" aria-label={`${search ? 'city-for-search' : 'city-not-search'}`}>
						{(MODELS[`expandCity${search}`] && MODELS[`cityId${search}`]) ? (
							<button
								onClick={(e) => { e.preventDefault(); AdFuncs.selectCity(MODELS[`cityObj${search}`], search) }}
								className="option_title"
							>
								{MODELS[`cityObj${search}`].n[this.props.LANGUAGE]}
							</button>
						) : null}
						{list}
					</div>
				</div>
				<input type="hidden" name="city" defaultValue={MODELS[`cityId${search}`]} />
			</fieldset>
		);
	};
};

const mapStateToProps = state => ({
	MODELS: state.MODELS,
	LANGUAGE: state.language
});

CityList = connect(
	mapStateToProps
)(CityList);

export default CityList;
