import { useCallback } from 'react';
import { messageCenter, ADD_MESSAGE } from '../action';
import {  useDispatch } from 'react-redux';

type Callback = (() => void) | null | undefined;

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

	const confirm = useCallback(
		(message: string, callBackFuncRef?: Callback, cancelFuncRef?: Callback) => {
			setTimeout(() => {
				dispatch(messageCenter(ADD_MESSAGE, message, false, addCallBack(callBackFuncRef, cancelFuncRef)));
			}, 0);
		},
		[dispatch]
	);

	return { confirm };
};
