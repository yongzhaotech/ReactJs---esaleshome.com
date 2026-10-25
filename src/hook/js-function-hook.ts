import { useCallback } from 'react';
import { clearStateModelData, addPostErrors, setDropDownMenus, setActionBox, addErrors } from '../action';
import { useDispatch, useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { route } from '../utils';
import { AdFuncs } from '../common/ad-funcs';

type Callback = (() => void) | null | undefined;

type RootState = ReturnType<typeof RootReducer>;

type BoxesState = {
	box: string | null;
};

export const addCallBack = (callBackFuncRef: Callback, cancelFuncRef: Callback): Record<string, unknown> | null => {
	let callInfo = null;

	// clearCallBack();

	if (callBackFuncRef) {
		callInfo = { callBackFuncRef, functionFlag: true };
	}
	if (cancelFuncRef) {
		callInfo = { ...(callInfo || {}), ...{ cancelFuncRef } };
	}

	return callInfo;
};

export const useFunctions = () => {
	const dispatch = useDispatch();
	const { box } = useSelector((state: RootState) => state.BOXES) as BoxesState;

	const launchMenu = useCallback(
		(boxName: string) => {
			if (boxName === 'find_visitor_ad' && route.path === '/ads/visitor-ad/edit') {
				return;
			}

			dispatch(setDropDownMenus());
			if (box !== boxName) {
				dispatch(setActionBox({ box: boxName }));
				dispatch(addErrors());
			}
		},
		[dispatch, box]
	);

	const openMenu = useCallback(() => {
		dispatch(setDropDownMenus());
	}, [dispatch]);

	const clearScreen = useCallback(() => {
		dispatch(setActionBox({ box: null }));
		dispatch(addErrors());
		dispatch(addPostErrors());
		dispatch(clearStateModelData());
		AdFuncs.clearScreen();
	}, [dispatch]);

	return { launchMenu, clearScreen, openMenu };
};
