import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import type { SearchMode } from '../types/ad';
import { optionHeight } from '../common/config';
import { Engine } from '../common/engine';
import { useLocalizationContext } from '../context/localization-context';
import { useCategoryFunctions } from '../hook/dropdown-hook';
import { PageVars } from '../static/static-vars';

interface CategoryListProps {
	SEARCH?: SearchMode;
}

type RootState = ReturnType<typeof RootReducer>;

const CategoryList = ({ SEARCH: search = '' }: CategoryListProps) => {
	const MODELS = useSelector((state: RootState) => state.MODELS) as Record<string, any>;
	const { selectCat, catSelected, showCat } = useCategoryFunctions();
	const { lang } = useLocalizationContext();

	useEffect(() => {
		Engine.keyboardCategoryList(search ? 'category-for-search' : 'category-not-search');
	}, [search]);

	return (
		<fieldset style={{ position: 'relative', height: optionHeight }}>
			<div className='dp_wrapper' style={{ zIndex: '100' }}>
				<div className='dp_list' aria-label={`${search ? 'category-for-search' : 'category-not-search'}`}>
					{MODELS[`expandCat${search}`] && MODELS[`catId${search}`] && (
						<button
							onClick={(e) => {
								e.preventDefault();
								selectCat(MODELS[`catObj${search}`], search);
							}}
							className='option_title'
							aria-label={'show'}
						>
							{MODELS[`catObj${search}`].n[lang]}
						</button>
					)}
					{PageVars.category.map((cat) => (
						<button
							key={cat.i}
							className={`dp_option ${catSelected(cat, search) ? 'selected' : ''} ${!MODELS[`expandCat${search}`] ? 'option_hint' : ''}`}
							aria-label={`${showCat(cat, search) ? 'show' : 'hide'}`}
							onClick={(e) => {
								e.preventDefault();
								selectCat(cat, search);
							}}
						>
							{cat.n[lang]}
						</button>
					))}
				</div>
			</div>
			<input type='hidden' name='category' defaultValue={MODELS[`catId${search}`]} />
		</fieldset>
	);
};

export default CategoryList;
