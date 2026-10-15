import { useSelector } from 'react-redux';
import type { Label } from './label';
import RootReducer from '../reducer';
import { LangMessages } from '../static/langs';
import type { Language } from '../static/langs';

type RootState = ReturnType<typeof RootReducer>;

export const useLocalizedLabel = () => {
	const language = useSelector((state: RootState): Language => (state.language === 'cn' ? 'cn' : 'en'));

	return (label: Label): string => LangMessages[label][language];
};
