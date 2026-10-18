import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Cookies } from 'react-cookie';

type Lang = 'en' | 'cn';

type SessionContextType = {
	lang: Lang;
	userSignedIn: boolean;
	toggleLang: () => void;

};

type SessionContextProviderProps = {
	cookies: Cookies;
	children: React.ReactNode;
};

const initialContext: SessionContextType = {
    lang: 'en',
    userSignedIn: false,
    toggleLang: () => {},

};

export const Context = createContext<SessionContextType>(initialContext);

export const SessionContext = ({ cookies, children }: SessionContextProviderProps) => {
    const lang = (cookies.get('lang') ?? 'en') as Lang;
    const userSignedIn = !!cookies.get('userSignedIn');
    const setCookie = useCallback(
        (name: string, value: string, options={ path: '/' }) => {
            cookies.set(name, value, options);
        },
        [cookies]
    );
	const toggleLang = useCallback(() => {
        setCookie('lang', lang === 'en' ? 'cn' : 'en', { path: '/' });
	}, [setCookie, lang]);

	const value = useMemo(
		() => ({
			lang,
			userSignedIn,
			toggleLang,
	
		}),
		[userSignedIn, toggleLang,   lang]
	);

	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSessionContext = () => {
	const context = useContext(Context);
	if (!context) {
		throw new Error('useSessionContext must be used within a SessionContextProvider');
	}
	return context;
}
