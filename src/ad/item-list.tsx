import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import type { SearchMode } from '../types/ad';
import { optionHeight } from '../common/config';
import { Engine } from '../common/engine';
import { useLocalizationContext } from '../context/localization-context';
import { useItemFunctions, Option } from '../hook/dropdown-hook';

interface ItemListProps {
	SEARCH?: SearchMode;
}

type RootState = ReturnType<typeof RootReducer>;

const ItemList = ({ SEARCH: search = '' }: ItemListProps) => {
	const MODELS = useSelector((state: RootState) => state.MODELS) as Record<string, any>;
	const { selectItem, itemSelected, showItem } = useItemFunctions();
	const { lang } = useLocalizationContext();
	const catObj = MODELS[`catObj${search}`];
	const item: Option[] = catObj?.c ?? [];

	useEffect(() => {
		Engine.keyboardItemList(search ? 'item-for-search' : 'item-not-search');
	}, [search]);

	if (!item.length) {
		return (
			<>
				{!!search && (
					<fieldset style={{ position: 'relative', height: optionHeight }}>
						<div className='dp_wrapper' style={{ zIndex: '99' }}>
							<div className='dp_list' aria-label={`${search ? 'item-for-search' : 'item-not-search'}`}>
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
			<div className='dp_wrapper' style={{ zIndex: '99' }}>
				<div className='dp_list' aria-label={`${search ? 'item-for-search' : 'item-not-search'}`}>
					{MODELS[`expandItem${search}`] && MODELS[`itemId${search}`] && (
						<button
							onClick={(e) => {
								e.preventDefault();
								selectItem(MODELS[`itemObj${search}`], search);
							}}
							className='option_title'
						>
							{MODELS[`itemObj${search}`].n[lang]}
						</button>
					)}
					{item.map((item) => (
						<button
							key={item.i}
							className={`dp_option ${itemSelected(item, search) ? 'selected' : ''} ${!MODELS[`expandItem${search}`] ? 'option_hint' : ''}`}
							aria-label={`${showItem(item, search) ? 'show' : 'hide'}`}
							onClick={(e) => {
								e.preventDefault();
								selectItem(item, search);
							}}
						>
							{item.n[lang]}
						</button>
					))}
				</div>
			</div>
			<input type='hidden' name='item' defaultValue={MODELS[`itemId${search}`]} />
		</fieldset>
	);
};

export default ItemList;
