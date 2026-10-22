import React, { createContext, useMemo, useCallback, useContext } from 'react';

type ContextType = {
	actionBox: HTMLElement | null;
	menuBox: HTMLElement | null;
	messageBox: HTMLElement | null;
	createActionReference: (element: HTMLElement | null) => void;
	setMenuBox: (element: HTMLElement | null) => void;
	setMessageBox: (element: HTMLElement | null) => void;
	clearActionBox: () => void;
	clearMenuBox: () => void;
	clearMessageBox: () => void;
};

type ReferenceContextProviderProps = {
	children: React.ReactNode;
};

const initialContext: ContextType = {
	actionBox: null,
	menuBox: null,
	messageBox: null,
	createActionReference: () => {},
	setMenuBox: () => {},
	setMessageBox: () => {},
	clearActionBox: () => {},
	clearMenuBox: () => {},
	clearMessageBox: () => {},
};

export const Context = createContext<ContextType>(initialContext);

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

	const value = useMemo(
		() => ({
			actionBox,
			menuBox,
			messageBox,
			createActionReference,
			setMenuBox,
			setMessageBox,
			clearActionBox,
			clearMenuBox,
			clearMessageBox,
		}),
		[actionBox, menuBox, messageBox, clearActionBox, clearMenuBox, clearMessageBox, createActionReference]
	);

	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useReferenceContext = () => {
	const context = useContext(Context);
	if (!context) {
		throw new Error('useReferenceContext must be used within a SessionContextProvider');
	}
	return context;
};
