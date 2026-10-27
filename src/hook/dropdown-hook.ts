import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Language } from '../static/langs';
import type { Identifier } from '../types/common';
import type { SearchMode } from '../types/ad';
import RootReducer from '../reducer';
import {
	selectCity as selectCityAction,
	selectProv as selectProvAction,
	selectItem as selectItemAction,
	selectCat as selectCatAction,
	expandCity as expandCityAction,
	expandProv as expandProvAction,
	expandItem as expandItemAction,
	expandCat as expandCatAction,
	updateStateModelData,
} from '../action';
export interface Option {
	i: Identifier;
	n: Record<Language, string>;
	c?: Option[];
	s?: Record<Language, string>;
}

export type MODELSState = Record<string, any>;

type RootState = ReturnType<typeof RootReducer>;

let provId: Identifier | '' = '',
	provObj: Option | null = null,
	cityId: Identifier | '' = '',
	cityObj: Option | null = null,
	catId: Identifier | '' = '',
	catObj: Option | null = null,
	itemId: Identifier | '' = '',
	itemObj: Option | null = null,
	cityIdSearch: Identifier | '' = '',
	provIdSearch: Identifier | '' = '',
	provObjSearch: Option | null = null,
	cityObjSearch: Option | null = null,
	catIdSearch: Identifier | '' = '',
	catObjSearch: Option | null = null,
	itemIdSearch: Identifier | '' = '',
	itemObjSearch: Option | null = null;

const collapseActionPayloads: Record<string, Record<string, false>> = {
	cat: { expandCat: false },
	catSearch: { expandCatSearch: false },
	item: { expandItem: false },
	itemSearch: { expandItemSearch: false },
	prov: { expandProv: false },
	provSearch: { expandProvSearch: false },
	city: { expandCity: false },
	citySearch: { expandCitySearch: false },
};

const getCollapsePayload = (itemToNotCollapse: string) =>
	Object.entries(collapseActionPayloads).reduce(
		(accumulation, [key, value]) => {
			if (key !== itemToNotCollapse) {
				return { ...accumulation, ...value };
			}

			return accumulation;
		},
		{} as Record<string, false>
	);

export const useProvinceFunctions = () => {
	const dispatch = useDispatch();
	const MODELS = useSelector((state: RootState) => state.MODELS) as MODELSState;

	const selectProv = useCallback(
		(p: Option, Search: SearchMode = '') => {
			const expandProv = !MODELS[`expandProv${Search}`];
			dispatch(expandProvAction(expandProv, Search));
			if (expandProv) {
				dispatch(updateStateModelData(getCollapsePayload(`prov${Search}`)));
			}
			if (Search) {
				if (provIdSearch === p.i) {
					return;
				}
				[provIdSearch, provObjSearch, cityIdSearch] = [p.i, p, ''];
			} else {
				if (provId === p.i) {
					return;
				}
				[provId, provObj, cityId] = [p.i, p, ''];
			}
			dispatch(selectProvAction(Search ? provIdSearch : provId, Search ? provObjSearch : provObj, Search));
		},
		[MODELS, dispatch]
	);

	const provSelected = useCallback(
		(p: Option, Search: SearchMode = '') => MODELS[`provId${Search}`] === p.i,
		[MODELS]
	);

	const showProv = useCallback(
		(p: Option, Search: SearchMode = '') => {
			const [provId, expandProv] = [MODELS[`provId${Search}`], MODELS[`expandProv${Search}`]];
			return !!expandProv || (!p.i && !provId) || provId === p.i;
		},
		[MODELS]
	);

	return { selectProv, provSelected, showProv };
};

export const useCityFunctions = () => {
	const dispatch = useDispatch();
	const MODELS = useSelector((state: RootState) => state.MODELS) as MODELSState;

	const selectCity = useCallback(
		(c: Option, Search: SearchMode = '') => {
			const expandCity = !MODELS[`expandCity${Search}`];
			dispatch(expandCityAction(expandCity, Search));
			if (expandCity) {
				dispatch(updateStateModelData(getCollapsePayload(`city${Search}`)));
			}
			if (Search) {
				if (cityIdSearch === c.i) {
					return;
				}
				[cityIdSearch, cityObjSearch] = [c.i, c];
			} else {
				if (cityId === c.i) {
					return;
				}
				[cityId, cityObj] = [c.i, c];
			}
			dispatch(selectCityAction(Search ? cityIdSearch : cityId, Search ? cityObjSearch : cityObj, Search));
		},
		[MODELS, dispatch]
	);

	const citySelected = useCallback(
		(c: Option, Search: SearchMode = '') => (Search ? MODELS.cityIdSearch === c.i : MODELS.cityId === c.i),
		[MODELS]
	);

	const showCity = useCallback(
		(c: Option, Search: SearchMode = '') => {
			const [expandCity, cityId] = [MODELS[`expandCity${Search}`], MODELS[`cityId${Search}`]];
			return !!expandCity || (!c.i && !cityId) || cityId === c.i;
		},
		[MODELS]
	);

	return { selectCity, citySelected, showCity };
};

export const useCategoryFunctions = () => {
	const dispatch = useDispatch();
	const MODELS = useSelector((state: RootState) => state.MODELS) as MODELSState;

	const selectCat = useCallback(
		(c: Option, Search: SearchMode = '') => {
			const expandCat = !MODELS[`expandCat${Search}`];
			dispatch(expandCatAction(expandCat, Search));
			if (expandCat) {
				dispatch(updateStateModelData(getCollapsePayload(`cat${Search}`)));
			}
			if (Search) {
				if (catIdSearch === c.i) {
					return;
				}
				[catIdSearch, catObjSearch, itemIdSearch] = [c.i, c, ''];
			} else {
				if (catId === c.i) {
					return;
				}
				[catId, catObj, itemId] = [c.i, c, ''];
			}
			dispatch(selectCatAction(Search ? catIdSearch : catId, Search ? catObjSearch : catObj, Search));
		},
		[MODELS, dispatch]
	);

	const catSelected = useCallback((c: Option, Search: SearchMode = '') => MODELS[`catId${Search}`] === c.i, [MODELS]);

	const showCat = useCallback(
		(c: Option, Search: SearchMode = '') => {
			const [catId, expandCat] = [MODELS[`catId${Search}`], MODELS[`expandCat${Search}`]];
			return !!expandCat || (!c.i && !catId) || catId === c.i;
		},
		[MODELS]
	);

	return { selectCat, catSelected, showCat };
};

export const useItemFunctions = () => {
	const dispatch = useDispatch();
	const MODELS = useSelector((state: RootState) => state.MODELS) as MODELSState;
	const selectItem = useCallback(
		(i: Option, Search: SearchMode = '') => {
			const expandItem = !MODELS[`expandItem${Search}`];
			dispatch(expandItemAction(expandItem, Search));
			if (expandItem) {
				dispatch(updateStateModelData(getCollapsePayload(`item${Search}`)));
			}
			if (Search) {
				if (itemIdSearch === i.i) {
					return;
				}
				[itemIdSearch, itemObjSearch] = [i.i, i];
			} else {
				if (itemId === i.i) {
					return;
				}
				[itemId, itemObj] = [i.i, i];
			}
			dispatch(selectItemAction(Search ? itemIdSearch : itemId, Search ? itemObjSearch : itemObj, Search));
		},
		[MODELS, dispatch]
	);

	const itemSelected = useCallback(
		(i: Option, Search: SearchMode = '') => MODELS[`itemId${Search}`] === i.i,
		[MODELS]
	);
	const showItem = useCallback(
		(i: Option, Search: SearchMode = '') => {
			const [expandItem, itemId] = [MODELS[`expandItem${Search}`], MODELS[`itemId${Search}`]];
			return !!expandItem || (!i.i && !itemId) || itemId === i.i;
		},
		[MODELS]
	);
	return { selectItem, itemSelected, showItem };
};

export const clearScreen = () => {
	provId = '';
	provObj = null;
	cityId = '';
	cityObj = null;
	catId = '';
	catObj = null;
	itemId = '';
	itemObj = null;
	cityIdSearch = '';
	provIdSearch = '';
	provObjSearch = null;
	cityObjSearch = null;
	catIdSearch = '';
	catObjSearch = null;
	itemIdSearch = '';
	itemObjSearch = null;
};

export const initCity = (value: Identifier | '', search: boolean = false) => {
	if (search) {
		cityIdSearch = value;
	} else {
		cityId = value;
	}
};

export const initItem = (value: Identifier | '', search: boolean = false) => {
	if (search) {
		itemIdSearch = value;
	} else {
		itemId = value;
	}
};
