import React from 'react';
import { Helper } from '../common/js-funcs';
import { selectSearchTerm } from '../action';
import { useSelector, useDispatch } from 'react-redux';
import RootReducer from '../reducer';
import { useLocalizationContext } from '../context/localization-context';

type RootState = ReturnType<typeof RootReducer>;

const SearchTerms = () => {
	const searchTerms = useSelector((state: RootState) => state.searchTerms) as Record<string, any>[];
	const { lang } = useLocalizationContext();
	const dispatch = useDispatch();

	if (!searchTerms.length) {
		Helper.title();
		return null;
	}

	Helper.title(searchTerms.map((term) => term.text[lang]).join(' - '));

	return (
		<div className='ad_nav_bar'>
			{searchTerms.map((term, index) => {
				const isCurrentTerm = index === searchTerms.length - 1;

				return (
					<span key={term.key}>
						{index > 0 ? <span style={{ margin: '0px 2px', fontStyle: 'oblique' }}>/</span> : null}
						{isCurrentTerm ? (
							<span>{term.text[lang]}</span>
						) : (
							<button
								type='button'
								className='action-button'
								onClick={() => dispatch(selectSearchTerm(term))}
							>
								{term.text[lang]}
							</button>
						)}
					</span>
				);
			})}
		</div>
	);
};

export default SearchTerms;
