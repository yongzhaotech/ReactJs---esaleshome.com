import React, { useCallback, useContext } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';
import CategoryList from '../ad/category-list';
import ItemList from '../ad/item-list';
import ProvinceList from '../ad/province-list';
import CityList from '../ad/city-list';
import { changeAdKeyword, searchAdvertise } from '../action';
import type { SearchMode } from '../types/ad';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { useLocalizedLabel } from '../hook/localization-hook';
import { Context } from '../context/reference-context';

type RootState = ReturnType<typeof RootReducer>;

const SearchBox = () => {
	const MODELS = useSelector((state: RootState) => state.MODELS);

	const getLocalizedLabel = useLocalizedLabel();
	const { setActionBox } = useContext(Context);
	const createReference = useCallback(
		(element: HTMLDivElement | null) => {
			if (element) {
				setActionBox(element);
			}
		},
		[setActionBox]
	);

	const SEARCH: SearchMode = 'Search';

	return (
		<div id='search_box' className='ad_action_box box-in' ref={createReference}>
			<form name='search_advertise'>
				<div className='account_box_title'>{getLocalizedLabel('c_search_title')}</div>
				<div className='account_box_field'>{Engine.component(CategoryList, { SEARCH })}</div>
				<div className='account_box_field'>{Engine.component(ItemList, { SEARCH })}</div>
				<div className='account_box_field'>{Engine.component(ProvinceList, { SEARCH })}</div>
				<div className='account_box_field'>{Engine.component(CityList, { SEARCH })}</div>
				<div className='account_box_field'>
					<input
						type='text'
						name='ad_keyword'
						defaultValue={MODELS['adKeyword'] as string}
						onChange={(e) => Engine.dispatch(changeAdKeyword(e.target.value))}
						placeholder={getLocalizedLabel('c_keyword_placeholder')}
					/>
				</div>
				<div className='account_box_label'>
					<ButtonToolbar>
						<Button bsStyle='success' bsSize='small' onClick={() => Engine.dispatch(searchAdvertise())}>
							{getLocalizedLabel('c_search_btn')}
						</Button>
						{Helper.cancelButton()}
					</ButtonToolbar>
				</div>
			</form>
		</div>
	);
};

export default SearchBox;
