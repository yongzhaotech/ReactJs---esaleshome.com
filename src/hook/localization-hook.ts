import { useContext } from 'react';
import { LangMessages } from '../static/langs';
import { Context as localization } from '../context/session-context';

export type Label = keyof typeof LangMessages;

export const useLocalizedLabel = () => {
	const { lang } = useContext(localization);

	return (label: Label): string => LangMessages[label][lang];
};
