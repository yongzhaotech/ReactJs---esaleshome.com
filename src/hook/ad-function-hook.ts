import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

type Callback = (() => void) | null | undefined;

type RootState = ReturnType<typeof RootReducer>;

type MODELSState = {
	images?: number[];
	is_free: string;
	currency: string;
};

const allowedImageNumber = StaticVars.inum;

export const useFunctions = () => {
	const dispatch = useDispatch();
	const MODELS = useSelector((state: RootState) => state.MODELS) as MODELSState;
	const { images: addedImages = [], currency: currentCurrency, is_free: isFree } = MODELS;

	const maximumImagesNumberReached = addedImages.length >= allowedImageNumber;

	const { itemIsFree, itemIsNotFree } = useMemo(() => {
		const nothing = isFree === null;

		return {
			itemIsFree: !nothing && +isFree === 1,
			itemIsNotFree: !nothing && +isFree === 0,
		};
	}, [isFree]);

	const setItemFree = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.preventDefault();
			if (itemIsFree) {
				return;
			}
			dispatch(
				updateStateModelData({
					price: '',
					is_free: '1',
					currency: '',
				})
			);
		},
		[dispatch, itemIsFree]
	);

	const setItemNotFree = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.preventDefault();
			if (itemIsNotFree) {
				return;
			}
			dispatch(
				updateStateModelData({
					is_free: '0',
				})
			);
		},
		[dispatch, itemIsNotFree]
	);

	const setCurrency = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			const currency = target.dataset.value;
			if (currentCurrency !== currency) {
				dispatch(
					updateStateModelData({
						currency,
					})
				);
			}
		},
		[dispatch, currentCurrency]
	);

	const addImage = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.preventDefault();
			const addedImagesCount = addedImages.length;
			const addedImageNumber = addedImagesCount === 0 ? 1 : +addedImages[addedImagesCount - 1] + 1;
			const images = [...addedImages, addedImageNumber];
			dispatch(
				updateStateModelData({
					images,
				})
			);
		},
		[addedImages, dispatch]
	);

	return {
		itemIsFree,
		itemIsNotFree,
		maximumImagesNumberReached,
		setItemFree,
		setItemNotFree,
		setCurrency,
		addImage,
	};
};
