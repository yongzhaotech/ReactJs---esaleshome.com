import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdFuncs} from '../common/ad-funcs';
import { optionHeight } from '../common/config';
import { Engine } from '../common/engine';

let ProvinceList = class extends Component {
	componentDidMount() {
		Engine.keyboardCategoryList(this.props.SEARCH ? 'province-for-search' : 'province-not-search');
	}

	render() {
		let MODELS = this.props.MODELS,
			LANGUAGE = this.props.LANGUAGE,
			search = this.props.SEARCH || '',
			list = AdFuncs.province().map(prov => (
					<button
						key={prov.i}
						className={`dp_option ${AdFuncs.provSelected(prov, search) ? 'selected' : ''} ${!MODELS[`expandProv${search}`] ? 'option_hint' : ''}`}
						aria-label={`${AdFuncs.showProv(prov, search) ? 'show' : 'hide'}`}
						onClick={(e) => {e.preventDefault(); AdFuncs.selectProv(prov, search)}}
					>
						{prov.n[LANGUAGE]}
					</button>
				));

		return (
			<fieldset style={{position: 'relative', height: optionHeight}}>
				<div className="dp_wrapper" style={{zIndex: '98'}}>
					<div className="dp_list" aria-label={`${search ? 'province-for-search' : 'province-not-search'}`}>
						{(MODELS[`expandProv${search}`] && MODELS[`provId${search}`]) ? (
							<button
								onClick={(e) => {e.preventDefault(); AdFuncs.selectProv(MODELS[`provObj${search}`], search)}}
								className="option_title"
								aria-label={'show'}
							>
								{MODELS[`provObj${search}`].n[LANGUAGE]}
							</button>
						) : null}
						{list}
					</div>
				</div>
				<input type="hidden" name="province" defaultValue={MODELS[`provId${search}`]} />
			</fieldset>
		);
	};
};

const mapStateToProps = state => ({
	MODELS: state.MODELS,
	LANGUAGE: state.language
});

ProvinceList = connect(
	mapStateToProps
)(ProvinceList);

export default ProvinceList;
