import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import type { SearchMode } from '../types/ad';
import { optionHeight } from '../common/config';
import { Engine } from '../common/engine';
import { useLocalizationContext } from '../context/localization-context';
import { useProvinceFunctions } from '../hook/dropdown-hook';
import { PageVars } from '../static/static-vars';

interface ProvinceListProps {
	SEARCH?: SearchMode;
}

type RootState = ReturnType<typeof RootReducer>;

const ProvinceList = ({ SEARCH: search = '' }: ProvinceListProps) => {
	const MODELS = useSelector((state: RootState) => state.MODELS) as Record<string, any>;
	const { selectProv, provSelected, showProv } = useProvinceFunctions();
	const { lang } = useLocalizationContext();

	useEffect(() => {
		Engine.keyboardCategoryList(search ? 'province-for-search' : 'province-not-search');
	}, [search]);

	return (
		<fieldset style={{ position: 'relative', height: optionHeight }}>
			<div className='dp_wrapper' style={{ zIndex: '98' }}>
				<div className='dp_list' aria-label={`${search ? 'province-for-search' : 'province-not-search'}`}>
					{MODELS[`expandProv${search}`] && MODELS[`provId${search}`] ? (
						<button
							onClick={(e) => {
								e.preventDefault();
								selectProv(MODELS[`provObj${search}`], search);
							}}
							className='option_title'
							aria-label={'show'}
						>
							{MODELS[`provObj${search}`].n[lang]}
						</button>
					) : null}
					{PageVars.province.map((prov) => (
						<button
							key={prov.i}
							className={`dp_option ${provSelected(prov, search) ? 'selected' : ''} ${!MODELS[`expandProv${search}`] ? 'option_hint' : ''}`}
							aria-label={`${showProv(prov, search) ? 'show' : 'hide'}`}
							onClick={(e) => {
								e.preventDefault();
								selectProv(prov, search);
							}}
						>
							{prov.n[lang]}
						</button>
					))}
				</div>
			</div>
			<input type='hidden' name='province' defaultValue={MODELS[`provId${search}`]} />
		</fieldset>
	);
};

export default ProvinceList;
