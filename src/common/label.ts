import { LangMessages } from '../static/langs';
import type { Language } from '../static/langs';
import { Engine } from './engine';

export type Label = keyof typeof LangMessages;

const getLabel = (label: Label): string => {
	const language: Language = Engine.store().language;
	return LangMessages[label][language];
};

export { getLabel };
