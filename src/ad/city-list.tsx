import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import type { SearchMode } from '../types/ad';
import { optionHeight } from '../common/config';
import { Engine } from '../common/engine';
import { useLocalizationContext } from '../context/localization-context';
import { useCityFunctions, Option } from '../hook/dropdown-hook';
interface CityListProps {
	SEARCH?: SearchMode;
}

type RootState = ReturnType<typeof RootReducer>;

const CityList = ({ SEARCH: search = '' }: CityListProps) => {
	const MODELS = useSelector((state: RootState) => state.MODELS) as Record<string, any>;
	const { lang } = useLocalizationContext();
	const { selectCity, citySelected, showCity } = useCityFunctions();

	const provObj: Option = MODELS[`provObj${search}`];
	const city: Option[] = provObj?.c ?? [];

	useEffect(() => {
		Engine.keyboardItemList(search ? 'city-for-search' : 'city-not-search');
	}, [search]);

	if (!city.length) {
		return (
			<>
				{!search && (
					<fieldset style={{ position: 'relative', height: optionHeight }}>
						<div className='dp_wrapper' style={{ zIndex: '97' }}>
							<div className='dp_list' aria-label={`${search ? 'city-for-search' : 'city-not-search'}`}>
								<button
									className='dp_option'
									aria-label={'show'}
									onClick={(e) => {
										e.preventDefault();
									}}
								>
									...
								</button>
							</div>
						</div>
					</fieldset>
				)}
			</>
		);
	}

	return (
		<fieldset style={{ position: 'relative', height: optionHeight }}>
			<div className='dp_wrapper' style={{ zIndex: '97' }}>
				<div className='dp_list' aria-label={`${search ? 'city-for-search' : 'city-not-search'}`}>
					{MODELS[`expandCity${search}`] && MODELS[`cityId${search}`] && (
						<button
							onClick={(e) => {
								e.preventDefault();
								selectCity(MODELS[`cityObj${search}`], search);
							}}
							className='option_title'
						>
							{MODELS[`cityObj${search}`].n[lang]}
						</button>
					)}
					{city.map((city) => (
						<button
							key={city.i}
							className={`dp_option ${citySelected(city, search) ? 'selected' : ''} ${!MODELS[`expandCity${search}`] ? 'option_hint' : ''}`}
							aria-label={`${showCity(city, search) ? 'show' : 'hide'}`}
							onClick={(e) => {
								e.preventDefault();
								selectCity(city, search);
							}}
						>
							{city.n[lang]}
						</button>
					))}
				</div>
			</div>
			<input type='hidden' name='city' defaultValue={MODELS[`cityId${search}`]} />
		</fieldset>
	);
};

export default CityList;
