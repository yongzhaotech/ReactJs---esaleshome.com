import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
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
	saveStateObjects,
} from '../action';
import { PageVars, StaticVars } from '../static/static-vars';
import { route } from '../utils';

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
