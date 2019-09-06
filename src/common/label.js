import { LangMessages } from '../static/langs';
import { Engine } from './engine';

const getLabel = label => {
	return LangMessages[label][Engine.store().language];
}

export { getLabel };
