import React, { createContext, useMemo, useCallback, useContext } from 'react';

type CreateReference = (element: HTMLElement | null) => void;

type ContextType = {
	actionBox: HTMLElement | null;
	menuBox: HTMLElement | null;
	messageBox: HTMLElement | null;
	imageBox: HTMLElement | null;
	createActionReference: CreateReference;
	createMessageReference: CreateReference;
	clearActionBox: () => void;
	clearMenuBox: () => void;
	clearMessageBox: () => void;
	clearImageBox: () => void;
};

type ReferenceContextProviderProps = {
	children: React.ReactNode;
};

export const Context = createContext<ContextType | null>(null);

export const ReferenceContext = ({ children }: ReferenceContextProviderProps) => {
	const [actionBox, setActionBox] = React.useState<HTMLElement | null>(null);
	const [menuBox, setMenuBox] = React.useState<HTMLElement | null>(null);
	const [messageBox, setMessageBox] = React.useState<HTMLElement | null>(null);
	const [imageBox, setImageBox] = React.useState<HTMLElement | null>(null);

	const clearActionBox = useCallback(() => setActionBox(null), []);
	const clearMenuBox = useCallback(() => setMenuBox(null), []);
	const clearMessageBox = useCallback(() => setMessageBox(null), []);
	const clearImageBox = useCallback(() => setImageBox(null), []);

	const createActionReference = useCallback((element: HTMLElement | null) => {
		if (element) {
			setActionBox(element);
		}
	}, []);

	const createMessageReference = useCallback((element: HTMLElement | null) => {
		if (element) {
			setMessageBox(element);
		}
	}, []);

		const createImageReference = useCallback((element: HTMLElement | null) => {
		if (element) {
			setImageBox(element);
		}
	}, []);

	const value = useMemo(
		() => ({
			actionBox,
			menuBox,
			messageBox,
			imageBox,
			createActionReference,
			createMessageReference,
			createImageReference,
			clearActionBox,
			clearMenuBox,
			clearMessageBox,
			clearImageBox
		}),
		[
			actionBox,
			menuBox,
			messageBox,
			imageBox,
			clearActionBox,
			clearMenuBox,
			clearMessageBox,
			createActionReference,
			createMessageReference,
			createImageReference,
			clearImageBox
		]
	);

	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useReferenceContext = () => {
	const context = useContext(Context);
	if (!context) {
		throw new Error('useReferenceContext must be used within a ReferenceContext Provider');
	}
	return context;
};
