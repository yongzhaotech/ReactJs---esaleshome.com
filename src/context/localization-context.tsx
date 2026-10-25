import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { LangMessages, Language } from '../static/langs';

type SessionContextType = {
	lang: Language;
	toggleLang: () => void;
	getLocalizedLabel: (label: Label) => string;
};

export type Label = keyof typeof LangMessages;

type SessionContextProviderProps = {
	cookies: Cookies;
	children: React.ReactNode;
};

const initialContext: SessionContextType = {
	lang: 'en',
	toggleLang: () => {},
	getLocalizedLabel: () => '',
};

export const Context = createContext<SessionContextType>(initialContext);

export const LocalizationContext = ({ cookies, children }: SessionContextProviderProps) => {
	const lang = (cookies.get('lang') ?? 'en') as Language;
	const setCookie = useCallback(
		(name: string, value: string, options = { path: '/' }) => {
			cookies.set(name, value, options);
		},
		[cookies]
	);
	const toggleLang = useCallback(() => {
		setCookie('lang', lang === 'en' ? 'cn' : 'en', { path: '/' });
	}, [setCookie, lang]);

	const getLocalizedLabel = useCallback((label: Label) => LangMessages[label][lang], [lang]);

	const value = useMemo(
		() => ({
			lang,
			toggleLang,
			getLocalizedLabel,
		}),
		[toggleLang, lang, getLocalizedLabel]
	);

	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useLocalizationContext = () => {
	const context = useContext(Context);
	if (!context) {
		throw new Error('useSessionContext must be used within a SessionContextProvider');
	}
	return context;
};
