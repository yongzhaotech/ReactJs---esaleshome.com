import React, { createContext, useMemo, useCallback, useContext } from 'react';

type CreateReference = (element: HTMLElement | null) => void;

type ContextType = {
	actionBox: HTMLElement | null;
	menuBox: HTMLElement | null;
	messageBox: HTMLElement | null;
	createActionReference: CreateReference;
	createMessageReference: CreateReference;
	clearActionBox: () => void;
	clearMenuBox: () => void;
	clearMessageBox: () => void;
};

type ReferenceContextProviderProps = {
	children: React.ReactNode;
};

export const Context = createContext<ContextType | null>(null);

export const ReferenceContext = ({ children }: ReferenceContextProviderProps) => {
	const [actionBox, setActionBox] = React.useState<HTMLElement | null>(null);
	const [menuBox, setMenuBox] = React.useState<HTMLElement | null>(null);
	const [messageBox, setMessageBox] = React.useState<HTMLElement | null>(null);

	const clearActionBox = useCallback(() => setActionBox(null), []);
	const clearMenuBox = useCallback(() => setMenuBox(null), []);
	const clearMessageBox = useCallback(() => setMessageBox(null), []);

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

	const value = useMemo(
		() => ({
			actionBox,
			menuBox,
			messageBox,
			createActionReference,
			createMessageReference,
			clearActionBox,
			clearMenuBox,
			clearMessageBox,
		}),
		[
			actionBox,
			menuBox,
			messageBox,
			clearActionBox,
			clearMenuBox,
			clearMessageBox,
			createActionReference,
			createMessageReference,
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
